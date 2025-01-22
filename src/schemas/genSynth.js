export default {
  name: "Gen-Synth",
  title: "Gen-Synth",
  type: "document",
  fields: [
    {
      name: "header",
      title: "Header",
      type: "string",
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
      name: "videos",
      title: "Videos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "videoUrl",
              title: "Video URL",
              type: "url",
            },
            {
              name: "videoLink",
              title: "Video Link",
              type: "url",
            },
            {
              name: "thumbnail",
              title: "Thumbnail",
              type: "image",
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
  ],
};
