import { Client } from "./client"
import { docsAPI } from "./docs";
import { authAPI } from "./auth";
import { usersAPI } from "./users";
import { chatsAPI } from "./chats";
import { configAPI } from "./config";

const baseURL = "http://127.0.0.1:8000/api/v1/";
const client = new Client(baseURL);

export const apiClient = {
  baseURL: baseURL,
  client: client,

  docs: docsAPI(client),
  auth: authAPI(client),
  users: usersAPI(client),
  chats: chatsAPI(client),
  config: configAPI(client),
};
