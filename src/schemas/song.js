export default {
  name: "song",
  title: "Songs",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "artist",
      title: "Artist",
      type: "string",
    },
    {
      name: "cover",
      title: "Cover Image",
      type: "image",
    },
    {
      name: "audio",
      title: "Audio File",
      type: "file",
    },
    {
      name: "color",
      title: "Colors",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "hex",
              title: "Hex Color",
              type: "string",
            },
            {
              name: "alpha",
              title: "Alpha",
              type: "number",
            },
            {
              name: "hsl",
              title: "HSL",
              type: "object",
              fields: [
                { name: "h", title: "Hue", type: "number" },
                { name: "s", title: "Saturation", type: "number" },
                { name: "l", title: "Lightness", type: "number" },
                { name: "a", title: "Alpha", type: "number" },
              ],
            },
            {
              name: "hsv",
              title: "HSV",
              type: "object",
              fields: [
                { name: "h", title: "Hue", type: "number" },
                { name: "s", title: "Saturation", type: "number" },
                { name: "v", title: "Value", type: "number" },
                { name: "a", title: "Alpha", type: "number" },
              ],
            },
            {
              name: "rgb",
              title: "RGB",
              type: "object",
              fields: [
                { name: "r", title: "Red", type: "number" },
                { name: "g", title: "Green", type: "number" },
                { name: "b", title: "Blue", type: "number" },
                { name: "a", title: "Alpha", type: "number" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "active",
      title: "Active",
      type: "boolean",
    },
  ],
};
