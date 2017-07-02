const choo = require('choo')
const listView = require('./listView')
const Archive = require('./archive')
const NewArchive = require('./newArchive')

const app = choo({ href: false })
app.use(store)
app.route('/', listView)
app.mount('ul#siteList')

async function store (state, emitter) {
  state.sites = []
  async function update () {
    const response = await fetch('/sites.json')
    const sites = await response.json()
    state.sites = sites
    emitter.emit('render')
  }
  await update() // Initial load
  emitter.on('update', update)
}

const makeClickHandler = (archive) => {
  const func = (_, emitter) => {
    const buttonEl = document.querySelector('#createDat')
    buttonEl.addEventListener('click', async event => {
      const now = Date.now()
      const file = `/sites/${now}.json`
      try {
        const newArchive = new NewArchive()
        const defaultTitle = `Title ${now}`
        const info = await newArchive.create(defaultTitle)
        await archive.writeFile(file, info)
        emitter.emit('update')
      } catch (error) {
        console.log('Create error', error)
      }
    })
  }
  return func
}

async function run () {
  const url = document.location.href
  const archive = new Archive(url)
  await archive.init()
  app.use(makeClickHandler(archive))
}

if (!window.DatArchive) {
  const buttonEl = document.querySelector('#createDat')
  buttonEl.remove()
} else {
  run()
}

function timer() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Timer finished')
      resolve()
    }, 1000)
  })
  return promise
}
