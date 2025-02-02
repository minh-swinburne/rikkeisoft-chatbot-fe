import axios from 'axios'

export class Client {
  constructor(baseURL) {
    this.axios = axios.create({ baseURL })
    this.baseURL = baseURL
  }

  getToken() {
    return this.axios.defaults.headers.common['Authorization']
  }

  setToken(accessToken) {
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  }

  clearToken() {
    delete this.axios.defaults.headers.common['Authorization']
  }

  get(url, options = {}) {
    return this.axios.get(url, options)
  }

  post(url, data, options = {}) {
    return this.axios.post(url, data, options)
  }

  put(url, data, options = {}) {
    return this.axios.put(url, data, options)
  }

  delete(url, options = {}) {
    return this.axios.delete(url, options)
  }

  fetch(url, options = {}) {
    const token = this.getToken()
    // console.log(token);
    const headers = {
      ...options.headers,
      Authorization: token,
    }

    return fetch(this.baseURL + url, { ...options, headers })
  }
}
