import {assert} from '@open-wc/testing'
import {ClipboardCopyElement} from '../src/index.ts'

describe('clipboard-copy element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('clipboard-copy')
      assert.equal('CLIPBOARD-COPY', el.nodeName)
      assert(el instanceof ClipboardCopyElement)
      assert(el instanceof window.ClipboardCopyElement)
    })

    it('creates from constructor', function () {
      const el = new window.ClipboardCopyElement()
      assert.equal('CLIPBOARD-COPY', el.nodeName)
    })
  })

  describe('clicking the button', function () {
    beforeEach(function () {
      const container = document.createElement('div')
      container.innerHTML = `
        <clipboard-copy value="target text">
          Copy
        </clipboard-copy>`
      document.body.append(container)
    })

    afterEach(function () {
      document.body.innerHTML = ''
    })

    it('retains focus on the button', function () {
      const button = document.querySelector('clipboard-copy')
      button.focus()
      assert.equal(document.activeElement, button)
      button.click()
      assert.equal(document.activeElement, button)
    })
  })

  describe('target element', function () {
    const nativeClipboard = navigator.clipboard
    let whenCopied

    beforeEach(function () {
      const container = document.createElement('div')
      container.innerHTML = `
        <clipboard-copy for="copy-target">
          Copy
        </clipboard-copy>`
      document.body.append(container)

      let copiedText = null
      defineClipboard({
        writeText(text) {
          copiedText = text
          return Promise.resolve()
        },
        readText() {
          return Promise.resolve(copiedText)
        },
      })

      whenCopied = new Promise(resolve => {
        document.addEventListener('clipboard-copy', () => resolve(copiedText), {
          once: true,
        })
      })
    })

    afterEach(function () {
      document.body.innerHTML = ''
      defineClipboard(nativeClipboard)
    })

    it('node', async function () {
      const target = document.createElement('div')
      target.innerHTML = 'Hello <b>world!</b>'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      const text = await whenCopied
      assert.equal(text, 'Hello world!')
    })

    it('hidden input', async function () {
      const target = document.createElement('input')
      target.type = 'hidden'
      target.value = 'Hello world!'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      const text = await whenCopied
      assert.equal(text, 'Hello world!')
    })

    it('input field', async function () {
      const target = document.createElement('input')
      target.value = 'Hello world!'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      const text = await whenCopied
      assert.equal(text, 'Hello world!')
    })

    it('textarea', async function () {
      const target = document.createElement('textarea')
      target.value = 'Hello world!'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      const text = await whenCopied
      assert.equal(text, 'Hello world!')
    })

    it('a[href]', async function () {
      const target = document.createElement('a')
      target.href = '/hello#world'
      target.textContent = 'I am a link'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      const text = await whenCopied
      assert.equal(text, `${location.origin}/hello#world`)
    })

    it('a[id]', async function () {
      const target = document.createElement('a')
      target.textContent = 'I am a link'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      const text = await whenCopied
      assert.equal(text, 'I am a link')
    })

    it('normalizes non-breaking spaces to regular spaces', async function () {
      const target = document.createElement('div')
      target.textContent = 'wget -O - https://example.com/hello.sh\u00A0| bash'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      const text = await whenCopied
      assert.equal(text, 'wget -O - https://example.com/hello.sh | bash')
      assert.notInclude(text, '\u00A0')
    })

    it('normalizes non-breaking spaces from the value attribute', async function () {
      const button = document.querySelector('clipboard-copy')
      button.setAttribute('value', 'hello.sh\u00A0| bash')

      button.click()

      const text = await whenCopied
      assert.equal(text, 'hello.sh | bash')
      assert.notInclude(text, '\u00A0')
    })

    it('normalizes Unicode space-separator characters except ideographic spaces', async function () {
      const spaceChars = [
        '\u00A0',
        '\u1680',
        '\u2000',
        '\u2001',
        '\u2002',
        '\u2003',
        '\u2004',
        '\u2005',
        '\u2006',
        '\u2007',
        '\u2008',
        '\u2009',
        '\u200A',
        '\u202F',
        '\u205F',
      ]

      for (const char of spaceChars) {
        const button = document.querySelector('clipboard-copy')
        button.setAttribute('value', `hello.sh${char}| bash`)

        const copied = new Promise(resolve => {
          document.addEventListener('clipboard-copy', resolve, {once: true})
        })
        button.click()
        await copied

        const text = await navigator.clipboard.readText()
        assert.equal(text, 'hello.sh | bash', `failed for U+${char.codePointAt(0).toString(16).toUpperCase()}`)
        assert.notInclude(text, char)
      }
    })

    it('preserves ideographic spaces in target element text', async function () {
      const target = document.createElement('div')
      target.textContent = 'product\u3000name'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      const text = await whenCopied
      assert.equal(text, 'product\u3000name')
    })

    it('preserves ideographic spaces from the value attribute', async function () {
      const button = document.querySelector('clipboard-copy')
      button.setAttribute('value', 'product\u3000name')

      button.click()

      const text = await whenCopied
      assert.equal(text, 'product\u3000name')
    })

    it('strips zero-width and invisible format characters', async function () {
      const zeroWidthChars = ['\u200B', '\u200C', '\u200D', '\u2060', '\uFEFF', '\u180E']

      for (const char of zeroWidthChars) {
        const button = document.querySelector('clipboard-copy')
        button.setAttribute('value', `hello.sh${char}| bash`)

        const copied = new Promise(resolve => {
          document.addEventListener('clipboard-copy', resolve, {once: true})
        })
        button.click()
        await copied

        const text = await navigator.clipboard.readText()
        assert.equal(text, 'hello.sh| bash', `failed for U+${char.codePointAt(0).toString(16).toUpperCase()}`)
        assert.notInclude(text, char)
      }
    })

    it('preserves ideographic spaces through the legacy fallback', async function () {
      const descriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'clipboard')
      const execCommandDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand')
      assert(descriptor && descriptor.configurable)

      delete navigator.clipboard
      delete Navigator.prototype.clipboard
      assert.equal('clipboard' in navigator, false)

      let selectedText
      Object.defineProperty(document, 'execCommand', {
        configurable: true,
        value(command) {
          if (command === 'copy') selectedText = getSelection().toString()
          return true
        },
      })

      try {
        const target = document.createElement('div')
        target.textContent = 'product\u3000name'
        target.id = 'copy-target'
        document.body.append(target)

        const button = document.querySelector('clipboard-copy')
        button.click()
        await whenCopied
      } finally {
        if (execCommandDescriptor) {
          Object.defineProperty(document, 'execCommand', execCommandDescriptor)
        } else {
          delete document.execCommand
        }
        Object.defineProperty(Navigator.prototype, 'clipboard', descriptor)
      }

      assert.equal(selectedText, 'product\u3000name')
    })

    it('does not copy when disabled', async function () {
      const target = document.createElement('div')
      target.innerHTML = 'Hello world!'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.setAttribute('aria-disabled', 'true')

      let fired = false
      document.addEventListener(
        'clipboard-copy',
        () => {
          fired = true
        },
        {once: true},
      )

      button.click()

      await new Promise(setTimeout)
      assert.equal(fired, false)
      assert.equal(null, await navigator.clipboard.readText())
    })
  })

  describe('shadow DOM context', function () {
    const nativeClipboard = navigator.clipboard
    let whenCopied
    beforeEach(function () {
      const container = document.createElement('div')
      container.id = 'shadow'
      const elementInDocument = document.createElement('div')
      elementInDocument.id = 'copy-target'
      elementInDocument.textContent = 'Target in Document'
      const shadowRoot = container.attachShadow({mode: 'open'})
      shadowRoot.innerHTML = `
        <clipboard-copy for="copy-target">
          Copy
        </clipboard-copy>
        <div id="copy-target">Target in shadowRoot</div>`
      document.body.append(container)
      document.body.append(elementInDocument)
      container.click()

      let copiedText = null
      defineClipboard({
        writeText(text) {
          copiedText = text
          return Promise.resolve()
        },
      })

      whenCopied = new Promise(resolve => {
        shadowRoot.addEventListener('clipboard-copy', () => resolve(copiedText), {once: true})
      })
    })

    afterEach(function () {
      document.body.innerHTML = ''
      defineClipboard(nativeClipboard)
    })

    it('copies from within its shadow root', async function () {
      const shadow = document.querySelector('#shadow')
      shadow.shadowRoot.querySelector('clipboard-copy').click()

      const text = await whenCopied
      assert.equal(text, 'Target in shadowRoot')
    })
  })
})

function defineClipboard(customClipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    enumerable: false,
    configurable: true,
    get() {
      return customClipboard
    },
  })
}
