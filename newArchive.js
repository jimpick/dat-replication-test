class NewArchive {
  constructor() {
  }

  create(title) {
    this.title = title
    const promise = DatArchive.create({
      title,
      description: title
    }).then(archive => {
      this.archive = archive
      console.log('Jim new archive', archive)
      return archive.url
    })
    return promise
  }
}

module.exports = NewArchive
