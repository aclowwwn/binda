const ejs = require('ejs')
const stream = require('stream')

class _ {
  constructor(props) {
    this._props = { ...props, ...{} }
  }

  get props() {
    return this._props
  }

  process(template, options = {}, data = {}) {
    if (!(template instanceof stream.Stream)) {
      return Promise.reject(
        new Error(_.ERRORS.CANNOT_PROCESS(_.MESSAGES.WRONG_TEMPLATE_FORMAT))
      )
    }

    let templateData = ''

    return new Promise((resolve, reject) => {
      try {
        template.on('data', chunk => {
          templateData = chunk.toString()

          const compiledTemplate = ejs.compile(templateData)

          const output = compiledTemplate(data)

          const writeableTemplate = stream.Writable()

          writeableTemplate.data = output

          resolve(writeableTemplate)
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
      ? `Cannot process template because ${reason}`
      : `Cannot process template`
}

_.MESSAGES = {
  WRONG_TEMPLATE_FORMAT: 'wrong template format. Expected a stream'
}

module.exports = _
