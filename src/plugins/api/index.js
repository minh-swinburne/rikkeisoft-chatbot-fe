import { authAPI } from './auth'
import { chatsAPI } from './chats'
import { Client } from './client'
import { configAPI } from './config'
import { docsAPI } from './docs'
import { usersAPI } from './users'

const baseURL = import.meta.env.VITE_API_BASE_URL
const client = new Client(baseURL)

export const apiClient = {
  baseURL: baseURL,
  client: client,

  docs: docsAPI(client),
  auth: authAPI(client),
  users: usersAPI(client),
  chats: chatsAPI(client),
  config: configAPI(client),
}
