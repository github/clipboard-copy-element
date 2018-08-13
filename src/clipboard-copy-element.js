/* @flow */

import {copyInput, copyNode, copyText} from './clipboard'

function copy(button: HTMLElement) {
  const id = button.getAttribute('for')
  const text = button.getAttribute('value')
  if (text) {
    copyText(button, text)
  } else if (id) {
    copyTarget(button, id)
  }
}

function copyTarget(button: Element, id: string) {
  const content = button.ownerDocument.getElementById(id)
  if (!content) return

  if (content instanceof HTMLInputElement || content instanceof HTMLTextAreaElement) {
    if (content.type === 'hidden') {
      copyText(button, content.value)
    } else {
      copyInput(button, content)
    }
  } else if (content instanceof HTMLAnchorElement && content.hasAttribute('href')) {
    copyText(button, content.href)
  } else {
    copyNode(button, content)
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
