import Elysia from "elysia"
import { bot } from "./src"
import { apiClient } from "./src/sms-sender/apiClient"
import type { IReceivedMessage } from "./src/sms-sender"
import { chats } from "./src/utils"
import { addMessageToSend, buildMessagesToOneAndSendIfLarge } from "./src/controller"

bot.on('message', (msg) => {
  //console.log(msg.text)
})

console.log(await apiClient.getWebhooks())

// while (true) {
//   await Bun.sleep(1000)
//   console.log(await apiClient.getWebhooks())
// }

new Elysia()
  .get('/', () => {
    return 'Да, слушаю'
  })
  .post('/', ({body}) => {
    const message = body as IReceivedMessage
    
    chats.forEach((chat) => {
      if (message.payload.message.indexOf(chat.command) != 0)
        return

      bot.sendMessage(
        chat.tgId, 
        `<blockquote>${message.payload.message}</blockquote>\n` +
        `от: <span class="tg-spoiler">${message.payload.phoneNumber}</span>, в: ${message.payload.receivedAt.split('T')[1]}`,
        {
          parse_mode: 'HTML'
        }
      )

      addMessageToSend('you', '[Вы здесь ответили]')

      // bot.sendMessage(
      //   chat.tgId, 
      //   `Сообщение в ${chat.fullName} (${chat.command})\n` +
      //   `Текст: <b>'${message.payload.message}'</b>\n` +
      //   `Телефон (ну вдруг кто-то обмануть хочет): ${message.payload.phoneNumber}\n` +
      //   `Получено (дата, время): ${message.payload.receivedAt}`,
      //   {
      //     parse_mode: 'HTML'
      //   }
      // )
    });
  })
  .listen(12345)

  while (true) {
    await Bun.sleep(1000)
    buildMessagesToOneAndSendIfLarge()
  }