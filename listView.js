const html = require('choo/html')

function listView (state, emit) {
  const { files } = state
  return html`
    <ul id="fileList">
      ${files.map(file => {
        return html`
          <li>
            <a href="/test1/${file}">${file}</a>
          </li>
        `
      })}
    </ul>
  `
}

module.exports = listView