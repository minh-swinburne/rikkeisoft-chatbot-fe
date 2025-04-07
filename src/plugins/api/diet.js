export const dietAPI = (client) => {
  const prefix = 'diet'

  return {
    detectFood: (formData) =>
      client.post(`${prefix}/detect-food`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  }
}
