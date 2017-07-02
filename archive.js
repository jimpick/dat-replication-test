const each = require('promise-each')

const sitesDir = 'sites'
class Archive {
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
    const promise = this.archive.readdir(sitesDir)
      .then(files => {
        console.log('Jim1', files)
        return files
      }).then(each(file => {
        console.log('Jim', file)
        sites.push({
          title: file,
          file
        })
      }))
      .then(() => {
        return (
          this.archive.writeFile(
            'sites.json',
            JSON.stringify(sites)
          )
        )
      })
    return promise
  }

  publish() {
    return this.archive.commit()
  }

}

module.exports = Archive
