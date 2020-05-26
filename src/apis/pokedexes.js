import Api from "@/services/api";

let basePath = "game-groups";

const list = () => {
  const url = basePath;

  return Api.get(url)
    .then(res => {
      return res.data || [];
    })
    .catch(err => {
      throw err;
    });
};

const get = gameGroupId => {
  const url = basePath + "/" + gameGroupId;

  return Api.get(url)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      throw err;
    });
};

const put = (gameGroupId, model) => {
  const url = basePath + "/" + gameGroupId;

  return Api.put(url, model)
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
};

const post = model => {
  const url = basePath;

  return Api.post(url, model)
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
};

const remove = gameId => {
  const url = basePath + "/" + gameId;

  return Api.delete(url)
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
};

export default {
  list,
  get,
  put,
  post,
  remove
};
