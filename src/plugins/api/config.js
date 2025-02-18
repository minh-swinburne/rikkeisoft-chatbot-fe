export const configAPI = (client) => {
  const prefix = 'config'

  return {
    getConfig: (task, tab, refresh = false) =>
      client.get(`${prefix}/${task}?refresh=${refresh}?tab=${tab}`),

    updateConfig: (task, tab, config) =>
      client.put(`${prefix}/${task}?tab=${tab}`, {
        system_prompt: config.instructions,
        message_template: config.messageTemplate?.split('\n') || null,
        length_limit: config.lengthLimit ?? null,
        model: config.model,
        max_tokens: parseInt(config.maxTokens),
        temperature: parseFloat(config.temperature),
        stream: config.stream,
      }),

    checkStream: (task, tab) => client.get(`${prefix}/${task}/stream?tab=${tab}`),
  }
}
