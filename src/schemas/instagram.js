import { v4 as uuidv4 } from "uuid";

export default {
  name: "instagram",
  title: "Instagram",
  type: "document",
  document: {
    preparation: (doc) => {
      if (doc.posts && Array.isArray(doc.posts)) {
        doc.posts = doc.posts.map((post) => {
          if (!post.id) {
            return {
              ...post,
              id: uuidv4(),
            };
          }
          return post;
        });
      }
      return doc;
    },
  },
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      description: "A title for the Instagram feed section",
    },
    {
      name: "posts",
      title: "Posts",
      type: "array",
      of: [
        {
          type: "object",
          name: "post",
          title: "Post",
          preview: {
            select: {
              title: "caption",
              subtitle: "timestamp",
              media_type: "media_type",
            },
            prepare({ title, subtitle, media_type }) {
              return {
                title: title || "No caption",
                subtitle: subtitle
                  ? new Date(subtitle).toLocaleDateString()
                  : media_type === "VIDEO"
                    ? "Video post"
                    : "Image post",
                media: null,
              };
            },
          },
          fields: [
            {
              name: "id",
              title: "ID",
              type: "string",
              description: "Auto-generated unique identifier",
              hidden: true,
            },
            {
              name: "media_type",
              title: "Media Type",
              type: "string",
              options: {
                list: [
                  { title: "Image", value: "IMAGE" },
                  { title: "Video", value: "VIDEO" },
                ],
              },
            },
            {
              name: "media_url",
              title: "Media URL",
              type: "url",
              description: "URL to the image or video content",
            },
            {
              name: "thumbnail_url",
              title: "Thumbnail URL",
              type: "url",
              description:
                "Only needed for videos - URL to the video thumbnail",
            },
            {
              name: "permalink",
              title: "Permalink",
              type: "url",
              description: "Link to the original Instagram post",
            },
            {
              name: "caption",
              title: "Caption",
              type: "text",
              description: "The post caption text",
            },
            {
              name: "timestamp",
              title: "Timestamp",
              type: "datetime",
              description: "When the post was published",
            },
            {
              name: "likes",
              title: "Likes Count",
              type: "number",
              description: "Approximate number of likes",
            },
            {
              name: "comments",
              title: "Comments Count",
              type: "number",
              description: "Approximate number of comments",
            },
          ],
        },
      ],
    },
    {
      name: "instagramProfile",
      title: "Instagram Profile URL",
      type: "url",
      description: "Link to your Instagram profile",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }).optional(),
    },
  ],
  preview: {
    select: {
      title: "title",
      posts: "posts",
    },
    prepare({ title, posts }) {
      return {
        title: title || "Instagram Feed",
        subtitle: `${posts?.length || 0} posts`,
      };
    },
  },
};
