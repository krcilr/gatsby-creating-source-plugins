module.exports = {
  plugins: [
    {
      resolve: require.resolve(`../source-plugin`),
      options: {
        previewMode: true,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
  ],
}
