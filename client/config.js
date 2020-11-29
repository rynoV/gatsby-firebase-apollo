module.exports = {
  api:
    process.env.NODE_ENV === 'production'
      ? 'https://us-central1-fir-learn-f283b.cloudfunctions.net/api/graphql'
      : 'http://localhost:5001/fir-learn-f283b/us-central1/api/graphql',
}
