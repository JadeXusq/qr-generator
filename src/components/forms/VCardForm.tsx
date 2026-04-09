import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { VCardData } from '@/lib/qr-utils';

interface VCardFormProps {
  value: VCardData;
  onChange: (val: VCardData) => void;
}

export function VCardForm({ value, onChange }: VCardFormProps) {
  const update = (field: keyof VCardData, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">名</Label>
          <Input
            id="firstName"
            placeholder="小明"
            value={value.firstName}
            onChange={(e) => update('firstName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">姓</Label>
          <Input
            id="lastName"
            placeholder="张"
            value={value.lastName}
            onChange={(e) => update('lastName', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">电话</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+86 138 0000 0000"
            value={value.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            placeholder="hello@example.com"
            value={value.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="organization">公司</Label>
          <Input
            id="organization"
            placeholder="公司名称"
            value={value.organization}
            onChange={(e) => update('organization', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">职位</Label>
          <Input
            id="title"
            placeholder="产品经理"
            value={value.title}
            onChange={(e) => update('title', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="vcardUrl">网站</Label>
        <Input
          id="vcardUrl"
          type="url"
          placeholder="https://example.com"
          value={value.url}
          onChange={(e) => update('url', e.target.value)}
        />
      </div>
    </div>
  );
}
