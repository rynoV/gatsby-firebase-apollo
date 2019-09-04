import React from 'react'

const RTG = jest.requireActual('react-transition-group')

const FakeTransition = jest.fn(({ children }) => children)

module.exports = {
  ...RTG,
  Transition   : FakeTransition,
  CSSTransition: jest.fn(props =>
    props.in ? <FakeTransition>{props.children}</FakeTransition> : null,
  ),
}
