const config = require('./config')

module.exports = {
  siteMetadata: {
    title            : 'default',
    description      : 'default',
    titleTemplate    : 'default',
    url              : 'https://www.gatsbyjs.org/',
    siteUrl          : 'https://www.gatsbyjs.org/',
    author           : 'default',
    instagramUsername: 'default',
    image            : 'default',
  },
  plugins     : [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-typescript',
    'gatsby-plugin-tslint',
    'gatsby-plugin-react-axe',
    {
      resolve: 'gatsby-plugin-accessibilityjs',
      options: {
        injectStyles: `
        .accessibility-error {
          box-shadow: 0 0 3px 1px #f00;
          background-color: rgba(255, 0, 0, 0.25);
          position: relative;
        }
        .accessibility-error:before {
          content: "A11Y";
          position: absolute;
          top: 0;
          left: 0;
          color: #fff;
          font-size: 10px;
          background-color: rgba(255, 0, 0, 0.5);
          transform: translateY(-100%);
        }
      `,
      },
    },
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color      : '#F98807',
        showSpinner: false,
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name            : 'default',
        short_name      : 'default',
        start_url       : 'https://www.gatsbyjs.org/',
        lang            : 'default',
        background_color: 'default',
        theme_color     : 'default',
        display         : 'default',
        icon            : 'static/favicon.png',
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        fieldName: 'apollo',
        url      : config.api,
        typeName : 'ApolloServer',
      },
    },
    'gatsby-plugin-sitemap',
    'gatsby-plugin-robots-txt',
  ],
}
