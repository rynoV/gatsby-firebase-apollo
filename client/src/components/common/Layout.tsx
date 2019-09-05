import React from 'react'
import { SEO } from '/src/components/common/SEO'

export const Layout: React.FC = function({ children }) {
  return (
    <>
      <SEO />
      {children}
    </>
  )
}
