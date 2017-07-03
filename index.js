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

  state.origin = document.location.origin
  const sitesModel = new SitesModel(state.origin)
  await sitesModel.init()

  if (window.DatArchive) {
    state.localArchive = new DatArchive(state.origin)
    state.info = await state.localArchive.getInfo()
  }
  state.sites = []

  async function update () {
    const response = await fetch('/sites.json')
    state.sites = await response.json()
    emitter.emit('render')
  }
  await update() // Initial load
  emitter.on('update', update)

  async function createNewSite () {
    const { sites, origin } = state
    try {
      const newArchive = new NewArchive()
      const defaultTitle = `My Awesome DAT Web Site #${sites.length + 1}`
      const info = await newArchive.create({
        defaultTitle,
        createdFrom: origin
      })
      await sitesModel.pushSite(info)
      emitter.emit('update')
    } catch (error) {
      if (error.name === 'UserDeniedError') {
        console.log(error.message)
        return
      }
      console.log('Create error', error)
    }
  }
  emitter.on('createNewSite', createNewSite)

}

function contentView (state, emit) {

  let button = ''
  if (window.DatArchive && state.info) {
    if (state.info.isOwner) {
      button = createDatButton(state, emit)
    } else {
      button = forkDirectoryDatButton(state, emit)
    }
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
    <button id="createDat" onclick=${() => emit('createNewSite')}>
      Create Dat Site
    </button>
  `
}

function forkDirectoryDatButton (state, emit) {
  return html`
    <div>
      <p>
        You do not own this Dat archive, but you can fork your own
        version.
      </p>
      <button id="forkDirectoryDat">Fork This</button>
    </div>
  `
}

