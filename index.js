const choo = require('choo')
const listView = require('./listView')
const SitesModel = require('./sitesModel')
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

const makeClickHandler = (sitesModel) => {
  const url = document.location.href
  const func = (state, emitter) => {
    const buttonEl = document.querySelector('#createDat')
    buttonEl.addEventListener('click', async event => {
      const now = Date.now()
      const file = `/sites/${now}.json`
      const { sites } = state
      try {
        const newArchive = new NewArchive()
        const defaultTitle = `My Awesome DAT Web Site #${sites.length + 1}`
        const info = await newArchive.create({
          defaultTitle,
          createdFrom: url
        })
        await sitesModel.writeFile(file, info)
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
  const sitesModel = new SitesModel(url)
  await sitesModel.init()
  app.use(makeClickHandler(sitesModel))
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
