import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'celebrity',
  title: 'Celebrity',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Celebrity Name',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'url',
      description: 'Square profile photo',
    }),
    defineField({
      name: 'banner',
      title: 'Banner Image',
      type: 'url',
      description: 'Wide banner image for celebrity page header',
    }),
    defineField({
      name: 'products',
      title: 'Endorsed Products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      description: 'Products this celebrity endorses',
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
