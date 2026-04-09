import { useCallback, useEffect, useRef, useState } from "react"
import { createQRCode, type QRStyleOptions, defaultStyle } from "@/lib/qr-utils"
import type QRCodeStyling from "qr-code-styling"

export function useQRCode(data: string) {
  const [style, setStyle] = useState<QRStyleOptions>({ ...defaultStyle })
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevDataRef = useRef<string>("")

  useEffect(() => {
    if (!data) {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
      setQrCode(null)
      return
    }

    const qr = createQRCode(data, style)
    setQrCode(qr)

    if (containerRef.current) {
      containerRef.current.innerHTML = ""
      qr.append(containerRef.current)
    }

    prevDataRef.current = data
  }, [data, style])

  const updateStyle = useCallback((updates: Partial<QRStyleOptions>) => {
    setStyle((prev) => ({ ...prev, ...updates }))
  }, [])

  const downloadPNG = useCallback(async (size: number) => {
    if (!data) return
    const exportQR = createQRCode(data, { ...style, size })
    await exportQR.download({
      name: "qrcode",
      extension: "png",
    })
  }, [data, style])

  const downloadSVG = useCallback(async () => {
    if (!data) return
    const exportQR = createQRCode(data, { ...style, size: 1024 })
    await exportQR.download({
      name: "qrcode",
      extension: "svg",
    })
  }, [data, style])

  const getBlob = useCallback(async (size: number, format: "png" | "svg" = "png"): Promise<Blob | null> => {
    if (!data) return null
    const exportQR = createQRCode(data, { ...style, size })
    if (format === "svg") {
      const svgData = await exportQR.getRawData("svg")
      return svgData ? new Blob([svgData], { type: "image/svg+xml" }) : null
    }
    const blob = await exportQR.getRawData("png")
    return blob ?? null
  }, [data, style])

  return {
    style,
    setStyle,
    updateStyle,
    containerRef,
    qrCode,
    downloadPNG,
    downloadSVG,
    getBlob,
  }
}
