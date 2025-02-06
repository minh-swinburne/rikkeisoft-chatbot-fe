export const configAPI = (client) => {
  const prefix = 'config'

  return {
    getConfig: (tab) => client.get(`${prefix}/${tab}`),

    updateConfig: (tab, config) =>
      client.put(`${prefix}/${tab}`, {
        system_prompt: config.instructions,
        message_template: config.messageTemplate?.split('\n') || null,
        model: config.model,
        max_tokens: parseInt(config.maxTokens),
        temperature: parseFloat(config.temperature),
      }),

    checkStream: (tab) => client.get(`${prefix}/${tab}/stream`),
  }
}
