class NewArchive {
  constructor() {
  }

  create(title) {
    this.title = title
    const promise = DatArchive.create({
      title,
      description: title
    })
    .then(archive => {
      this.archive = archive
      console.log('Jim new archive', archive)
      return archive.getInfo()
    })
    .catch(error => {
      // FIXME: A bit confused what is happening here
      // console.log('New Archive Error', error)
      console.log('New Archive: User denied permission')
      return null
    })
    return promise
  }
}

module.exports = NewArchive
