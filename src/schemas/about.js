export default {
  name: "about",
  title: "About",
  type: "document",
  fields: [
    {
      name: "header",
      title: "Header",
      type: "string",
    },
    {
      name: "logoWebm",
      title: "Logo (WebM)",
      type: "file",
    },
    {
      name: "logoMov",
      title: "Logo (MOV)",
      type: "file",
    },
    {
      name: "imagesGallery",
      title: "Images Gallery",
      type: "array",
      of: [{ type: "image" }],
    },
    {
      name: "body",
      title: "Body",
      type: "text",
    },
    {
      name: "imagesGallery2",
      title: "Team Gallery",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },
            {
              name: "name",
              title: "Name",
              type: "string",
            },
            {
              name: "title",
              title: "Title",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "body2",
      title: "Body 2",
      type: "text",
    },
    {
      name: "skill1",
      title: "Skill Set 1",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
        },
        {
          name: "list",
          title: "List",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    },
    {
      name: "skill2",
      title: "Skill Set 2",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
        },
        {
          name: "list",
          title: "List",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    },
    {
      name: "skill3",
      title: "Skill Set 3",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
        },
        {
          name: "list",
          title: "List",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    },
  ],
};
