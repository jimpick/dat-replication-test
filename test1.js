function renderFileList(files) {
  const listEl = document.querySelector('#test1List')
  listEl.innerHTML = ''
  files.forEach(file => {
    const listItemEl = document.createElement('li')
    listItemEl.innerHTML = `<a href="/test1/${file}">${file}</a>`
    listEl.appendChild(listItemEl)
  })
}

function readFiles() {
  fetch('/files.json')
    .then(response => response.json())
    .then(test1Files => {
      console.log('Jim json', test1Files)
      renderFileList(test1Files)
    })
}
readFiles()

const buttonEl = document.querySelector('#createDat')
const publishButtonEl = document.querySelector('#publish')

if (!window.DatArchive) {
  buttonEl.remove()
  publishButtonEl.remove()
} else {
  const url = 'dat://188e04da36894f212254b72d9c7e0d0fb6cb12574eabf2761d268cfe618d75aa/'
  const archive = new DatArchive(url)

function updateFiles() {
  return archive.readdir('/test1')
    .then(test1Files => {
      console.log('Jim5', test1Files)
      renderFileList(test1Files)
      return archive.writeFile('/files.json', JSON.stringify(test1Files))
    })
    .then(() => {
      console.log('files.json written')
    })
}


archive.readdir('/')
  .then(topFiles => {
    if (topFiles.includes('test1')) {
      return
    }
    return archive.mkdir('/test1')
  })
  .then(() => {
    return archive.readdir('/')
  })
  .then(topFiles => {
    return readFiles()
  })

  buttonEl.addEventListener('click', event => {
    const now = Date.now()
    const file = `/test1/${now}.txt`
    archive.writeFile(file, String(now))
      .then(() => {
        console.log(`Wrote ${file}`)
        return updateFiles()
      })
  })
  // await archive.mkdir('/subdir')

  publishButtonEl.addEventListener('click', event => {
    archive.commit()
      .then(result => {
        console.log('Published', result)
      })
  })

}

