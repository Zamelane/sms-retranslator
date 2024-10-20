import TelegramBot from "node-telegram-bot-api"
import { criticalMinimum, currentMessages, tokenTG, totalMessages } from "./utils"
import { sendMessage } from "./sms-sender/client"
import { addMessageToSend } from "./controller"

const bot = new TelegramBot(tokenTG, { polling: true })

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const message = msg.text ?? ""

  if (message.indexOf("@EugeniyBySMS_bot") > -1)
    bot.sendMessage(chatId,
      `Id этого чата: <code>${chatId}</code>\n` +
      `Total sms/Curr/Crit.Min=<code>${totalMessages}/${currentMessages}/${criticalMinimum}</code>`, {
      parse_mode: 'HTML'
    })
  else if (message.indexOf("pls send test message") > -1) {
    const result = await sendMessage('Тест получения сообщения, не пугаемся')
    bot.sendMessage(chatId, result == null ? "Ошибка отправки" : JSON.stringify(result))
  } else {
    //console.log(msg)
    const mess = msg.text ?? ""

    if (
      mess.length < 250 
      && mess.indexOf('<') == -1
      && mess.indexOf('>') == -1
      && mess.indexOf('{') == -1
      && mess.indexOf('}') == -1
    )
    addMessageToSend(msg.from?.username ?? "", msg.text ?? "")
  }
})

export { bot }