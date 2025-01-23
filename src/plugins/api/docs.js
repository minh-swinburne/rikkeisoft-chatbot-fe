export const docsAPI = (client) => {
  const prefix = "docs";

  return {
    listDocs: () => client.get(`${prefix}`),

    uploadDoc: (formData) =>
      client.post(`${prefix}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

    editDoc: (id, formData) =>
      client.put(`${prefix}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

    downloadDoc: (id) =>
      client.get(`docs/${id}/download`, { responseType: "blob" }),

    previewDoc: (id) => client.get(`docs/${id}/preview`),

    deleteDoc: (id) => client.delete(`docs/${id}`),
  };
};
