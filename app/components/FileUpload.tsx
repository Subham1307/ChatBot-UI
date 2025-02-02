"use client"

import { useState } from "react"
// import { useSetRecoilState } from "recoil"
// import { policyFilesState } from "../recoil/atoms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FileUpload({ setPolicyFiles }: { setPolicyFiles: any }) {
  const [files, setFiles] = useState<FileList | null>(null)
  // const setPolicyFiles = useSetRecoilState(policyFilesState)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files)
    }
  }

  const handleUpload = async () => {
    if (files) {
      const uploadedFiles = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)
        // Simulating API call to Python backend
        // Replace this with your actual API call
        const response = await fetch("http://localhost:8000/upload-pdf/", {
          method: "POST",
          body: formData
        })
        const data = await response.json()
        uploadedFiles.push({ name: file.name, uin: data.uin, selected: true })
      }
      setPolicyFiles(uploadedFiles)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="file-upload">Upload Insurance Policy PDFs</Label>
      <Input id="file-upload" type="file" accept=".pdf" multiple onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!files || files.length === 0}>
        Upload and Process
      </Button>
    </div>
  )
}

