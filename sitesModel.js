const uuidv1 = require('uuid/v1')

const sitesDir = 'sites'

class SitesModel {
  constructor(url) {
    this.url = url
    this.archive = new DatArchive(url)
  }

  async init() {
    const topFiles = await this.archive.readdir('/')
    if (!topFiles.includes(sitesDir)) {
      await this.archive.mkdir(sitesDir)
    }
  }

  async pushSite(info) {
    const createdAt = new Date().toISOString()
    const id = uuidv1() // Timestamped
      // Swap fields to sort by time
      // https://github.com/kelektiv/node-uuid/issues/75
      .replace(/^(.{8})-(.{4})-(.{4})/, '$3-$2-$1')
    const file = `${sitesDir}/${id}.json`
    const { title, description, url } = info
    const data = JSON.stringify({
      title,
      description,
      url,
      createdAt
    }, null, 2)
    await this.archive.writeFile(file, data)
    console.log(`Wrote ${file}`)
    await this.updateSitesJson()
  }

  async updateSitesJson() {
    const { archive } = this
    const sites = []
    const files = await archive.readdir(sitesDir)
    const sortedFiles = files.sort()
    for (const file of sortedFiles) {
      const contents = await archive.readFile(`${sitesDir}/${file}`)
      try {
        const data = JSON.parse(contents)
        data.id = file.replace(/\.json$/, '')
        sites.push(data)
      } catch (error) {
        console.log('Error parsing file', file, error)
      }
    }
    await archive.writeFile(
      'sites.json',
      JSON.stringify(sites, null, 2)
    )
    await archive.commit()
  }

}

module.exports = SitesModel
