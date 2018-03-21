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
      copied-label="Copied!">
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

## Tooltips

After copying to the clipboard an optional tooltip can be displayed as
confirmation. The button temporarily replaces the `aria-label` attribute
value with the `copied-label` attribute to display the tooltip.

Styles for the tooltip can be provided by the host application or a component
system like [Primer][].

[Primer]: https://github.com/primer/primer/tree/master/modules/primer-tooltips

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
