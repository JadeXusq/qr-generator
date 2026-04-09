import { Moon, Sun, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
            <QrCode className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              QR Studio
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5">
              专业二维码生成器
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="rounded-xl"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-foreground" />
          )}
        </Button>
      </div>
    </header>
  );
}
