import { cn } from "@/lib/utils";
import type { QRDataType } from "@/lib/qr-utils";
import { Link, Type, Contact, Wifi, Layers } from "lucide-react";

interface TabNavProps {
  activeTab: QRDataType | "batch";
  onTabChange: (tab: QRDataType | "batch") => void;
}

const tabs: {
  id: QRDataType | "batch";
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "url", label: "URL", icon: Link },
  { id: "text", label: "文本", icon: Type },
  { id: "vcard", label: "联系人", icon: Contact },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "batch", label: "批量生成", icon: Layers },
];

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="flex gap-1 p-1 rounded-xl bg-secondary/60 border overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
