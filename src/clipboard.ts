function createNode(text: string): Element {
  const node = document.createElement('pre')
  node.style.width = '1px'
  node.style.height = '1px'
  node.style.position = 'fixed'
  node.style.top = '5px'
  node.textContent = text
  return node
}

// Normalize characters that render as a space (or as nothing) so that copied
// text matches what the user sees.
function normalizeText(text: string): string {
  return text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F]/g, ' ').replace(/[\u200B-\u200D\u2060\uFEFF\u180E]/g, '')
}

function copySelection(node: Element): Promise<void> {
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
  return Promise.resolve()
}

export function copyNode(node: Element): Promise<void> {
  return copyText(node.textContent || '')
}

export function copyText(text: string): Promise<void> {
  const normalized = normalizeText(text)

  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(normalized)
  }

  const body = document.body
  if (!body) {
    return Promise.reject(new Error())
  }

  const node = createNode(normalized)
  body.appendChild(node)
  copySelection(node)
  body.removeChild(node)
  return Promise.resolve()
}
