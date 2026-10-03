import Api from '@/services/api'
import * as queryString from 'querystring'
import _ from 'lodash'

const basePath = 'moves'

const list = params => {
  let url = basePath

  if (params) {
    const filters = {
      limit: 8,
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
      return res
    })
    .catch(err => {
      throw err
    })
}

const post = (model) => {
  const url = basePath

  return Api.post(url, model)
    .then(res => {
      return res
    })
    .catch(err => {
      throw err
    })
}

const remove = (moveId) => {
  const url = basePath + '/' + moveId

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
