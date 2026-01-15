#!/usr/bin/env node

/**
 * Sanity Bulk Operations Script
 * 
 * Usage:
 *   node scripts/sanityBulk.js publish                        # Publish all drafts
 *   node scripts/sanityBulk.js publish --type=product         # Publish all product drafts
 *   node scripts/sanityBulk.js discard                        # Discard all drafts
 *   node scripts/sanityBulk.js list                           # List all drafts
 *   node scripts/sanityBulk.js update --type=tvShow --field=videoUrl --value="https://..."
 *   node scripts/sanityBulk.js --dry-run                      # Preview mode
 */

const { createClient } = require('@sanity/client');
const path = require('path');

// Load .env from project root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

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
  const command = args[0] || 'list';
  const options = {
    command,
    type: null,
    field: null,
    value: null,
    ids: [],
    dryRun: false,
  };

  args.slice(1).forEach(arg => {
    if (arg.startsWith('--type=')) options.type = arg.split('=')[1];
    else if (arg.startsWith('--field=')) options.field = arg.split('=')[1];
    else if (arg.startsWith('--value=')) options.value = arg.split('=')[1];
    else if (arg.startsWith('--ids=')) options.ids = arg.split('=')[1].split(',');
    else if (arg === '--dry-run') options.dryRun = true;
  });

  return options;
}

// List drafts
async function listDrafts(type) {
  let query = '*[_id in path("drafts.**")]';
  if (type) query = `*[_id in path("drafts.**") && _type == "${type}"]`;
  query += ' | order(_type asc) { _id, _type, title, name, _updatedAt }';
  
  const drafts = await client.fetch(query);
  
  console.log(`\n📋 Found ${drafts.length} draft(s):\n`);
  
  if (drafts.length === 0) {
    console.log('  No drafts found.\n');
    return;
  }
  
  // Group by type
  const grouped = drafts.reduce((acc, d) => {
    acc[d._type] = acc[d._type] || [];
    acc[d._type].push(d);
    return acc;
  }, {});
  
  Object.entries(grouped).forEach(([type, docs]) => {
    console.log(`  ${type} (${docs.length}):`);
    docs.forEach(d => {
      const name = d.title || d.name || 'Untitled';
      console.log(`    - ${name}`);
    });
  });
  console.log('');
}

// Publish all drafts
async function publishAll(type, dryRun) {
  let query = '*[_id in path("drafts.**")]';
  if (type) query = `*[_id in path("drafts.**") && _type == "${type}"]`;
  query += ' { _id, _type, title, name }';
  
  const drafts = await client.fetch(query);
  
  console.log(`\n📋 Found ${drafts.length} draft(s) to publish\n`);
  
  if (drafts.length === 0 || dryRun) {
    if (dryRun) console.log('🔍 Dry run - no changes made.\n');
    return;
  }
  
  const transaction = client.transaction();
  
  for (const draft of drafts) {
    const fullDoc = await client.getDocument(draft._id);
    if (fullDoc) {
      const publishedId = draft._id.replace('drafts.', '');
      transaction.createOrReplace({ ...fullDoc, _id: publishedId });
      transaction.delete(draft._id);
    }
  }
  
  await transaction.commit();
  console.log(`✅ Published ${drafts.length} documents!\n`);
}

// Discard all drafts
async function discardAll(type, dryRun) {
  let query = '*[_id in path("drafts.**")]';
  if (type) query = `*[_id in path("drafts.**") && _type == "${type}"]`;
  query += ' { _id, _type, title, name }';
  
  const drafts = await client.fetch(query);
  
  console.log(`\n📋 Found ${drafts.length} draft(s) to discard\n`);
  
  if (drafts.length === 0 || dryRun) {
    if (dryRun) console.log('🔍 Dry run - no changes made.\n');
    return;
  }
  
  const transaction = client.transaction();
  drafts.forEach(d => transaction.delete(d._id));
  
  await transaction.commit();
  console.log(`🗑️  Discarded ${drafts.length} drafts!\n`);
}

// Bulk update a field
async function bulkUpdate(type, field, value, dryRun) {
  if (!type || !field || value === null) {
    console.log('\n❌ Usage: update --type=TYPE --field=FIELD --value=VALUE\n');
    return;
  }
  
  const query = `*[_type == "${type}"] { _id, _type, title, name, ${field} }`;
  const docs = await client.fetch(query);
  
  console.log(`\n📋 Found ${docs.length} ${type} document(s) to update\n`);
  console.log(`   Setting ${field} = "${value}"\n`);
  
  if (docs.length === 0 || dryRun) {
    if (dryRun) console.log('🔍 Dry run - no changes made.\n');
    return;
  }
  
  const transaction = client.transaction();
  
  docs.forEach(doc => {
    transaction.patch(doc._id, { set: { [field]: value } });
  });
  
  await transaction.commit();
  console.log(`✅ Updated ${docs.length} documents!\n`);
  
  // Publish the changes
  console.log('📤 Publishing changes...');
  await publishAll(type, false);
}

// Main
async function main() {
  const opts = parseArgs();
  
  console.log('\n🔌 Sanity Bulk Operations');
  console.log(`   Project: ${config.projectId} | Dataset: ${config.dataset}`);
  
  switch (opts.command) {
    case 'list':
      await listDrafts(opts.type);
      break;
    case 'publish':
      await publishAll(opts.type, opts.dryRun);
      break;
    case 'discard':
      await discardAll(opts.type, opts.dryRun);
      break;
    case 'update':
      await bulkUpdate(opts.type, opts.field, opts.value, opts.dryRun);
      break;
    default:
      console.log(`\n❌ Unknown command: ${opts.command}`);
      console.log('   Available: list, publish, discard, update\n');
  }
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
