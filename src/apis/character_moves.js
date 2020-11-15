import Api from '@/services/api'

const basePath = 'character-moves'

const list = (filters) => {
  var qs = Object.keys(filters).map(key => key + '=' + filters[key]).join('&')
  const url = basePath + '?' + qs
  return Api.get(url)
    .then(res => {
      return res.data || []
    })
}

const update = (characterMoveId, data) => {
  const url = basePath + '/' + characterMoveId
  return Api.put(url, data)
    .then(res => {
      return res.data
    })
}

export default {
  list,
  update
}
