import Api from '@/services/api'

let basePath = 'characters'

const list = (filters) => {
  var qs = Object.keys(filters).map(key => key + '=' + filters[key]).join('&')
  let url = basePath + '?' + qs
  return Api.get(url)
    .then(res => {
      return res.data || []
    })
}

const get = (characterId) => {
  let url = basePath + '/' + characterId
  return Api.get(url)
    .then(res => {
      return res.data
    })
}

const getPrevious = (characterId, n) => {
  let url = basePath + '/' + characterId + '?previous=' + n
  return Api.get(url)
    .then(res => {
      return res.data
    })
}

const getNext = (characterId, n) => {
  let url = basePath + '/' + characterId + '?next=' + n
  return Api.get(url)
    .then(res => {
      return res.data
    })
}

export default {
  list,
  get,
  getPrevious,
  getNext,
}