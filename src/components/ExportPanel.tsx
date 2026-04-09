import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { exportSizes } from '@/lib/qr-utils';
import { Download, FileImage, FileCode } from 'lucide-react';
import { useState } from 'react';

interface ExportPanelProps {
  hasData: boolean;
  onDownloadPNG: (size: number) => Promise<void>;
  onDownloadSVG: () => Promise<void>;
}

export function ExportPanel({
  hasData,
  onDownloadPNG,
  onDownloadSVG
}: ExportPanelProps) {
  const [exportSize, setExportSize] = useState(512);
  const [isExporting, setIsExporting] = useState(false);

  const handlePNG = async () => {
    setIsExporting(true);
    try {
      await onDownloadPNG(exportSize);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSVG = async () => {
    setIsExporting(true);
    try {
      await onDownloadSVG();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Download className="h-4 w-4" />
        导出设置
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">PNG 导出尺寸</label>
          <Select
            value={String(exportSize)}
            onChange={(e) => setExportSize(Number(e.target.value))}
            options={exportSizes.map((s) => ({
              value: String(s.value),
              label: s.label
            }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="gradient"
            onClick={handlePNG}
            disabled={!hasData || isExporting}
            className="gap-2"
          >
            <FileImage className="h-4 w-4" />
            PNG
          </Button>
          <Button
            variant="outline"
            onClick={handleSVG}
            disabled={!hasData || isExporting}
            className="gap-2"
          >
            <FileCode className="h-4 w-4" />
            SVG
          </Button>
        </div>
      </div>
    </div>
  );
}
