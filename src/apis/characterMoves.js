import Api from '@/services/api'

const getBasePath = (id) => {
  return `characters/${id}/moves`
}

const list = (characterId) => {
  const url = getBasePath(characterId)

  return Api.get(url)
    .then(res => {
      return res.data || []
    })
}

const post = (characterId, model) => {
  const url = getBasePath(characterId)
  return Api.post(url, model)
}

const get = (characterId, moveId) => {
  const url = getBasePath(characterId) + `/${moveId}`

  return Api.get(url)
    .then(res => {
      return res.data
    })
}

const put = (characterId, moveId, model) => {
  const url = getBasePath(characterId) + `/${moveId}`
  return Api.put(url, model)
}

const remove = (characterId, moveId) => {
  const url = getBasePath(characterId) + `/${moveId}`
  return Api.delete(url)
}

export default {
  list,
  get,
  put,
  post,
  remove
}
