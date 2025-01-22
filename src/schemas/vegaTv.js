export default {
  name: "vegaTv",
  title: "Vega TV",
  type: "document",
  fields: [
    {
      name: "videoUrls",
      title: "Video URLs",
      type: "array",
      of: [{ type: "url" }],
    },
  ],
};
