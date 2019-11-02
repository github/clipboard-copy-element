/* @flow strict */

function createNode(text: string): Element {
  const node = document.createElement('pre')
  node.style.width = '1px'
  node.style.height = '1px'
  node.style.position = 'fixed'
  node.style.top = '5px'
  node.textContent = text
  return node
}

export function copyNode(node: Element): Promise<string> {
  if ('clipboard' in navigator) {
    // eslint-disable-next-line flowtype/no-flow-fix-me-comments
    // $FlowFixMe Clipboard is not defined in Flow yet.
    return navigator.clipboard.writeText(node.textContent).then(() => node.textContent)
  }

  const selection = getSelection()
  if (selection == null) {
    return Promise.reject(new Error())
  }

  selection.removeAllRanges()

  const range = document.createRange()
  range.selectNodeContents(node)
  selection.addRange(range)

  document.execCommand('copy')
  selection.removeAllRanges()
  return Promise.resolve(node.textContent)
}

export function copyText(text: string): Promise<string> {
  if ('clipboard' in navigator) {
    // eslint-disable-next-line flowtype/no-flow-fix-me-comments
    // $FlowFixMe Clipboard is not defined in Flow yet.
    return navigator.clipboard.writeText(text).then(() => text)
  }

  const body = document.body
  if (!body) {
    return Promise.reject(new Error())
  }

  const node = createNode(text)
  body.appendChild(node)
  copyNode(node)
  body.removeChild(node)
  return Promise.resolve(text)
}

export function copyInput(node: HTMLInputElement | HTMLTextAreaElement): Promise<string> {
  if ('clipboard' in navigator) {
    // eslint-disable-next-line flowtype/no-flow-fix-me-comments
    // $FlowFixMe Clipboard is not defined in Flow yet.
    return navigator.clipboard.writeText(node.value).then(() => node.value)
  }

  node.select()
  document.execCommand('copy')
  const selection = getSelection()
  if (selection != null) {
    selection.removeAllRanges()
  }
  return Promise.resolve(node.value)
}
