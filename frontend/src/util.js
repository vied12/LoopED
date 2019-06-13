export function getCookie(cname) {
  var name = cname + '='
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export const startLEDGame = () =>
  fetch('/jump-start', {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  }).then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response
    }
    throw new Error(response.statusText)
  })
