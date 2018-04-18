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
})
