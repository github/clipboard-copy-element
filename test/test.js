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
})
