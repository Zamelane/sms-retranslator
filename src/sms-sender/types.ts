export interface IMessage {
  phoneNumbers: string[]
  message: string
}

export interface IMessageInfo {
  processState: ProcessState
  messageId: string
  update(): Promise<boolean>
}

export interface IChat {
  fullName: string
  command: string
  tgId: number
}

export interface IReceivedMessage {
  deviceId: string
  event: string
  id: string
  payload: {
    message: string
    phoneNumber: string
    receivedAt: string
  }
  webhookId: string
}
export interface ITGMessage {
  userName: string
  messageText: string
}


// Из зависимостей
export declare enum ProcessState {
	Pending = "Pending",
	Processed = "Processed",
	Sent = "Sent",
	Delivered = "Delivered",
	Failed = "Failed"
}