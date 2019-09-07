import { graphql, useStaticQuery } from 'gatsby'

export function useSEOQuery() {
  return useStaticQuery(graphql`
      query SEO {
          site {
              siteMetadata {
                  defaultTitle: title
                  titleTemplate
                  defaultDescription: description
                  siteUrl: url
                  defaultImage: image
                  instagramUsername
              }
          }
      }
  `)
}
