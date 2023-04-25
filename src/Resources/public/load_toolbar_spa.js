(function () {

  getConfValue = function (value) {
    return document.currentScript.dataset[value]
  }

  const config = {urlToolbar: getConfValue('urlToolbar') ?? '{ORIGIN}/toolbar/{TOKEN}' }

  let proxied = XMLHttpRequest.prototype.open
  let toolbarWasInjected = false

  configureFetchSubscriber = function () {

    const { fetch: originalFetch } = window
    window.fetch = async (...args) => {
      let [resource, config] = args

      let response = await originalFetch(resource, config)

      let tokenLink = response.headers.get('x-Debug-Token-Link')
      let token = response.headers.get('X-Debug-Token')

      if (toolbarWasInjected || !tokenLink || !token) {
        return response
      }

      injectToolBarFromToken(tokenLink, token)

      return response
    }
  }

  configureXHRSubscriber = function () {

    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {

      let self = this

      this.addEventListener('readystatechange', function () {

        let tokenLink = self.getResponseHeader('X-Debug-Token-Link')
        let token = self.getResponseHeader('X-Debug-Token')

        if (self.readyState !== 4 || toolbarWasInjected || !tokenLink || !token) {
          return
        }

        injectToolBarFromToken(tokenLink, token)

      }, false)

      proxied.apply(this, Array.prototype.slice.call(arguments))
    }
  }

  injectToolBarFromToken = function(tokenLink, token) {

    toolbarWasInjected = true
    tokenLink = (new URL(tokenLink))

    const urlToLoadToolbar = config.urlToolbar.replace('{ORIGIN}', tokenLink.origin).replace('{TOKEN}', token)

    fetch(urlToLoadToolbar)
      .then((response) => {

        response.text().then(function (text) {

          let div = document.createElement('div')
          div.innerHTML = text
          document.body.appendChild(div)

          let rows = div.querySelectorAll('script')

          Array.from(rows)
            .forEach(oldScriptEl => {

              const newScriptEl = document.createElement('script')

              Array.from(oldScriptEl.attributes).forEach(attr => {
                newScriptEl.setAttribute(attr.name, attr.value)
              })

              const scriptText = document.createTextNode(oldScriptEl.innerHTML)

              newScriptEl.appendChild(scriptText)

              oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl)
            })
        })
      })
  }

  configureFetchSubscriber()
  configureXHRSubscriber()
})()
