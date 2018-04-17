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
        <clipboard-copy
            value="target text"
            aria-label="Copy to clipboard"
            copied-label="Copied!"
            copied-class="tooltipped">
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

    it('restores tooltip text and classes on blur', function() {
      const button = document.querySelector('clipboard-copy')
      assert.equal('Copy to clipboard', button.getAttribute('aria-label'))
      button.focus()

      button.click()
      assert.equal('Copied!', button.getAttribute('aria-label'))
      assert(button.classList.contains('tooltipped'))

      button.blur()
      assert.equal('Copy to clipboard', button.getAttribute('aria-label'))
      assert(!button.classList.contains('tooltipped'))
    })
  })
})
