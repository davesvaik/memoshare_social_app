import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2022-01-03", //YYYY-MM-DD sanity format...
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN,
});
//https://www.sanity.io/docs/image-url
//generates image urls from sanity image records.
const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
