export interface ISEOQuery {
  site: {
    siteMetadata: {
      defaultTitle: string
      titleTemplate: string
      defaultDescription: string
      siteUrl: string
      defaultImage: string
      instagramUsername: string
    }
  }
  sanityFavicon: {
    image: {
      asset: {
        url: string
      }
    }
  }
}

