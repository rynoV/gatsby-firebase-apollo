import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'

import { Helmet } from 'react-helmet'

import { ISEOQuery } from '/src/@types'

interface IProps {
  title?: string | null
  description?: string | null
  image?: string | null
  pathname?: string | null
  article?: boolean
}

export function SEO(props: IProps) {
  const data: ISEOQuery = useStaticQuery(graphql`
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

  return <PureSEO data={data} {...props} />
}

export interface IPureSEOProps extends IProps {
  data: ISEOQuery
}

export function PureSEO({
  data,
  title = null,
  description = null,
  image = null,
  pathname = null,
  article = false,
}: IPureSEOProps) {
  const {
          site: {
            siteMetadata: {
              defaultTitle,
              titleTemplate,
              defaultDescription,
              siteUrl,
              defaultImage,
              instagramUsername,
            },
          },
        } = data

  const seo = {
    title      : title || defaultTitle,
    description: description || defaultDescription,
    image      : `${image || defaultImage}`,
    url        : `${siteUrl}${pathname || '/'}`,
  }

  return (
    <Helmet title={seo.title} titleTemplate={titleTemplate}>
      <html lang='en' />

      <link rel='icon' href={`${seo.image}`} type='image/x-icon' />

      <link rel='canonical' href='https://www.hilderman.photo' />

      <meta name='description' content={seo.description} />

      <meta name='image' content={seo.image} />

      {seo.url && <meta property='og:url' content={seo.url} />}

      {(article ? true : null) && <meta property='og:type' content='article' />}

      {seo.title && <meta property='og:title' content={seo.title} />}

      {seo.description && (
        <meta property='og:description' content={seo.description} />
      )}

      {seo.image && <meta property='og:image' content={seo.image} />}

      <meta name='instagram:card' content='summary_large_image' />

      {instagramUsername && (
        <meta name='instagram:creator' content={instagramUsername} />
      )}

      {seo.title && <meta name='instagram:title' content={seo.title} />}

      {seo.description && (
        <meta name='instagram:description' content={seo.description} />
      )}

      {seo.image && <meta name='instagram:image' content={seo.image} />}
    </Helmet>
  )
}
