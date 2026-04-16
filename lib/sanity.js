// lib/sanity.js

import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'yourProjectId',  // Replace with your Sanity project ID
  dataset: 'production',        // Replace with your dataset name
  useCdn: true,                // `false` if you want to ensure fresh data
  token: 'yourToken',          // Replace with your token if needed
});

export default client;