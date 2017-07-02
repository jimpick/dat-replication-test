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

  async writeFile(file, info) {
    const { title, description, url } = info
    const data = JSON.stringify({
      title,
      description,
      url
    }, null, 2)
    await this.archive.writeFile(file, data)
    console.log(`Wrote ${file}`)
    await this.updateSitesJson()
  }

  async updateSitesJson() {
    const { archive } = this
    const sites = []
    const files = await archive.readdir(sitesDir)
    for (const file of files) {
      const contents = await archive.readFile(`${sitesDir}/${file}`)
      try {
        const data = JSON.parse(contents)
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
