import { useState, useMemo } from "react"
import { Header } from "@/components/layout/Header"
import { TabNav } from "@/components/layout/TabNav"
import { URLForm } from "@/components/forms/URLForm"
import { TextForm } from "@/components/forms/TextForm"
import { VCardForm } from "@/components/forms/VCardForm"
import { WiFiForm } from "@/components/forms/WiFiForm"
import { StyleCustomizer } from "@/components/StyleCustomizer"
import { QRPreview } from "@/components/QRPreview"
import { ExportPanel } from "@/components/ExportPanel"
import { BatchGenerator } from "@/components/BatchGenerator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQRCode } from "@/hooks/useQRCode"
import {
  type QRDataType,
  type VCardData,
  type WiFiData,
  formatVCard,
  formatWiFi,
} from "@/lib/qr-utils"
import { Settings2, Eye } from "lucide-react"
import { Toaster } from "sonner"

function App() {
  const [activeTab, setActiveTab] = useState<QRDataType | "batch">("url")

  // Form states
  const [urlData, setUrlData] = useState("")
  const [textData, setTextData] = useState("")
  const [vcardData, setVcardData] = useState<VCardData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    organization: "",
    title: "",
    url: "",
  })
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  })

  // Compute QR data string
  const qrDataString = useMemo(() => {
    switch (activeTab) {
      case "url":
        return urlData
      case "text":
        return textData
      case "vcard":
        return vcardData.firstName || vcardData.lastName
          ? formatVCard(vcardData)
          : ""
      case "wifi":
        return wifiData.ssid ? formatWiFi(wifiData) : ""
      default:
        return ""
    }
  }, [activeTab, urlData, textData, vcardData, wifiData])

  const { style, updateStyle, containerRef, downloadPNG, downloadSVG } =
    useQRCode(qrDataString)

  const hasData = qrDataString.length > 0

  return (
    <div className="min-h-screen gradient-surface">
      <Toaster position="top-center" richColors />
      <Header />

      <main className="container py-8 space-y-8">
        {/* Hero section */}
        <section className="text-center space-y-3 py-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            创建精美的
            <span className="text-gradient"> 自定义二维码</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            支持 URL、文本、联系人名片、WiFi 凭证，自定义颜色与 Logo，批量生成并导出高分辨率图片
          </p>
        </section>

        {/* Tab navigation */}
        <div className="flex justify-center">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === "batch" ? (
          <BatchGenerator />
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left: Input + Style */}
            <div className="lg:col-span-5 space-y-6">
              {/* Data Input Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">数据输入</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTab === "url" && (
                    <URLForm value={urlData} onChange={setUrlData} />
                  )}
                  {activeTab === "text" && (
                    <TextForm value={textData} onChange={setTextData} />
                  )}
                  {activeTab === "vcard" && (
                    <VCardForm value={vcardData} onChange={setVcardData} />
                  )}
                  {activeTab === "wifi" && (
                    <WiFiForm value={wifiData} onChange={setWifiData} />
                  )}
                </CardContent>
              </Card>

              {/* Style Customizer Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Settings2 className="h-4 w-4 text-primary" />
                    外观定制
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StyleCustomizer style={style} onStyleChange={updateStyle} />
                </CardContent>
              </Card>
            </div>

            {/* Right: Preview + Export */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="lg:sticky lg:top-24">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="h-4 w-4 text-primary" />
                    实时预览
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <QRPreview
                    containerRef={containerRef as React.RefObject<HTMLDivElement>}
                    hasData={hasData}
                  />
                  <div className="border-t pt-6">
                    <ExportPanel
                      hasData={hasData}
                      onDownloadPNG={downloadPNG}
                      onDownloadSVG={downloadSVG}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            QR Studio &mdash; 所有二维码均在本地生成，数据不会上传到任何服务器
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
