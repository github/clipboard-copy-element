/* @flow */

function createNode(text: string): Element {
  const node = document.createElement('pre')
  node.style.width = '1px'
  node.style.height = '1px'
  node.style.position = 'fixed'
  node.style.top = '5px'
  node.textContent = text
  return node
}

export function copyNode(node: Element) {
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

export function copyText(text: string) {
  const body = document.body
  if (!body) return

  const node = createNode(text)
  body.appendChild(node)
  copyNode(node)
  body.removeChild(node)
}

export function copyInput(node: HTMLInputElement | HTMLTextAreaElement) {
  node.select()
  document.execCommand('copy')
  const selection = getSelection()
  if (selection != null) {
    selection.removeAllRanges()
  }
}
