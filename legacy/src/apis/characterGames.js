import Api from '@/services/api'

const getBasePath = (id) => {
  return `characters/${id}/games`
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

const get = (characterId, gameId) => {
  const url = getBasePath(characterId) + `/${gameId}`

  return Api.get(url)
    .then(res => {
      return res.data
    })
}

const put = (characterId, gameId, model) => {
  const url = getBasePath(characterId) + `/${gameId}`
  return Api.put(url, model)
}

const remove = (characterId, gameId) => {
  const url = getBasePath(characterId) + `/${gameId}`
  return Api.delete(url)
}

export default {
  list,
  get,
  put,
  post,
  remove
}
