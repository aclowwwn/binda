const marked = require('marked')
const stream = require('stream')

class _ {
  constructor(props) {
    this._props = { ...props, ...{} }
  }

  get props() {
    return this._props
  }

  process(template, options = {}) {
    if (!(template instanceof stream.Stream)) {
      return Promise.reject(
        new Error(_.ERRORS.CANNOT_PROCESS(_.MESSAGES.WRONG_MARKDOWN_FORMAT))
      )
    }

    let markdownData = ''

    return new Promise((resolve, reject) => {
      try {
        template.on('data', chunk => {
          markdownData = chunk.toString()

          const html = marked(markdownData, options)

          const writeableHtmlOutput = stream.Writable()

          writeableHtmlOutput.data = html

          resolve(writeableHtmlOutput)
        })
      } catch (error) {
        reject(new Error(_.ERRORS.CANNOT_PROCESS(error.message)))
      }
    })
  }
}

_.ERRORS = {
  CANNOT_PROCESS: reason =>
    reason
      ? `Cannot process markdown because ${reason}`
      : `Cannot process markdown`
}

_.MESSAGES = {
  WRONG_MARKDOWN_FORMAT: 'wrong markdown format. Expected a stream'
}

module.exports = _
