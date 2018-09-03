module.exports = {
  webpack: (config, options, webpack) => {
    // Perform customizations to config
    // Important: return the modified config

    // console.log(config, options)

    // changes the name of the entry point from index -> main.js
    // config.entry.main = ['./api/server.js', './reports/index.js']
    config.entry = {
      scraper: './scraper.js',
      historicalScraper: './historical-scraper.js',
      server: './server.js'
    }

    return config
  }
}