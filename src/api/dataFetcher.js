import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { INSTAGRAM_FEED } from "../types/instagram";
import { withCache } from "../utils/cache";

const client = createClient({
  projectId: "yqk7lu4g",
  dataset: "production",
  apiVersion: "2023-03-11",
  token: process.env.SANITY_TOKEN,
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

export const fetchCaseStudies = withCache('caseStudies', async () => {
  return client.fetch(`*[_type == "caseStudies" && !(_id in path("drafts.**"))]{
    header,
    image {
      asset->{url, metadata},
      hotspot
    },
    featuredImage,
    body,
    projectBreakdown,
    portrait[]{
      asset->{_id, _type, url}
    },
    imageGallery1,
    body2,
    order,
    title,
    subtitle,
    services
  } | order(order asc)`);
});

export const VegaTvData = withCache('vegaTv', async () => {
  return client.fetch('*[_type == "vegaTv"][0]');
});

export const fetchAboutData = withCache('about', async () => {
  return client.fetch(`*[_type == "about"]{
    header,
    "logoUrl": logo.asset->url,
    imagesGallery,
    body,
    imagesGallery2[] {
      image {
        asset->,
        hotspot,
        crop
      },
      name,
      title
    },
    body2,
    skill1 {
      title,
      list
    },
    skill2 {
      title,
      list
    },
    skill3 {
      title,
      list
    }
  }`);
});

export const fetchTransparencyData = withCache('transparency', async () => {
  return client.fetch(`*[_type == "transparency"]{
    header,
    imagesGallery,
    body,
    videos[]{
      videoUrl,
      thumbnail
    },
    body2,
  }`);
});

export const fetchSongData = withCache('songData', async () => {
  return client.fetch(`*[_type == "song"] {
    _id,
    _createdAt,
    _updatedAt,
    name,
    artist,
    cover,
    audio,
    color[]{
      _key,
      _type,
      alpha,
      hex,
      hsl->{
        _type,
        h,
        s,
        l,
        a
      },
      hsv->{
        _type,
        h,
        s,
        v,
        a
      },
      rgb->{
        _type,
        r,
        g,
        b,
        a
      }
    },
    active
  }`);
});

export const fetchWeatherData = withCache('weather', async () => {
  const weatherKey = process.env.NEXT_PUBLIC_WEATHER_KEY;
  const location = "new york";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${weatherKey}`;
  const response = await fetch(url);
  return response.json();
});

export async function fetchInstagramData() {
  const apiKey = process.env.NEXT_PUBLIC_INSTAGRAM_KEY;
  const instagramUrl = `http://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type,permalink,thumbnail_url&access_token=${apiKey}`;
  const instagramData = await fetch(instagramUrl);
  return instagramData.json();
}

export const fetchSanityInstagramData = withCache('instagram-v2', async () => {
  const { v4: uuidv4 } = await import("uuid");

  try {
    // Get data from Sanity
    const sanityData = await client.fetch(`*[_type == "instagram"][0] {
      title,
      "posts": posts[] {
        id,
        media_type,
        media_url,
        thumbnail_url,
        permalink,
        caption,
        timestamp,
        likes,
        comments
      },
      instagramProfile
    }`);

    // If we got data from Sanity, ensure IDs
    if (sanityData && sanityData.posts && sanityData.posts.length > 0) {
      sanityData.posts = sanityData.posts.map((post) => ({
        ...post,
        id: post.id || uuidv4(),
      }));

      // Return only Sanity posts (no combining with old data)
      return {
        ...sanityData,
        posts: sanityData.posts,
      };
    }

    // If no Sanity data, return an object with default feed
    return {
      title: "Instagram Feed",
      posts: INSTAGRAM_FEED,
      instagramProfile: "https://www.instagram.com/vega.us/",
    };
  } catch (error) {
    console.error("Error fetching Instagram data from Sanity:", error);
    // Return default data in case of error
    return {
      title: "Instagram Feed",
      posts: INSTAGRAM_FEED,
      instagramProfile: "https://www.instagram.com/vega.us/",
    };
  }
});

export async function deleteInstagramPost(postId) {
  try {
    // First, get the current Instagram document
    const instagramDoc = await client.fetch(`*[_type == "instagram"][0] {
      _id,
      _rev,
      posts[] {
        id,
        _key
      }
    }`);

    if (!instagramDoc) {
      throw new Error("Instagram document not found");
    }

    // Find the post to delete by its ID
    const postToDelete = instagramDoc.posts?.find(post => post.id === postId);
    
    if (!postToDelete) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    // Use Sanity's patch API to remove the post from the posts array
    const result = await client
      .patch(instagramDoc._id)
      .unset([`posts[_key=="${postToDelete._key}"]`])
      .commit();

    return {
      success: true,
      message: `Post ${postId} deleted successfully`,
      deletedPost: postToDelete,
      result
    };
  } catch (error) {
    console.error("Error deleting Instagram post:", error);
    return {
      success: false,
      message: `Failed to delete post: ${error.message}`,
      error
    };
  }
}
