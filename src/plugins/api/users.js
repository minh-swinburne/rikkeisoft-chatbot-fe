export const usersAPI = (client) => {
  const prefix = 'users'

  return {
    listUsers: () => client.get(`${prefix}`),

    getCurrentUser: () => client.get(`${prefix}/me`),

    getUser: (userId) => client.get(`${prefix}/${userId}`),

    updateCurrentUser: (updates) => client.put(`${prefix}/me`, updates),

    assignRole: (userId, role) => client.put(`${prefix}/${userId}/role/assign`, role),

    revokeRole: (userId, role) => client.put(`${prefix}/${userId}/role/revoke`, role),

    deleteUser: () => client.delete(`${prefix}/me`),

    uploadAvatar: (avatarFile) =>
      client.post(`${prefix}/avatar/upload`, { avatar_file: avatarFile }, { headers: { 'Content-Type': 'multipart/form-data' } }),

    listSSO: () => client.get(`${prefix}/sso`),
  }
}
