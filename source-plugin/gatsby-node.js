/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
// You can delete this file if you're not using it

/**
 * You can uncomment the following line to verify that
 * your plugin is being loaded in your site.
 *
 * See: https://www.gatsbyjs.com/docs/creating-a-local-plugin/#developing-a-local-plugin-that-is-outside-your-project
 */
exports.onPreInit = () => console.log("Loaded gatsby-starter-plugin")

// constants for your GraphQL Post and Author types
const POST_NODE_TYPE = `Post`
const AUTHOR_NODE_TYPE = `Author`
const { ApolloClient, InMemoryCache, gql, split, HttpLink } = require("@apollo/client")
const { WebSocketLink } = require("@apollo/client/link/ws")
const { getMainDefinition } = require("@apollo/client/utilities")
const WebSocket = require("ws")
const fetch = require("node-fetch")
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const client = new ApolloClient({
  link: split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      )
    },
    new WebSocketLink({
      uri: `ws://gatsby-source-plugin-api.glitch.me/`,
      //uri: `ws://localhost:4000`, // or `ws://gatsby-source-plugin-api.glitch.me/`
      options: {
        reconnect: true,
      },
      webSocketImpl: WebSocket,
    }),
    new HttpLink({
      uri: `https://gatsby-source-plugin-api.glitch.me/`,
      //uri: "http://localhost:4000", // or `https://gatsby-source-plugin-api.glitch.me/`
      fetch,
    })
  ),
  cache: new InMemoryCache(),
})

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  const { createNode } = actions

  const { data } = await client.query({
      query: gql`
        query {
            posts {
                id
                description
                slug
                imgUrl
                imgAlt
                author {
                    id
                    name
                }                
            }
            authors {
                id
                name
            }
        }`,
  })

  // loop through posts data and create Gatsby nodes
  data.posts.forEach(post =>
    createNode({
      ...post,
      id: createNodeId(`${POST_NODE_TYPE}-${post.id}`),
      parent: null,
      children: [],
      internal: {
        type: POST_NODE_TYPE,
        content: JSON.stringify(post),
        contentDigest: createContentDigest(post),
      },
    })
  )

  //loop through author data
  data.authors.forEach(author => 
    createNode({
        ...author,
        id: createNodeId(`${AUTHOR_NODE_TYPE}-${author.id}`),
        parent: null,
        children: [],
        internal: {
            type: AUTHOR_NODE_TYPE,
            content: JSON.stringify(author),
            contentDigest: createContentDigest(author),
        },
    })
  )

  return
}

// called each time a node is created
exports.onCreateNode = async ({
    node, // the node that was just created
    actions: { createNode },
    createNodeId,
    getCache,
  }) => {
    if (node.internal.type === POST_NODE_TYPE) {
      const fileNode = await createRemoteFileNode({
        // the url of the remote image to generate a node for
        url: node.imgUrl,
        parentNodeId: node.id,
        createNode,
        createNodeId,
        getCache,
      })
  
      if (fileNode) {
        node.remoteImage___NODE = fileNode.id
      }
    }
  }