/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SEO
// ====================================================

export interface SEO_site_siteMetadata {
  __typename: "SiteSiteMetadata";
  defaultTitle: string | null;
  titleTemplate: string | null;
  defaultDescription: string | null;
  siteUrl: string | null;
  defaultImage: string | null;
  instagramUsername: string | null;
}

export interface SEO_site {
  __typename: "Site";
  siteMetadata: SEO_site_siteMetadata | null;
}

export interface SEO {
  site: SEO_site | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
