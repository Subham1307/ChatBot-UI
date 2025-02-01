import { useRecoilValue } from "recoil"
import { uinState } from "../recoil/atoms"

export default function UinDisplay() {
  const uin = useRecoilValue(uinState)

  if (!uin) return null

  return <p className="text-sm text-muted-foreground">UIN: {uin}</p>
}

