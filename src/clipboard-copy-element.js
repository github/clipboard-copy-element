/* @flow */

import {copyInput, copyNode, copyText} from './clipboard'

function copy(button: HTMLElement) {
  const id = button.getAttribute('for')
  const text = button.getAttribute('value')
  if (text) {
    copyText(text)
  } else if (id) {
    copyTarget(button.ownerDocument, id)
  }

  applyHint(button)
  button.blur()
}

function copyTarget(document: Document, id: string) {
  const content = document.getElementById(id)
  if (!content) return

  if (content instanceof HTMLInputElement || content instanceof HTMLTextAreaElement) {
    if (content.type === 'hidden') {
      copyText(content.value)
    } else {
      copyInput(content)
    }
  } else {
    copyNode(content)
  }
}

function applyHint(button: Element) {
  const hint = button.getAttribute('hint')
  const original = button.getAttribute('aria-label')
  if (hint && hint !== original) {
    button.setAttribute('aria-label', hint)
    button.addEventListener(
      'mouseleave',
      () => {
        if (original != null) {
          button.setAttribute('aria-label', original)
        } else {
          button.removeAttribute('aria-label')
        }
      },
      {once: true}
    )
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
}
