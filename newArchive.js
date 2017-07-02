const html = require('pelo')

class NewArchive {

  create(title) {
    this.title = title
    const promise = DatArchive.create({
      title,
      description: title
    })
    .then(archive => {
      this.archive = archive
      console.log('New archive:', archive.url)
    })
    .then(() => this.archive.getInfo())
    .then(info => {
      const { title, description } = info
      this.title = title
      this.description = description
      this.info = info
      return this.generateSite()
    })
    .then(() => this.info)
    .catch(error => {
      // FIXME: A bit confused what is happening here
      // console.log('New Archive Error', error)
      console.log('New Archive: User denied permission')
      return null
    })
    return promise
  }

  generateSite() {
    const { title, description, archive } = this
    const promise =
      archive.writeFile(
        'index.html',
        this.indexHtml({
          title,
          description
        })
      )
      .then(() => archive.commit())
    return promise
  }

  indexHtml({ title, description }) {
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
        </body>
      </html>
    `.toString()
  }

}

module.exports = NewArchive
