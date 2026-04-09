import { cn } from "@/lib/utils";
import { QrCode } from "lucide-react";

interface QRPreviewProps {
  containerRef: React.RefObject<HTMLDivElement>;
  hasData: boolean;
}

export function QRPreview({ containerRef, hasData }: QRPreviewProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl border-2 p-4 transition-smooth overflow-hidden min-w-[240px] sm:min-w-[280px] min-h-[240px] sm:min-h-[280px]",
          hasData
            ? "border-primary/20 shadow-elegant animate-scale-in"
            : "border-dashed border-border"
        )}
      >
        {!hasData && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <QrCode className="h-16 w-16 opacity-20" />
            <p className="text-sm">输入数据以预览二维码</p>
          </div>
        )}
        <div
          ref={containerRef}
          className={cn(
            "flex items-center justify-center [&>svg]:rounded-xl [&>canvas]:rounded-xl",
            !hasData && "hidden"
          )}
        />
      </div>

      {hasData && (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">实时预览</span>
        </div>
      )}
    </div>
  );
}
