import { atom } from "recoil"

export const uinState = atom<string | null>({
  key: "uinState",
  default: null,
})

export const messagesState = atom<Array<{ role: "user" | "bot"; content: string }>>({
  key: "messagesState",
  default: [],
})

