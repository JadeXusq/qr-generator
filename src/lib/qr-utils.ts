import QRCodeStyling, {
  type Options,
  type DotType,
  type CornerSquareType,
  type CornerDotType,
} from "qr-code-styling"

export type QRDataType = "url" | "text" | "vcard" | "wifi"

export type QRDotStyle = DotType
export type QRCornerSquareStyle = CornerSquareType
export type QRCornerDotStyle = CornerDotType

export interface QRStyleOptions {
  fgColor: string
  bgColor: string
  dotStyle: QRDotStyle
  cornerSquareStyle: QRCornerSquareStyle
  cornerDotStyle: QRCornerDotStyle
  logoUrl: string | null
  logoSize: number
  size: number
}

export interface VCardData {
  firstName: string
  lastName: string
  phone: string
  email: string
  organization: string
  title: string
  url: string
}

export interface WiFiData {
  ssid: string
  password: string
  encryption: "WPA" | "WEP" | "nopass"
  hidden: boolean
}

export function formatVCard(data: VCardData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.lastName};${data.firstName}`,
    `FN:${data.firstName} ${data.lastName}`,
  ]
  if (data.organization) lines.push(`ORG:${data.organization}`)
  if (data.title) lines.push(`TITLE:${data.title}`)
  if (data.phone) lines.push(`TEL:${data.phone}`)
  if (data.email) lines.push(`EMAIL:${data.email}`)
  if (data.url) lines.push(`URL:${data.url}`)
  lines.push("END:VCARD")
  return lines.join("\n")
}

export function formatWiFi(data: WiFiData): string {
  const hidden = data.hidden ? "H:true" : ""
  return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};${hidden};`
}

export function createQRCode(data: string, style: QRStyleOptions): QRCodeStyling {
  const options: Options = {
    width: style.size,
    height: style.size,
    data,
    margin: 12,
    type: "svg",
    dotsOptions: {
      color: style.fgColor,
      type: style.dotStyle,
    },
    backgroundOptions: {
      color: style.bgColor,
    },
    cornersSquareOptions: {
      color: style.fgColor,
      type: style.cornerSquareStyle,
    },
    cornersDotOptions: {
      color: style.fgColor,
      type: style.cornerDotStyle,
    },
    qrOptions: {
      errorCorrectionLevel: style.logoUrl ? "H" : "M",
    },
  }

  if (style.logoUrl) {
    options.image = style.logoUrl
    options.imageOptions = {
      crossOrigin: "anonymous",
      margin: 6,
      imageSize: style.logoSize,
      hideBackgroundDots: true,
    }
  }

  return new QRCodeStyling(options)
}

export const defaultStyle: QRStyleOptions = {
  fgColor: "#6C3AED",
  bgColor: "#FFFFFF",
  dotStyle: "rounded",
  cornerSquareStyle: "extra-rounded",
  cornerDotStyle: "dot",
  logoUrl: null,
  logoSize: 0.4,
  size: 300,
}

export const dotStyleOptions: { value: QRDotStyle; label: string }[] = [
  { value: "rounded", label: "圆角" },
  { value: "dots", label: "圆点" },
  { value: "classy", label: "经典" },
  { value: "classy-rounded", label: "经典圆角" },
  { value: "square", label: "方形" },
  { value: "extra-rounded", label: "超圆角" },
]

export const cornerSquareOptions: { value: QRCornerSquareStyle; label: string }[] = [
  { value: "extra-rounded", label: "超圆角" },
  { value: "dot", label: "圆点" },
  { value: "square", label: "方形" },
]

export const cornerDotOptions: { value: QRCornerDotStyle; label: string }[] = [
  { value: "dot", label: "圆点" },
  { value: "square", label: "方形" },
]

export const exportSizes = [
  { value: 256, label: "256 x 256" },
  { value: 512, label: "512 x 512" },
  { value: 1024, label: "1024 x 1024" },
  { value: 2048, label: "2048 x 2048" },
]

export const presetColors = [
  { fg: "#6C3AED", bg: "#FFFFFF", name: "靛蓝" },
  { fg: "#0EA5E9", bg: "#FFFFFF", name: "天蓝" },
  { fg: "#10B981", bg: "#FFFFFF", name: "翠绿" },
  { fg: "#F59E0B", bg: "#FFFFFF", name: "琥珀" },
  { fg: "#EF4444", bg: "#FFFFFF", name: "赤红" },
  { fg: "#EC4899", bg: "#FFFFFF", name: "粉红" },
  { fg: "#1E1B4B", bg: "#FFFFFF", name: "深夜" },
  { fg: "#FFFFFF", bg: "#1E1B4B", name: "反转" },
]
