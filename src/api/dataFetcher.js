import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

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

export async function fetchCaseStudies() {
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
}

export async function VegaTvData() {
  return client.fetch('*[_type == "vegaTv"][0]');
}

export async function fetchAboutData() {
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
}

export async function fetchTransparencyData() {
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
}

export async function fetchSongData() {
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
}

export async function fetchWeatherData() {
  const weatherKey = process.env.NEXT_PUBLIC_WEATHER_KEY;
  const location = "new york";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${weatherKey}`;
  const response = await fetch(url);
  return response.json();
}

export async function fetchInstagramData() {
  const apiKey = process.env.NEXT_PUBLIC_INSTAGRAM_KEY;
  const instagramUrl = `http://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type,permalink,thumbnail_url&access_token=${apiKey}`;
  const instagramData = await fetch(instagramUrl);
  return instagramData.json();
}
