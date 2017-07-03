const html = require('pelo')

class NewArchive {

  async create({ defaultTitle, createdFrom }) {
    this.createdFrom = createdFrom
    const archive = await DatArchive.create({
      title: defaultTitle,
      description: 'Enter your description here.'
    })
    this.archive = archive
    console.log('New archive:', archive.url)
    const info = await archive.getInfo()
    this.info = info
    const { title, description } = info
    this.title = title
    this.description = description
    await this.generateSite()
    return info
  }

  async generateSite() {
    const { title, description, createdFrom, archive } = this
    await archive.writeFile(
      'index.html',
      this.indexHtml({
        title,
        description,
        createdFrom
      })
    )
    await archive.commit()
  }

  indexHtml({ title, description, createdFrom }) {
    return html`
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body>
          <h1>${title}</h1>
          <p>
            ${description}
          </p>
          <footer>
            Created from:
            <a href="${createdFrom}">${createdFrom}</a>
          </footer>
        </body>
      </html>
    `.toString()
  }

}

module.exports = NewArchive
