const html = require('choo/html')

function listView (state, emit) {
  const { sites } = state
  return html`
    <ul id="siteList">
      ${sites.map(site => {
        console.log('JimX', site)
        const { title, file } = site
        const url = `/sites/${file}`
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