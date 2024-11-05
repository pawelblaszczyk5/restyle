import * as React from 'react'

import { css } from './index'

const voidElements = new Set(['br', 'embed', 'hr', 'img', 'input'])

/** Create a `restyle` JSX props object that handles the `css` prop to generate atomic class names. */
export function createRestyleProps(
  type: string,
  props: Record<string, any>
): [Record<string, any>, (() => React.ReactNode) | null] {
  const [classNames, Styles] = css(props.css)

  delete props.css

  props.className = props.className
    ? `${props.className} ${classNames}`
    : classNames

  if (voidElements.has(type)) {
    props.key = type

    return [props, Styles]
  }

  if (Styles) {
    const stylesToRender = React.createElement(Styles, { key: 'rss' })

    if (props.children) {
      if (props.children.constructor === Array) {
        props.children = props.children.concat(stylesToRender)
      } else if (typeof props.children === 'object' && 'type' in props.children) {
        props.children = [
          React.cloneElement(props.children, { key: 'rse' }),
          stylesToRender,
        ]
      } else {
        props.children = [props.children, stylesToRender]
      }
    } else {
      props.children = stylesToRender
    }
  }

  return [props, null]
}
