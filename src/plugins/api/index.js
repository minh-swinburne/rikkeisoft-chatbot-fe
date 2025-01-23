import { Client } from "./client"
import { authAPI } from "./auth";
import { chatsAPI } from "./chats";
import { docsAPI } from "./docs";
import { configAPI } from "./config";

const baseURL = "http://127.0.0.1:8000/api/v1/";
const client = new Client(baseURL);

export const apiClient = {
  baseURL: baseURL,
  client: client,

  auth: authAPI(client),
  chats: chatsAPI(client),
  docs: docsAPI(client),
  config: configAPI(client),
};
