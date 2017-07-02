const choo = require('choo')
const listView = require('./listView')
const Archive = require('./archive')
const NewArchive = require('./newArchive')

const app = choo({ href: false })
app.use(store)
app.route('/', listView)
app.mount('ul#siteList')

function store (state, emitter) {
  state.sites = []
  function update() {
    fetch('/sites.json')
      .then(response => response.json())
      .then(sites => {
        state.sites = sites
        emitter.emit('render')
      })
  }
  update() // Initial load
  emitter.on('update', update)
}

const buttonEl = document.querySelector('#createDat')

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
          const file = `/sites/${now}.json`
          const newArchive = new NewArchive()
          const defaultTitle = `Title ${now}`
          newArchive.create(defaultTitle)
            .then(info => url && archive.writeFile(file, info))
            .then(() => emitter.emit('update'))
            .catch(error => {
              console.log('Create error', error)
            })
        })
      }
      app.use(clickHandler)
    })
}

