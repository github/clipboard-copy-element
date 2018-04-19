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
<clipboard-copy for="blob-path" class="btn btn-sm BtnGroup-item">
  Copy path
</clipboard-copy>
<div id="blob-path">src/index.js</div>
```

## Data sources

### Attribute

```html
<clipboard-copy value="src/index.js">Copy</clipboard-copy>
```

### Element content

```html
<clipboard-copy for="blob-path">Copy</clipboard-copy>
<div id="blob-path">src/index.js</div>
```

### Form input

```html
<clipboard-copy for="blob-path">Copy</clipboard-copy>
<input id="blob-path" value="src/index.js">
```

## Events

After copying to the clipboard, a [copy][] event is dispatched that can be
used to notify the user with confirmation, like a tooltip or button highlight.

```js
document.addEventListener('copy', function(event) {
  const button = document.activeElement
  button.classList.add('highlight')
})
```

[copy]: https://developer.mozilla.org/en-US/docs/Web/Events/copy

## Browser support

- Chrome
- Firefox
- Safari 9+
- Internet Explorer 11
- Microsoft Edge

## Development

```
npm install
npm test
```

## License

Distributed under the MIT license. See LICENSE for details.
