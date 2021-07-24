import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

function Home({ data }) {
  return (
    <>
      <h1>Posts</h1>
      <section
        style={{
          display: `grid`,
          gridTemplateColumns: `repeat( auto-fit, minmax(250px, 1fr))`,
          gridGap: 16,
        }}
      >
        {data.allPost.nodes.map(post => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 16,
              border: "1px solid #ccc",
            }}
          >
            <h2>{post.slug}</h2>
            <span>By: {post.author.name}</span>
            <p>{post.description}</p>
            <GatsbyImage
              image={getImage(post.remoteImage)}
              alt={post.imgAlt}
            />
          </div>
        ))}
      </section>
    </>
  )
}

export const query = graphql`
  {
    allPost {
      nodes {
        id
        slug
        description
        imgAlt
        author {
          id
          name
        }
        remoteImage {
          id
          childImageSharp {
            gatsbyImageData(
              width: 200
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`

export default Home;