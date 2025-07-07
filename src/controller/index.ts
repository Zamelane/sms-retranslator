import type { ITGMessage } from "../sms-sender"
import { sendMessage } from "../sms-sender/client"
import { criticalMinimum, currentMessages, debug, subCurrMessages } from "../utils"

const maxSymbols = 288
const maxSeconds = 60
let lastSending = new Date()

const messagesToSend: ITGMessage[] = []

let message = ""
let lastUserName: string | null = null

function isTimeDifferenceExceeded(date1: Date, date2: Date, maxSeconds: number): boolean {
  // Получаем разницу в миллисекундах
  const differenceMs = Math.abs(date1.getTime() - date2.getTime());
  
  // Конвертируем миллисекунды в секунды и сравниваем с maxSeconds
  return differenceMs / 1000 > maxSeconds;
}

export const addMessageToSend = (userName: string, messageText: string) => {
  if (userName == "" || messageText == "")
    return

  messagesToSend.push({
    userName,
    messageText
  })
}

export const buildMessagesToOneAndSendIfLarge = () => {
  while (messagesToSend.length > 0) {
    const currMessageToSend = messagesToSend[0]
    messagesToSend.splice(0, 1)

    if (lastUserName != currMessageToSend.userName) {
      lastUserName = currMessageToSend.userName
      message += lastUserName[0] + ":"
    }

    message += currMessageToSend.messageText + "\n"
  }

  while (message.length >= maxSymbols || isTimeDifferenceExceeded(lastSending, new Date(), maxSeconds)) {
    const messageToSend = message.substring(0, maxSymbols)
    message = message.substring(maxSymbols, message.length)
    
    if (currentMessages > criticalMinimum) {
      lastSending = new Date()
      // Отправляем
      if (!debug)
        sendMessage(messageToSend)
    }
  }
}

// export const buildMessagesToOneAndSendIfLarge = () => {
//   let isNotEnoughMessages = messagesToSend.length == 0
//   let isSplitted = false

//   while (message.length < maxSymbols && messagesToSend.length > 0) {
//     backupMessage = message
//     const currMessageToSend = messagesToSend[0]

//     console.log(lastUserName == currMessageToSend.userName, lastUserName, currMessageToSend.userName)

//     if (lastUserName != currMessageToSend.userName) {
//       lastUserName = currMessageToSend.userName
//       message += lastUserName[0] + ":"
//     }

//     let messagesToPlus = currMessageToSend.messageText

//     const dynamicLength = maxSymbols - 4
    
//     if (backupMessage == "" && messagesToPlus.length > dynamicLength) {
//       messagesToPlus = currMessageToSend.messageText.substring(0, dynamicLength - 1)
//       currMessageToSend.messageText = currMessageToSend.messageText.substring(dynamicLength, currMessageToSend.messageText.length - 1)
//       isSplitted = true
//     } else if (backupMessage != "" && messagesToPlus.length > dynamicLength) {
//       break
//     }
//     else if (!isSplitted) {
//       messagesToSend.splice(0, 1)
//     }

//     message += " " + messagesToPlus + "\n"

//     if (message.length > maxSymbols) {
//       message = backupMessage
//       break
//     }

//     if (messagesToSend.length == 0)
//       isNotEnoughMessages = true
//   }

//   if (!isNotEnoughMessages) {
//     console.log('Типа отправляю это: ' + message)
//     // TODO: тут отправить сообщение, уменьшить счётчик и сохранить
//     subCurrMessages()
//     message = ""
//     backupMessage = message
//     lastUserName = null
//   }
//   else {
//     //console.log('Не отправляю ' + message.length)
//   }
// }