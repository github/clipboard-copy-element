import {copyNode, copyText} from './clipboard'

async function copy(button: HTMLElement) {
  const id = button.getAttribute('for')
  const text = button.getAttribute('value')

  function trigger() {
    button.dispatchEvent(new CustomEvent('clipboard-copy', {bubbles: true}))
  }

  if (text) {
    await copyText(text)
    trigger()
  } else if (id) {
    const root = 'getRootNode' in Element.prototype ? button.getRootNode() : button.ownerDocument
    if (!(root instanceof Document || ('ShadowRoot' in window && root instanceof ShadowRoot))) return
    const node = root.getElementById(id)
    if (node) {
      await copyTarget(node)
      trigger()
    }
  }
}

function copyTarget(content: Element) {
  if (content instanceof HTMLInputElement || content instanceof HTMLTextAreaElement) {
    return copyText(content.value)
  } else if (content instanceof HTMLAnchorElement && content.hasAttribute('href')) {
    return copyText(content.href)
  } else {
    return copyNode(content)
  }
}

function clicked(event: MouseEvent) {
  const button = event.currentTarget
  if (button instanceof HTMLElement) {
    copy(button)
  }
}

function keydown(event: KeyboardEvent) {
  if (event.key === ' ' || event.key === 'Enter') {
    const button = event.currentTarget
    if (button instanceof HTMLElement) {
      event.preventDefault()
      copy(button)
    }
  }
}

function focused(event: FocusEvent) {
  ;(event.currentTarget as HTMLElement).addEventListener('keydown', keydown)
}

function blurred(event: FocusEvent) {
  ;(event.currentTarget as HTMLElement).removeEventListener('keydown', keydown)
}

export default class ClipboardCopyElement extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('click', clicked)
    this.addEventListener('focus', focused)
    this.addEventListener('blur', blurred)
  }

  connectedCallback(): void {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button')
    }
  }

  get value(): string {
    return this.getAttribute('value') || ''
  }

  set value(text: string) {
    this.setAttribute('value', text)
  }
}
