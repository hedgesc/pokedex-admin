import Api from '@/services/api'

const basePath = 'game-groups'

const list = () => {
  const url = basePath

  return Api.get(url)
    .then(res => {
      return res.data || []
    })
    .catch(err => {
      throw err
    })
}

const get = gameGroupId => {
  const url = basePath + '/' + gameGroupId

  return Api.get(url)
    .then(res => {
      return res.data
    })
    .catch(err => {
      throw err
    })
}

const put = (gameGroupId, model) => {
  const url = basePath + '/' + gameGroupId

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

const remove = gameGroupId => {
  const url = basePath + '/' + gameGroupId

  return Api.delete(url)
    .then(res => {
      return res
    })
    .catch(err => {
      throw err
    })
}

const listGames = gameGroupId => {
  const url = basePath + '/' + gameGroupId + '/games'

  return Api.get(url)
    .then(res => {
      return res.data || []
    })
    .catch(err => {
      throw err
    })
}

const addGame = (gameGroupId, model) => {
  const url = basePath + '/' + gameGroupId + '/games'

  return Api.post(url, model)
    .then(res => {
      return res
    })
    .catch(err => {
      throw err
    })
}

const removeGame = (gameGroupId, gameId) => {
  const url = basePath + '/' + gameGroupId + '/games/' + gameId

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
  remove,
  listGames,
  addGame,
  removeGame
}
