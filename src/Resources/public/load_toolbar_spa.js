(function () {

  let proxied = XMLHttpRequest.prototype.open
  let barWasInjected = false

  configureFetchSubscriber = function () {

    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      let [resource, config] = args;

      let response = await originalFetch(resource, config);

      let tokenLink = response.headers.get('x-debug-token-link')
      let token = response.headers.get('X-Debug-Token')

      if (barWasInjected || !tokenLink || !token) {
        return response
      }

      injectToolBarFromToken(tokenLink, token)

      return response;
    };
  }

  configureXHRSubscriber = function () {

    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {

      let self = this;

      this.addEventListener('readystatechange', function () {

        let tokenLink = self.getResponseHeader('x-debug-token-link')
        let token = self.getResponseHeader('X-Debug-Token')

        if (self.readyState !== 4 || barWasInjected || !tokenLink || !token) {
          return
        }

        injectToolBarFromToken(tokenLink, token)

      }, false);

      proxied.apply(this, Array.prototype.slice.call(arguments))
    }
  }

  injectToolBarFromToken = function(tokenLink, token) {

    barWasInjected = true
    tokenLink = (new URL(tokenLink));

    fetch(tokenLink.origin + '/toolbar/' + token)
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
            });
        });
      })
  }

  configureFetchSubscriber()
  configureXHRSubscriber()
})()
