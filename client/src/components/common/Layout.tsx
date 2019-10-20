import React from 'react'
import { SEO } from './SEO'

export const Layout: React.FC = function({ children }) {
  return (
    <>
      <SEO />
      {children}
    </>
  )
}
