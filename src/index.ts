import ClipboardCopyElement from './clipboard-copy-element'

export default ClipboardCopyElement

declare global {
  interface Window {
    ClipboardCopyElement: typeof ClipboardCopyElement
  }
  interface HTMLElementTagNameMap {
    'clipboard-copy': ClipboardCopyElement
  }
}

if (!window.customElements.get('clipboard-copy')) {
  window.ClipboardCopyElement = ClipboardCopyElement
  window.customElements.define('clipboard-copy', ClipboardCopyElement)
}
