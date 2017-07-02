const html = require('choo/html')
const choo = require('choo')

const app = choo()
app.use(store)
app.route('/', listView)
app.mount('ul#fileList')

function store (state, emitter) {
  state.files = []
  function update() {
    readFilesJson().then(files => {
      state.files = files
      emitter.emit('render')
    })
  }
  update()
  emitter.on('update', update)
}

function readFilesJson () {
  const promise = fetch('/files.json')
    .then(response => response.json())
    .then(files => {
      console.log('Jim json', files)
      return files
    })
  return promise
}

function listView (state, emit) {
  const { files } = state
  return html`
    <ul id="fileList">
      ${files.map(file => {
        return html`
          <li>
            <a href="/test1/${file}">${file}</a>
          </li>
        `
      })}
    </ul>
  `
}

const buttonEl = document.querySelector('#createDat')
const publishButtonEl = document.querySelector('#publish')

if (!window.DatArchive) {
  buttonEl.remove()
  publishButtonEl.remove()
} else {
  const url = 'dat://188e04da36894f212254b72d9c7e0d0fb6cb12574eabf2761d268cfe618d75aa/'
  const archive = new DatArchive(url)

  function updateFilesJson() {
    const promise = archive.readdir('/test1')
      .then(files => {
        return archive.writeFile('/files.json', JSON.stringify(files))
      })
    return promise
  }

  archive.readdir('/')
    .then(topFiles => {
      if (topFiles.includes('test1')) {
        return
      }
      return archive.mkdir('/test1')
    })

  function clickHandler(state, emitter) {
    buttonEl.addEventListener('click', event => {
      const now = Date.now()
      const file = `/test1/${now}.txt`
      archive.writeFile(file, String(now))
        .then(() => {
          console.log(`Wrote ${file}`)
          return updateFilesJson()
        })
        .then(() => {
          emitter.emit('update')
        })
    })
  }
  app.use(clickHandler)
  // await archive.mkdir('/subdir')

  publishButtonEl.addEventListener('click', event => {
    archive.commit()
      .then(result => {
        console.log('Published', result)
      })
  })

}

