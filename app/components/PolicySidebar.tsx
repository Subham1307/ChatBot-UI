"use client"

// import { useRecoilState } from "recoil"
// import { policyFilesState } from "../recoil/atoms"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PolicySidebar({ policyFiles, setPolicyFiles }) {
  // const [policyFiles, setPolicyFiles] = useRecoilState(policyFilesState)

  const handleCheckboxChange = (index: number) => {
    setPolicyFiles((prevFiles) =>
      prevFiles.map((file, i) => (i === index ? { ...file, selected: !file.selected } : file)),
    )
  }

  return (
    <div className="w-64 border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Uploaded Policies</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {policyFiles.map((file, index) => (
          <div key={file.uin} className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={`policy-${file.uin}`}
              checked={file.selected}
              onCheckedChange={() => handleCheckboxChange(index)}
            />
            <label
              htmlFor={`policy-${file.uin}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {file.name}
            </label>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

