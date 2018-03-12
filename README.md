# &lt;clipboard-copy&gt; element

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
      class="btn btn-sm BtnGroup-item tooltipped tooltipped-s"
      aria-label="Copy file path to clipboard"
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
