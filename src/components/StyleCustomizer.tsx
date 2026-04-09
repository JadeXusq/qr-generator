import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  type QRStyleOptions,
  dotStyleOptions,
  cornerSquareOptions,
  cornerDotOptions,
  presetColors,
} from "@/lib/qr-utils"
import { Upload, X, Palette } from "lucide-react"
import { useRef } from "react"

interface StyleCustomizerProps {
  style: QRStyleOptions
  onStyleChange: (updates: Partial<QRStyleOptions>) => void
}

export function StyleCustomizer({ style, onStyleChange }: StyleCustomizerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onStyleChange({ logoUrl: ev.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    onStyleChange({ logoUrl: null })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Preset colors */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <Label>预设配色</Label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onStyleChange({ fgColor: preset.fg, bgColor: preset.bg })}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-smooth",
                style.fgColor === preset.fg && style.bgColor === preset.bg
                  ? "border-primary bg-accent shadow-sm"
                  : "border-transparent hover:border-border hover:bg-secondary/50"
              )}
            >
              <div
                className="h-6 w-6 rounded-lg border shadow-sm"
                style={{ backgroundColor: preset.fg }}
              />
              <span className="text-xs text-muted-foreground">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fgColor">前景色</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              id="fgColor"
              value={style.fgColor}
              onChange={(e) => onStyleChange({ fgColor: e.target.value })}
              className="h-10 w-12 rounded-lg border border-input cursor-pointer bg-transparent p-1"
            />
            <Input
              value={style.fgColor}
              onChange={(e) => onStyleChange({ fgColor: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bgColor">背景色</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              id="bgColor"
              value={style.bgColor}
              onChange={(e) => onStyleChange({ bgColor: e.target.value })}
              className="h-10 w-12 rounded-lg border border-input cursor-pointer bg-transparent p-1"
            />
            <Input
              value={style.bgColor}
              onChange={(e) => onStyleChange({ bgColor: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Dot style */}
      <div className="space-y-2">
        <Label>码点样式</Label>
        <Select
          value={style.dotStyle}
          onChange={(e) => onStyleChange({ dotStyle: e.target.value as QRStyleOptions["dotStyle"] })}
          options={dotStyleOptions}
        />
      </div>

      {/* Corner styles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>定位角样式</Label>
          <Select
            value={style.cornerSquareStyle}
            onChange={(e) => onStyleChange({ cornerSquareStyle: e.target.value as QRStyleOptions["cornerSquareStyle"] })}
            options={cornerSquareOptions}
          />
        </div>
        <div className="space-y-2">
          <Label>定位点样式</Label>
          <Select
            value={style.cornerDotStyle}
            onChange={(e) => onStyleChange({ cornerDotStyle: e.target.value as QRStyleOptions["cornerDotStyle"] })}
            options={cornerDotOptions}
          />
        </div>
      </div>

      {/* Logo upload */}
      <div className="space-y-3">
        <Label>中心 Logo</Label>
        {style.logoUrl ? (
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-secondary/30">
            <img
              src={style.logoUrl}
              alt="Logo"
              className="h-12 w-12 rounded-lg object-cover border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">已上传 Logo</p>
              <p className="text-xs text-muted-foreground">点击右侧按钮移除</p>
            </div>
            <button
              onClick={removeLogo}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/50 transition-smooth text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-5 w-5" />
            <span className="text-sm">点击上传 Logo 图片</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
        {style.logoUrl && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Logo 大小: {Math.round(style.logoSize * 100)}%
            </Label>
            <input
              type="range"
              min={0.2}
              max={0.5}
              step={0.05}
              value={style.logoSize}
              onChange={(e) => onStyleChange({ logoSize: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
        )}
      </div>
    </div>
  )
}
