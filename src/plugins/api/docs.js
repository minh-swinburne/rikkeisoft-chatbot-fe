export const docsAPI = (client) => {
  const prefix = 'docs'

  return {
    listDocs: () => client.get(`${prefix}`),

    uploadDoc: (formData) =>
      client.post(`${prefix}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    editDoc: (id, updates) =>
      client.put(`${prefix}/${id}`, updates),

    deleteDoc: (id) => client.delete(`${prefix}/${id}`),

    previewDoc: (id) => client.get(`${prefix}/${id}/preview`),

    downloadDoc: (id) => client.get(`${prefix}/${id}/download`),
  }
}
