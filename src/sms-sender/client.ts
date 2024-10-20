import { phone, subCurrMessages } from "../utils"
import { apiClient } from "./apiClient"
import type { IMessage, IMessageInfo, ProcessState } from "./types"

const sendMessage = async (message: string): Promise<null | IMessageInfo> => {
  subCurrMessages()
  
  const messageBuild: IMessage = {
    phoneNumbers: [phone],
    message
  }

  let processState: ProcessState | null = null
  let messageId: string | null = null

  await apiClient.send(messageBuild)
    .then(messageState => {
      processState = messageState.state
      messageId = messageState.id
    })
    .catch(error => console.error(error))

  if (!processState || !messageId)
    return null

  return {
    processState,
    messageId,
    update: async () => {
      if (!messageId)
        return false

      let state: ProcessState | null = null

      await apiClient.getState(messageId)
        .then(ms => {
          state = ms.state
        })
        .catch(error => console.log(error))

      if (state) {
        processState = state
        return true
      }

      return false
    }
  }
}

export { sendMessage }