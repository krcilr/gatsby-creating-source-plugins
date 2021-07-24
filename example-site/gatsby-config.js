module.exports = {
  plugins: [
    require.resolve(`../source-plugin`), 
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
  ],
}
