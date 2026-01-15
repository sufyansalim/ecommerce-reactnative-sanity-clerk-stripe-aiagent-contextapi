import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'tvShow',
  title: 'TV Show',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Show Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      title: 'Thumbnail Image',
      type: 'url',
      description: 'Preview image for the show',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Vimeo or YouTube embed URL',
    }),
    defineField({
      name: 'products',
      title: 'Featured Products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      description: 'Products featured in this show',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      products: 'products',
    },
    prepare({title, products}) {
      return {
        title: title,
        subtitle: `${products?.length || 0} products`,
      }
    },
  },
})
