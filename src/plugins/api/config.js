export const configAPI = (client) => {
  const prefix = "config";

  return {
    getConfig: (tab) => client.get(`${prefix}/${tab}`),

    updateConfig: (tab, config) =>
      client.put(`${prefix}/${tab}`, {
        system_prompt: config.value.instructions,
        message_template: config.value.messageTemplate?.split("\n") || null,
        model: config.value.model,
        max_tokens: parseInt(config.value.maxTokens),
        temperature: parseFloat(config.value.temperature),
      }),
  };
};
