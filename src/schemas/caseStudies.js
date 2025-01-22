export default {
  name: "caseStudies",
  title: "Case Studies",
  type: "document",
  fields: [
    {
      name: "header",
      title: "Header",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "body",
      title: "Body",
      type: "text",
    },
    {
      name: "projectBreakdown",
      title: "Project Breakdown",
      type: "text",
    },
    {
      name: "portrait",
      title: "Portrait Images",
      type: "array",
      of: [{ type: "image" }],
    },
    {
      name: "imageGallery1",
      title: "Image Gallery 1",
      type: "array",
      of: [{ type: "image" }],
    },
    {
      name: "body2",
      title: "Body 2",
      type: "text",
    },
    {
      name: "order",
      title: "Order",
      type: "number",
    },
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    },
    {
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
};
