/* @flow strict */

import {copyInput, copyNode, copyText} from './clipboard'

function copy(button: HTMLElement) {
  const id = button.getAttribute('for')
  const text = button.getAttribute('value')

  function trigger(copiedText: string) {
    button.dispatchEvent(new CustomEvent('clipboard-copy', {bubbles: true, detail: {text: copiedText}}))
  }

  if (text) {
    copyText(text).then(() => trigger(text))
  } else if (id) {
    const node = button.ownerDocument.getElementById(id)
    if (node) copyTarget(node).then(trigger)
  }
}

function copyTarget(content: Element): Promise<string> {
  if (content instanceof HTMLInputElement || content instanceof HTMLTextAreaElement) {
    if (content.type === 'hidden') {
      return copyText(content.value).then(() => content.value)
    } else {
      return copyInput(content).then(() => content.value)
    }
  } else if (content instanceof HTMLAnchorElement && content.hasAttribute('href')) {
    return copyText(content.href).then(() => content.href)
  } else {
    return copyNode(content).then(() => content.textContent)
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
  event.currentTarget.addEventListener('keydown', keydown)
}

function blurred(event: FocusEvent) {
  event.currentTarget.removeEventListener('keydown', keydown)
}

export default class ClipboardCopyElement extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('click', clicked)
    this.addEventListener('focus', focused)
    this.addEventListener('blur', blurred)
  }

  connectedCallback() {
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
