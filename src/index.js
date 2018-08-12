/* @flow */

import ClipboardCopyElement from './clipboard-copy-element'

if (!window.customElements.get('clipboard-copy')) {
  window.ClipboardCopyElement = ClipboardCopyElement
  window.customElements.define('clipboard-copy', ClipboardCopyElement)
}

export {copyInput, copyNode, copyText} from './clipboard'
