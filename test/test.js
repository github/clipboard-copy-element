describe('clipboard-copy element', function() {
  describe('element creation', function() {
    it('creates from document.createElement', function() {
      const el = document.createElement('clipboard-copy')
      assert.equal('CLIPBOARD-COPY', el.nodeName)
      assert(el instanceof window.ClipboardCopyElement)
    })

    it('creates from constructor', function() {
      const el = new window.ClipboardCopyElement()
      assert.equal('CLIPBOARD-COPY', el.nodeName)
    })
  })

  describe('clicking the button', function() {
    beforeEach(function() {
      const container = document.createElement('div')
      container.innerHTML = `
        <clipboard-copy value="target text">
          Copy
        </clipboard-copy>`
      document.body.append(container)
    })

    afterEach(function() {
      document.body.innerHTML = ''
    })

    it('retains focus on the button', function() {
      const button = document.querySelector('clipboard-copy')
      button.focus()
      assert.equal(document.activeElement, button)
      button.click()
      assert.equal(document.activeElement, button)
    })
  })

  describe('target element', function() {
    const nativeClipboard = navigator.clipboard
    function defineClipboard(customClipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        enumerable: false,
        configurable: true,
        get() {
          return customClipboard
        }
      })
    }

    let whenCopied
    beforeEach(function() {
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
        document.addEventListener('copy', () => resolve(copiedText), {once: true})
      })
    })

    afterEach(function() {
      document.body.innerHTML = ''
      defineClipboard(nativeClipboard)
    })

    it('node', function() {
      const target = document.createElement('div')
      target.innerHTML = 'Hello <b>world!</b>'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      return whenCopied.then(text => {
        assert.equal(text, 'Hello world!')
      })
    })

    it('hidden input', function() {
      const target = document.createElement('input')
      target.type = 'hidden'
      target.value = 'Hello world!'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      return whenCopied.then(text => {
        assert.equal(text, 'Hello world!')
      })
    })

    it('input field', function() {
      const target = document.createElement('input')
      target.value = 'Hello world!'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      return whenCopied.then(text => {
        assert.equal(text, 'Hello world!')
      })
    })

    it('textarea', function() {
      const target = document.createElement('textarea')
      target.value = 'Hello world!'
      target.id = 'copy-target'
      document.body.append(target)

      const button = document.querySelector('clipboard-copy')
      button.click()

      return whenCopied.then(text => {
        assert.equal(text, 'Hello world!')
      })
    })
  })
})
