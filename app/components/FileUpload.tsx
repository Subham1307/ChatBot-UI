import { useState } from "react"
import { useSetRecoilState } from "recoil"
import { uinState } from "../recoil/atoms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setUin = useSetRecoilState(uinState)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null) // Clear previous errors
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:8000/upload-pdf/", {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": "your-api-key-here", // Ensure API key is set correctly
        },
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      setUin(data.uin)
    } catch (err) {
      console.error(err)
      setError("An error occurred while uploading.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="file-upload">Upload Insurance Policy PDF</Label>
      <Input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload and Process"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
