import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createQRCode, defaultStyle, type QRStyleOptions } from "@/lib/qr-utils"
import { Upload, Download, FileSpreadsheet, X, Package } from "lucide-react"
import Papa from "papaparse"
import JSZip from "jszip"

interface BatchItem {
  id: string
  data: string
  label: string
}

export function BatchGenerator() {
  const [items, setItems] = useState<BatchItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCSVUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: BatchItem[] = []
        for (const row of results.data as Record<string, string>[]) {
          const data = row["data"] || row["url"] || row["text"] || row["content"] || Object.values(row)[0]
          const label = row["label"] || row["name"] || row["title"] || data
          if (data) {
            parsed.push({
              id: crypto.randomUUID(),
              data: String(data).trim(),
              label: String(label).trim(),
            })
          }
        }
        setItems(parsed)
      },
    })

    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const downloadAll = async () => {
    if (items.length === 0) return
    setIsGenerating(true)
    setProgress(0)

    const zip = new JSZip()
    const style: QRStyleOptions = { ...defaultStyle, size: 1024 }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const qr = createQRCode(item.data, style)
      const blob = await qr.getRawData("png")
      if (blob) {
        const safeName = item.label.replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, "_")
        zip.file(`${safeName}.png`, blob)
      }
      setProgress(Math.round(((i + 1) / items.length) * 100))
    }

    const content = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(content)
    const a = document.createElement("a")
    a.href = url
    a.download = "qrcodes-batch.zip"
    a.click()
    URL.revokeObjectURL(url)
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            导入 CSV 文件
          </CardTitle>
          <CardDescription>
            CSV 文件需包含 data/url/text 列作为二维码数据，可选 label/name 列作为文件名
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/50 transition-smooth text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-6 w-6" />
            <div className="text-center">
              <p className="text-sm font-medium">点击选择 CSV 文件</p>
              <p className="text-xs mt-1">支持 .csv 格式</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-5 w-5 text-primary" />
                待生成列表 ({items.length})
              </CardTitle>
              <Button
                variant="gradient"
                size="sm"
                onClick={downloadAll}
                disabled={isGenerating}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? `生成中 ${progress}%` : "全部下载 (ZIP)"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isGenerating && (
              <div className="mb-4 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.data}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">导入 CSV 文件即可批量生成二维码</p>
          <p className="text-xs mt-2">
            示例 CSV 格式：data,label 或 url,name
          </p>
        </div>
      )}
    </div>
  )
}
