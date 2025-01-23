class fetchClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async call(url, options = {}) {
    const token = localStorage.getItem("access_token");
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    return fetch(this.baseURL + url, { ...options, headers });
  }
}

export default fetchClient;