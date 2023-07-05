import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    type Element = VNode
    type ElementClass = Vue
    type IntrinsicElements = Record<string, unknown>;
  }
}
