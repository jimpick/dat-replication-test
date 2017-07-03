const html = require('choo/html')
const choo = require('choo')
const listView = require('./listView')
const SitesModel = require('./sitesModel')
const NewArchive = require('./newArchive')

const app = choo({ href: false })
app.use(store)
app.route('/', contentView)
app.mount('div#content')

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

function contentView (state, emit) {
  let button = ''
  if (window.DatArchive) {
    button = createDatButton(state, emit)
  }
  return html`
    <div id="content">
      ${button}

      ${listView(state, emit)}
    </div>
  `
}

function createDatButton (state, emit) {
  return html`
    <button id="createDat">Create Dat Site</button>
  `
}

const makeClickHandler = (sitesModel) => {
  const url = document.location.href
  const func = (state, emitter) => {
    const buttonEl = document.querySelector('#createDat')
    buttonEl.addEventListener('click', async event => {
      const { sites } = state
      try {
        const newArchive = new NewArchive()
        const defaultTitle = `My Awesome DAT Web Site #${sites.length + 1}`
        const info = await newArchive.create({
          defaultTitle,
          createdFrom: url
        })
        await sitesModel.pushSite(info)
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

run()


