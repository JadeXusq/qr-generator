import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';

interface URLFormProps {
  value: string;
  onChange: (val: string) => void;
}

export function URLForm({ value, onChange }: URLFormProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="url">网址链接</Label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          输入完整的网址，包含 https:// 前缀
        </p>
      </div>
    </div>
  );
}
