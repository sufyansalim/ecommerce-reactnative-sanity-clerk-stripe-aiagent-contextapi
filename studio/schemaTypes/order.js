export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'userId',
      title: 'User ID (Clerk)',
      type: 'string',
      description: 'The Clerk user ID who placed the order',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
    },
    {
      name: 'userName',
      title: 'User Name',
      type: 'string',
    },
    {
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      description: 'Stripe Checkout Session ID',
    },
    {
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      description: 'Stripe Payment Intent ID for refunds/tracking',
    },
    {
      name: 'lineItems',
      title: 'Line Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'lineItem',
          fields: [
            {
              name: 'productId',
              title: 'Product ID',
              type: 'string',
            },
            {
              name: 'productSlug',
              title: 'Product Slug',
              type: 'string',
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'image',
              title: 'Image',
              type: 'string',
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
            },
            {
              name: 'price',
              title: 'Unit Price',
              type: 'number',
              description: 'Price at time of purchase',
            },
          ],
          preview: {
            select: {
              title: 'title',
              quantity: 'quantity',
              price: 'price',
            },
            prepare({title, quantity, price}) {
              return {
                title: title || 'Unknown Product',
                subtitle: `Qty: ${quantity || 0} × $${price || 0}`,
              }
            },
          },
        },
      ],
    },
    {
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      description: 'Total before shipping/tax',
    },
    {
      name: 'shippingCost',
      title: 'Shipping Cost',
      type: 'number',
    },
    {
      name: 'tax',
      title: 'Tax',
      type: 'number',
    },
    {
      name: 'total',
      title: 'Total',
      type: 'number',
      description: 'Final amount charged',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          {title: 'USD', value: 'usd'},
          {title: 'QAR', value: 'qar'},
          {title: 'AED', value: 'aed'},
        ],
      },
      initialValue: 'usd',
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      description: 'Address collected by Stripe Checkout',
      fields: [
        {name: 'name', title: 'Name', type: 'string'},
        {name: 'line1', title: 'Address Line 1', type: 'string'},
        {name: 'line2', title: 'Address Line 2', type: 'string'},
        {name: 'city', title: 'City', type: 'string'},
        {name: 'state', title: 'State/Province', type: 'string'},
        {name: 'postalCode', title: 'Postal Code', type: 'string'},
        {name: 'country', title: 'Country', type: 'string'},
      ],
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending Payment', value: 'pending'},
          {title: 'Paid', value: 'paid'},
          {title: 'Processing', value: 'processing'},
          {title: 'Shipped', value: 'shipped'},
          {title: 'Delivered', value: 'delivered'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Refunded', value: 'refunded'},
        ],
      },
      initialValue: 'pending',
    },
    {
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
    },
    {
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    },
    {
      name: 'paidAt',
      title: 'Paid At',
      type: 'datetime',
    },
  ],
  orderings: [
    {
      title: 'Order Date (Newest First)',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Order Date (Oldest First)',
      name: 'createdAtAsc',
      by: [{field: 'createdAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      userName: 'userName',
      total: 'total',
      status: 'status',
      createdAt: 'createdAt',
    },
    prepare({orderNumber, userName, total, status, createdAt}) {
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : ''
      return {
        title: `#${orderNumber || 'N/A'} - ${userName || 'Unknown'}`,
        subtitle: `$${total || 0} • ${status || 'pending'} • ${date}`,
      }
    },
  },
}
