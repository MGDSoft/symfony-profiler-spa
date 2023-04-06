(function () {
  let proxied = XMLHttpRequest.prototype.open
  let barWasInjected = false

  XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {

    let self = this;

    this.addEventListener('readystatechange', function () {

      if (self.readyState !== 4 || barWasInjected) {
        return
      }

      let tokenLink = self.getResponseHeader('x-debug-token-link')

      if (!tokenLink) {
        return
      }

      barWasInjected = true

      let token = self.getResponseHeader('X-Debug-Token')
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

    }, false);

    proxied.apply(this, Array.prototype.slice.call(arguments))
  }
})()
