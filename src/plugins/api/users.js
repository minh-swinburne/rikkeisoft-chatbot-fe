export const usersAPI = (client) => {
  const prefix = 'users'

  return {
    listUsers: () => client.get(`${prefix}`),

    getCurrentUser: () => client.get(`${prefix}/me`),

    getUser: (userId) => client.get(`${prefix}/${userId}`),

    updateCurrentUser: (updates) => client.put(`${prefix}/me`, updates),

    assignRole: (userId, role) => client.put(`${prefix}/${userId}/role/assign`, role),

    revokeRole: (userId, role) => client.put(`${prefix}/${userId}/role/revoke`, role),

    deleteUser: (userId) => client.delete(`${prefix}/${userId}`),

    deleteCurrentUser: () => client.delete(`${prefix}/me`),

    uploadAvatar: (avatarFile) =>
      client.post(
        `${prefix}/me/avatar`,
        { avatar_file: avatarFile },
        { headers: { 'Content-Type': 'multipart/form-data' } },
      ),

    deleteAvatar: () => client.delete(`${prefix}/me/avatar`),

    listSSO: () => client.get(`${prefix}/me/sso`),

    linkSSO: (provider, authData) => client.post(`${prefix}/me/sso/${provider}`, authData),

    unlinkSSO: (provider) => client.delete(`${prefix}/me/sso/${provider}`),

    listDocsByUser: (userId) => client.get(`${prefix}/${userId}/docs`),
  }
}
