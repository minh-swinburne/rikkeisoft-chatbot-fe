export const chatsAPI = (client) => {
  const prefix = 'chats'

  return {
    listChats: () => client.get(`${prefix}`),

    createChat: (name, userId) => client.post(`${prefix}`, { name, user_id: userId }),

    renameChat: (chatId, name) => client.put(`${prefix}/${chatId}`, { name }),

    deleteChat: (chatId) => client.delete(`${prefix}/${chatId}`),

    listMessages: (chatId) => client.get(`${prefix}/${chatId}`),

    sendMessage: (chatId, query, type) =>
      client.fetch(`${prefix}/${chatId}?type=${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream, text/plain, application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          role: 'user',
          content: query,
        }),
      }),

    getSuggestions: (chatId) => client.get(`chats/${chatId}/suggestions`),

    getNewName: (chatId) =>
      client.fetch(`chats/${chatId}/name`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
  }
}
