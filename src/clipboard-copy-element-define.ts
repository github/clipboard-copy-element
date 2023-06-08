import {ClipboardCopyElement} from './clipboard-copy-element.js'

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window
try {
  root.ClipboardCopyElement = ClipboardCopyElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}

type JSXBase = JSX.IntrinsicElements extends {span: unknown}
  ? JSX.IntrinsicElements
  : Record<string, Record<string, unknown>>
declare global {
  interface Window {
    ClipboardCopyElement: typeof ClipboardCopyElement
  }
  interface HTMLElementTagNameMap {
    'clipboard-copy': ClipboardCopyElement
  }
  namespace JSX {
    interface IntrinsicElements {
      ['clipboard-copy']: JSXBase['span'] & Partial<Omit<ClipboardCopyElement, keyof HTMLElement>>
    }
  }
}

export default ClipboardCopyElement
export * from './clipboard-copy-element.js'
