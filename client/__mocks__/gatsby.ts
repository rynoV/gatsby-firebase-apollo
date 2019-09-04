const React  = require('react')
const gatsby = jest.requireActual('gatsby')

export default gatsby

export const graphql = jest.fn()

export const Link = jest.fn().mockImplementation(
  // these props are invalid for an `a` tag
  ({
    activeClassName,
    activeStyle,
    getProps,
    innerRef,
    partiallyActive,
    ref,
    replace,
    to,
    ...rest
  }) =>
    React.createElement('a', {
      ...rest,
      href: to,
    }),
)

export const StaticQuery = jest.fn()

export const useStaticQuery = jest.fn()
