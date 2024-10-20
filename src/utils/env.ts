import type { IChat } from "../sms-sender"

const login = Bun.env.login ?? ""
const pass = Bun.env.pass ?? ""
const phone = Bun.env.phone ?? ""
const tokenTG = Bun.env.tokenTG ?? ""
const totalMessages = 800
let currentMessages = totalMessages
const criticalMinimum = 10;

(await Bun.file('currMessages.txt').text().then((data) => {
  currentMessages = Number.parseInt(data)
})
  .catch((err) => console.error(err)))

const chats: IChat[] = []

if (!login.length || !pass.length || !phone.length || !tokenTG.length)
  throw "Логин, пароль, токен телеги или телефон не заданы!"

const rawChats = (Bun.env.chats ?? "").split(',')

rawChats.forEach(chat => {
  const params = chat.split(':')

  if (params.length != 3)
    return

  chats.push({
    fullName: params[0],
    command: params[1],
    tgId: Number.parseInt(params[2])
  })
})

export {
  tokenTG,
  login,
  pass,
  phone,
  totalMessages,
  currentMessages,
  criticalMinimum,
  chats
}

export const subCurrMessages = async () => {
  currentMessages--
  await Bun.write("currMessages.txt", "" + currentMessages)
}