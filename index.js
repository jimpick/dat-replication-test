const choo = require('choo')
const listView = require('./listView')
const Archive = require('./archive')

const app = choo()
app.use(store)
app.route('/', listView)
app.mount('ul#fileList')

function store (state, emitter) {
  state.files = []
  function update() {
    fetch('/files.json')
      .then(response => response.json())
      .then(files => {
        state.files = files
        emitter.emit('render')
      })
  }
  update() // Initial load
  emitter.on('update', update)
}

const buttonEl = document.querySelector('#createDat')
const publishButtonEl = document.querySelector('#publish')

if (!window.DatArchive) {
  buttonEl.remove()
  publishButtonEl.remove()
} else {
  const url = 'dat://188e04da36894f212254b72d9c7e0d0fb6cb12574eabf2761d268cfe618d75aa/'
  const archive = new Archive(url)
  archive.init()
    .then(() => {
      function clickHandler(state, emitter) {
        buttonEl.addEventListener('click', event => {
          const now = Date.now()
          const file = `/test1/${now}.txt`
          archive.writeFile(file, String(now))
            .then(() => {
              emitter.emit('update')
            })
        })
      }
      app.use(clickHandler)

      publishButtonEl.addEventListener('click', event => {
        archive.publish()
          .then(result => {
            console.log('Published', result)
          })
      })
    })
}

