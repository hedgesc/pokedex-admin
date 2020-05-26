import Api from '@/services/api'

let basePath = 'characters'

const list = (filters) => {
  let url = basePath

  if(filters) {
    const qs = Object.keys(filters).map(key => key + '=' + filters[key]).join('&')
    url = url + '?' + qs
  }

  return Api.get(url)
    .then(res => {
      return res.data || []
    })
    .catch(err => {
      throw err
    })
}

const get = (characterId) => {
  const url = basePath + '/' + characterId

  return Api.get(url)
    .then(res => {
      return res.data
    })
    .catch(err => {
      throw err
    })
}

const put = (characterId, model) => {
  const url = basePath + '/' + characterId

  return Api.put(url, model)
    .then(res => {
      return res.data
    })
    .catch(err => {
      throw err
    })
} 

const post = (model) => {
  const url = basePath

  return Api.post(url, model)
    .then(res => {
      return res.data
    })
    .catch(err => {
      throw err
    })
}

const remove = (characterId) => {
  const url = basePath + '/' + characterId

  return Api.delete(url)
    .then(res => {
      return res.data
    })
    .catch(err => {
      throw err
    })
}

export default {
  list,
  get,
  put,
  post,
  remove
}