export default {
  bucket: {
    slug: process.env.COSMIC_BUCKET || 'jr-projects',
    read_key: process.env.COSMIC_READ_KEY,
    write_key: process.env.COSMIC_WRITE_KEY,
    api_key: process.env.NBA_API_KEY
  }
}
