import { atom } from "recoil"

export interface PolicyFile {
  name: string
  uin: string
  selected: boolean
}

export const policyFilesState = atom<PolicyFile[]>({
  key: "policyFilesState",
  default: [],
})

export const messagesState = atom<Array<{ role: "user" | "bot"; content: string }>>({
  key: "messagesState",
  default: [],
})

