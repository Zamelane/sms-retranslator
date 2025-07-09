import Client, {} from "android-sms-gateway"
import { login, pass } from "../utils";

const address: string|null = process.env.gate_url!
const hookAddress: string|null = process.env.hook_url!

// Крч не знаю как указать на неэкспортированный типа, поэтому просто вынес сюда
declare enum WebHookEventType {
	/**
	 * Indicates that a new SMS message has been received.
	 */
	SmsReceived = "sms:received",
	/**
	 * Indicates that a ping request has been sent.
	 */
	SystemPing = "system:ping"
}

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
const apiClient = new Client(login, pass, httpFetchClient, address);

const hookUrl = address + "/"

const webhooks = await apiClient.getWebhooks()
let isFound = false
for (const hook of webhooks) {
    if (hook.url === hookAddress) {
        isFound = true
        break
    }
}

if (!isFound) {
    await apiClient.registerWebhook({
        url: hookAddress,
        event: WebHookEventType.SmsReceived
    })
}

export { apiClient }