const filesDir = 'test1'
class Archive {
  constructor(url) {
    this.url = url
    this.archive = new DatArchive(url)
  }

  init() {
    const promise = this.archive.readdir('/')
      .then(topFiles => {
        if (topFiles.includes(filesDir)) {
          return
        }
        return archive.mkdir(filesDir)
      })
    return promise
  }

  writeFile(file, data) {
    const promise = this.archive.writeFile(file, data)
      .then(() => {
        console.log(`Wrote ${file}`)
        return this.updateFilesJson()
      })
    return promise
  }

  updateFilesJson() {
    const promise = this.archive.readdir(filesDir)
      .then(files => {
        return (
          this.archive.writeFile(
            'files.json',
            JSON.stringify(files)
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
