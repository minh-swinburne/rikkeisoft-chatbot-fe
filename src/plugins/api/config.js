export const configAPI = (client) => {
  const prefix = 'config'

  return {
    getConfig: (tab, refresh = false) => client.get(`${prefix}/${tab}?refresh=${refresh}`),

    updateConfig: (tab, config) =>
      client.put(`${prefix}/${tab}`, {
        system_prompt: config.instructions,
        message_template: config.messageTemplate?.split('\n') || null,
        length_limit: config.lengthLimit ?? null,
        model: config.model,
        max_tokens: parseInt(config.maxTokens),
        temperature: parseFloat(config.temperature),
        stream: config.stream,
      }),

    checkStream: (tab) => client.get(`${prefix}/${tab}/stream`),
  }
}
