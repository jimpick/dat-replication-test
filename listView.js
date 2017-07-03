const html = require('choo/html')

function listView (state, emit) {
  const { sites } = state
  return html`
    <ul id="siteList">
      ${sites && sites.map(site => {
        const { title, url } = site
        return html`
          <li>
            <a href="${url}">${title}</a>
          </li>
        `
      })}
    </ul>
  `
}

module.exports = listView