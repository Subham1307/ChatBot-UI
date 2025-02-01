import { useState } from "react"
import { useSetRecoilState } from "recoil"
import { uinState } from "../recoil/atoms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const setUin = useSetRecoilState(uinState)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (file) {
      // Simulating API call to Python backend
      // Replace this with your actual API call
      const response = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ filename: file.name }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setUin(data.uin)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="file-upload">Upload Insurance Policy PDF</Label>
      <Input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>
        Upload and Process
      </Button>
    </div>
  )
}

