import { useCallback, useEffect, useRef, useState } from "react";
import {
  createQRCode,
  type QRStyleOptions,
  defaultStyle,
} from "@/lib/qr-utils";
import type QRCodeStyling from "qr-code-styling";

export function useQRCode(data: string) {
  const [style, setStyle] = useState<QRStyleOptions>({ ...defaultStyle });
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevDataRef = useRef<string>("");

  useEffect(() => {
    if (!data) {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      setQrCode(null);
      return;
    }

    const qr = createQRCode(data, style);
    setQrCode(qr);

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      qr.append(containerRef.current);
    }

    prevDataRef.current = data;
  }, [data, style]);

  const updateStyle = useCallback((updates: Partial<QRStyleOptions>) => {
    setStyle((prev) => ({ ...prev, ...updates }));
  }, []);

  const downloadPNG = useCallback(
    async (size: number) => {
      if (!data) return;
      const exportQR = createQRCode(data, { ...style, size });
      await exportQR.download({
        name: "qrcode",
        extension: "png",
      });
    },
    [data, style]
  );

  const downloadSVG = useCallback(async () => {
    if (!data) return;
    const exportQR = createQRCode(data, { ...style, size: 1024 });
    await exportQR.download({
      name: "qrcode",
      extension: "svg",
    });
  }, [data, style]);

  const getBlob = useCallback(
    async (
      size: number,
      format: "png" | "svg" = "png"
    ): Promise<Blob | null> => {
      if (!data) return null;
      const exportQR = createQRCode(data, { ...style, size });
      if (format === "svg") {
        const svgData = await exportQR.getRawData("svg");
        if (!svgData) return null;
        if (typeof svgData === "string") {
          return new Blob([svgData], { type: "image/svg+xml" });
        }
        if (svgData instanceof Blob) {
          return svgData;
        }
        // Handle Buffer
        const svgStr = new TextDecoder().decode(
          svgData as unknown as ArrayBuffer
        );
        return new Blob([svgStr], { type: "image/svg+xml" });
      }
      const pngData = await exportQR.getRawData("png");
      if (!pngData) return null;
      if (pngData instanceof Blob) {
        return pngData;
      }
      // Handle Buffer (Node.js) - convert to Uint8Array for Blob compatibility
      const uint8Array = new Uint8Array(pngData as unknown as ArrayBuffer);
      return new Blob([uint8Array], { type: "image/png" });
    },
    [data, style]
  );

  return {
    style,
    setStyle,
    updateStyle,
    containerRef,
    qrCode,
    downloadPNG,
    downloadSVG,
    getBlob,
  };
}
