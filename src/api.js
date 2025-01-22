import axios from 'axios';

class APIClient {
  constructor(baseURL) {
    this.client = axios.create({ baseURL });
    this.baseURL = baseURL;
  }

  // Authenticate (native, Google, Microsoft)
  authenticateNative(params) {
    return this.client.post('auth/native', params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      withCredentials: true,
    });
  }

  authenticateGoogle(accessToken) {
    return this.client.post('auth/google', { access_token: accessToken }, {
      headers: { "Content-Type": "application/json" },
    });
  }

  authenticateMicrosoft(loginResponse) {
    return this.client.post('auth/microsoft', {
      access_token: loginResponse.accessToken,
      id_token: loginResponse.idToken,
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginResponse.accessToken}`,
      },
    });
  }

  // Register user
  registerUser(userDetails) {
    return this.client.post('auth/register', userDetails, {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate and refresh token
  validateToken() {
    return this.client.get('auth/validate', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
  }

  refreshToken() {
    return this.client.post('auth/refresh', null, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${this.refreshToken}`,
      },
    });
  }
 
  // Chat & Message
  getChats(userId) {
    return this.client.get('chats', {
      params: { user_id: userId },
    });
  }

  createChat(name, userID) {
    return this.client.post(`chats`, {name: name, user_id: userID})
  }

  renameChat(chatId, name, userId) {
    return this.client.put(`chats/${chatId}/rename`, name, userId);
  }

  deleteChat(chatId) {
    return this.client.delete(`chats/${chatId}/delete`);
  }

  getMessage(chatId) {
    return this.client.get(`chats/${chatId}`);
  }

  getSuggestion(chatId) {
    return this.client.post(`chats/${chatId}/suggestions`);
  }

  sendMessage(chatId, query) {
    return fetch(`${this.baseURL}chats/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
  }
  
  // Get docs
  getDocs() {
    return this.client.get('docs');
  }

  // Upload docs
  uploadDocs(formData){
    return this.client.post(`docs`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Edit docs
  editDocs(id, formData) {
    return this.client.put(`docs/${id}/edit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Download docs
  downloadDoc(id) {
    return this.client.get(`docs/${id}/download`, { responseType: 'blob' });
  }

  // Delete docs
  deleteDoc(id) {
    return this.client.delete(`docs/${id}/delete`);
  }

  // Get config
  getConfig(tab) {
    return this.client.get(`config/${tab}`);
  }

  // Update config
  updateConfig(tab, config) {
    return this.client.put(`config/${tab}`, {
      system_prompt: config.value.instructions,
      message_template: config.value.messageTemplate?.split("\n") || null,
      model: config.value.model,
      max_tokens: parseInt(config.value.maxTokens),
      temperature: parseFloat(config.value.temperature),
    });
  }

}

export default new APIClient('http://127.0.0.1:8000/api/v1/'); // Adjust baseURL as needed
