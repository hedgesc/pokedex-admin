import Api from '@/services/api'
import * as queryString from 'querystring'
import _ from 'lodash'

const basePath = 'characters'

const list = params => {
  let url = basePath

  if (params) {
    const filters = {
      limit: 6,
      offset: 0
    }
    _.assign(filters, params)

    url = url + '?' + queryString.stringify(filters)
  }

  return Api.get(url)
    .then(res => {
      return res.data || []
    })
    .catch(err => {
      throw err
    })
}

const get = characterId => {
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
      return res
    })
    .catch(err => {
      throw err
    })
}

const post = model => {
  const url = basePath

  return Api.post(url, model)
    .then(res => {
      return res
    })
    .catch(err => {
      throw err
    })
}

const remove = characterId => {
  const url = basePath + '/' + characterId

  return Api.delete(url)
    .then(res => {
      return res
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
