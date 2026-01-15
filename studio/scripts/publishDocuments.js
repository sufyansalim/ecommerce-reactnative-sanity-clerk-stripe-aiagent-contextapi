#!/usr/bin/env node

/**
 * Sanity Document Publisher Script
 * 
 * Usage:
 *   node scripts/publishDocuments.js                    # Publish all drafts
 *   node scripts/publishDocuments.js --type=product     # Publish all product drafts
 *   node scripts/publishDocuments.js --ids=id1,id2,id3  # Publish specific document IDs
 *   node scripts/publishDocuments.js --dry-run          # Preview what would be published
 */

const { createClient } = require('@sanity/client');
const path = require('path');

// Load .env from project root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Configuration from .env
const config = {
  projectId: process.env.SANITY_PROJECT_ID || 'n56u81sg',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
};

const client = createClient(config);

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: null,
    ids: [],
    dryRun: false,
  };

  args.forEach(arg => {
    if (arg.startsWith('--type=')) {
      options.type = arg.split('=')[1];
    } else if (arg.startsWith('--ids=')) {
      options.ids = arg.split('=')[1].split(',').map(id => id.trim());
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    }
  });

  return options;
}

// Get all draft documents
async function getDrafts(type = null) {
  let query = '*[_id in path("drafts.**")]';
  
  if (type) {
    query = `*[_id in path("drafts.**") && _type == "${type}"]`;
  }
  
  query += ' { _id, _type, title, name }';
  
  return client.fetch(query);
}

// Get specific drafts by IDs
async function getDraftsByIds(ids) {
  const draftIds = ids.map(id => id.startsWith('drafts.') ? id : `drafts.${id}`);
  const query = `*[_id in $ids] { _id, _type, title, name }`;
  return client.fetch(query, { ids: draftIds });
}

// Publish a single document
async function publishDocument(draftId) {
  const publishedId = draftId.replace('drafts.', '');
  
  // Get the draft document
  const draft = await client.getDocument(draftId);
  
  if (!draft) {
    console.log(`  ⚠️  Draft not found: ${draftId}`);
    return null;
  }

  // Create a transaction to publish
  const transaction = client.transaction();
  
  // Create or replace the published document
  transaction.createOrReplace({
    ...draft,
    _id: publishedId,
  });
  
  // Delete the draft
  transaction.delete(draftId);
  
  // Commit the transaction
  await transaction.commit();
  
  return publishedId;
}

// Publish multiple documents
async function publishDocuments(drafts, dryRun = false) {
  console.log(`\n📋 Found ${drafts.length} draft(s) to publish:\n`);
  
  drafts.forEach((draft, index) => {
    const name = draft.title || draft.name || 'Untitled';
    console.log(`  ${index + 1}. [${draft._type}] ${name} (${draft._id})`);
  });
  
  if (dryRun) {
    console.log('\n🔍 Dry run mode - no documents were published.\n');
    return;
  }
  
  console.log('\n🚀 Publishing documents...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const draft of drafts) {
    const name = draft.title || draft.name || 'Untitled';
    try {
      const publishedId = await publishDocument(draft._id);
      if (publishedId) {
        console.log(`  ✅ Published: ${name}`);
        successCount++;
      }
    } catch (error) {
      console.log(`  ❌ Failed: ${name} - ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n📊 Results: ${successCount} published, ${failCount} failed\n`);
}

// Batch publish using transactions (more efficient for many documents)
async function batchPublishDocuments(drafts, dryRun = false) {
  console.log(`\n📋 Found ${drafts.length} draft(s) to publish:\n`);
  
  drafts.forEach((draft, index) => {
    const name = draft.title || draft.name || 'Untitled';
    console.log(`  ${index + 1}. [${draft._type}] ${name}`);
  });
  
  if (dryRun) {
    console.log('\n🔍 Dry run mode - no documents were published.\n');
    return;
  }
  
  console.log('\n🚀 Publishing documents in batch...\n');
  
  try {
    // Process in batches of 100 (Sanity's limit)
    const batchSize = 100;
    let totalPublished = 0;
    
    for (let i = 0; i < drafts.length; i += batchSize) {
      const batch = drafts.slice(i, i + batchSize);
      const transaction = client.transaction();
      
      for (const draft of batch) {
        const fullDraft = await client.getDocument(draft._id);
        if (fullDraft) {
          const publishedId = draft._id.replace('drafts.', '');
          transaction.createOrReplace({ ...fullDraft, _id: publishedId });
          transaction.delete(draft._id);
        }
      }
      
      await transaction.commit();
      totalPublished += batch.length;
      console.log(`  ✅ Published batch ${Math.floor(i / batchSize) + 1}: ${batch.length} documents`);
    }
    
    console.log(`\n📊 Successfully published ${totalPublished} documents!\n`);
  } catch (error) {
    console.error(`\n❌ Batch publish failed: ${error.message}\n`);
  }
}

// Main function
async function main() {
  const options = parseArgs();
  
  console.log('\n🔌 Connecting to Sanity...');
  console.log(`   Project: ${config.projectId}`);
  console.log(`   Dataset: ${config.dataset}`);
  
  if (!config.token) {
    console.log('\n⚠️  Warning: No SANITY_TOKEN set. You may need to set it for write operations.');
    console.log('   Run: export SANITY_TOKEN=your-token-here\n');
  }
  
  let drafts;
  
  if (options.ids.length > 0) {
    console.log(`\n🔍 Looking for specific documents: ${options.ids.join(', ')}`);
    drafts = await getDraftsByIds(options.ids);
  } else if (options.type) {
    console.log(`\n🔍 Looking for ${options.type} drafts...`);
    drafts = await getDrafts(options.type);
  } else {
    console.log('\n🔍 Looking for all drafts...');
    drafts = await getDrafts();
  }
  
  if (drafts.length === 0) {
    console.log('\n✨ No drafts found to publish!\n');
    return;
  }
  
  // Use batch publish for efficiency
  if (drafts.length > 10) {
    await batchPublishDocuments(drafts, options.dryRun);
  } else {
    await publishDocuments(drafts, options.dryRun);
  }
}

// Run the script
main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
