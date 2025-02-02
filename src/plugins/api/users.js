export const usersAPI = (client) => {
  const prefix = 'users'

  return {
    listUsers: () => client.get(`${prefix}`),

    getCurrentUser: () => client.get(`${prefix}/me`),

    getUser: (id) => client.get(`${prefix}/${id}`),

    createUser: (userDetails) =>
      client.post(`${prefix}`, userDetails, {
        headers: { 'Content-Type': 'application/json' },
      }),

    updateUser: (id, userDetails) =>
      client.put(`${prefix}/${id}`, userDetails, {
        headers: { 'Content-Type': 'application/json' },
      }),

    deleteUser: (id) => client.delete(`${prefix}/${id}`),
  }
}
