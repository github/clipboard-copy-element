# <clipboard-copy> element

Copy element text content or input values to the clipboard.

## Installation

```
$ npm install --save clipboard-copy-element
```

## Usage

```js
import 'clipboard-copy-element'
```

```html
<clipboard-copy
      for="blob-path"
      role="button"
      aria-label="Copy file path to clipboard"
      class="btn btn-sm BtnGroup-item tooltipped tooltipped-s"
      data-copied-hint="Copied!">
  Copy path
</clipboard-copy>
<div id="blob-path">src/index.js</div>
```

## Browser support

- Chrome
- Firefox
- Safari 9+
- Internet Explorer 11
- Microsoft Edge
