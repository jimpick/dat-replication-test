const each = require('promise-each')

const sitesDir = 'sites'

class SitesModel {
  constructor(url) {
    this.url = url
    this.archive = new DatArchive(url)
  }

  init() {
    const promise = this.archive.readdir('/')
      .then(topFiles => {
        if (topFiles.includes(sitesDir)) {
          return
        }
        return this.archive.mkdir(sitesDir)
      })
    return promise
  }

  writeFile(file, info) {
    const { title, description, url } = info
    const data = JSON.stringify({
      title,
      description,
      url
    }, null, 2)
    const promise = this.archive.writeFile(file, data)
      .then(() => {
        console.log(`Wrote ${file}`)
        return this.updateSitesJson()
      })
    return promise
  }

  updateSitesJson() {
    const sites = []
    const promise =
      this.archive.readdir(sitesDir)
      .then(files => {
        return files
      })
      .then(each(file => {
        const promise =
          this.archive.readFile(`${sitesDir}/${file}`)
          .then(contents => {
            try {
              const data = JSON.parse(contents)
              sites.push(data)
            } catch (error) {
              console.log('Error parsing file', file, error)
            }
          })
        return promise
      }))
      .then(() => {
        return this.archive.writeFile(
          'sites.json',
          JSON.stringify(sites, null, 2)
        )
      })
      .then(() => this.archive.commit())
    return promise
  }

}

module.exports = SitesModel
