import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextFormProps {
  value: string;
  onChange: (val: string) => void;
}

export function TextForm({ value, onChange }: TextFormProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="text">文本内容</Label>
        <Textarea
          id="text"
          placeholder="输入任意文本内容..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          {value.length} / 2000 字符
        </p>
      </div>
    </div>
  );
}
