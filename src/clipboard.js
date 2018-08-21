/* @flow */
/* eslint-disable flowtype/no-flow-fix-me-comments */

function createNode(text: string): Element {
  const node = document.createElement('pre')
  node.style.width = '1px'
  node.style.height = '1px'
  node.style.position = 'fixed'
  node.style.top = '5px'
  node.textContent = text
  return node
}

export function copyNode(button: Element, node: Element) {
  if (writeAsync(button, node.textContent)) return

  const selection = getSelection()
  if (selection == null) {
    return
  }

  selection.removeAllRanges()

  const range = document.createRange()
  range.selectNodeContents(node)
  selection.addRange(range)

  document.execCommand('copy')
  selection.removeAllRanges()
}

export function copyText(button: Element, text: string) {
  if (writeAsync(button, text)) return

  const body = document.body
  if (!body) return

  const node = createNode(text)
  body.appendChild(node)
  copyNode(button, node)
  body.removeChild(node)
}

export function copyInput(button: Element, node: HTMLInputElement | HTMLTextAreaElement) {
  if (writeAsync(button, node.value)) return

  node.select()
  document.execCommand('copy')
  const selection = getSelection()
  if (selection != null) {
    selection.removeAllRanges()
  }
}

function writeAsync(button: Element, text: string): boolean {
  // $FlowFixMe Clipboard is not defined in Flow yet.
  const clipboard = navigator.clipboard
  if (!clipboard) return false

  clipboard.writeText(text).then(function() {
    button.dispatchEvent(new CustomEvent('copy', {bubbles: true}))
  })
  return true
}
