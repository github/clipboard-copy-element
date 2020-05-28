describe('clipboard-copy element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('clipboard-copy')
      assert.equal('CLIPBOARD-COPY', el.nodeName)
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
        }
      })

      whenCopied = new Promise(resolve => {
        document.addEventListener('clipboard-copy', () => resolve(copiedText), {once: true})
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
        }
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
    }
  })
}
