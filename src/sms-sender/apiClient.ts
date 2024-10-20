import Client from "android-sms-gateway"
import { login, pass } from "../utils";

// Example of an HTTP client based on fetch
const httpFetchClient = {
  get: async (url: string, headers: Record<string, string>) => {
      const response = await fetch(url, {
          method: "GET",
          headers
      });

      return response.json();
  },
  post: async (url: string, body: BodyInit, headers: Record<string, string>) => {
      const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
      });

      return response.json();
  },
  delete: async (url: string, headers: Record<string, string>) => {
      const response = await fetch(url, {
          method: "DELETE",
          headers
      });

      return response.json();
  }
};

// Initialize the client with your API credentials
const apiClient = new Client(login, pass, httpFetchClient);

export { apiClient }