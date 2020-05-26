import Api from '@/services/api'

let basePath = 'moves'

const list = () => {
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

const get = (moveId) => {
  const url = basePath + '/' + moveId

  return Api.get(url)
    .then(res => {
      return res.data
    })
    .catch(err => {
      throw err
    })
}

const put = (moveId, model) => {
  const url = basePath + '/' + moveId

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

const remove = (moveId) => {
  const url = basePath + '/' + moveId

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