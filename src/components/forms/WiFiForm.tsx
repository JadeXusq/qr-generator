import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { WiFiData } from '@/lib/qr-utils';

interface WiFiFormProps {
  value: WiFiData;
  onChange: (val: WiFiData) => void;
}

const encryptionOptions = [
  { value: 'WPA', label: 'WPA/WPA2' },
  { value: 'WEP', label: 'WEP' },
  { value: 'nopass', label: '无密码' }
];

export function WiFiForm({ value, onChange }: WiFiFormProps) {
  const update = (field: keyof WiFiData, val: string | boolean) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="ssid">WiFi 名称 (SSID)</Label>
        <Input
          id="ssid"
          placeholder="MyWiFi"
          value={value.ssid}
          onChange={(e) => update('ssid', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="encryption">加密方式</Label>
          <Select
            id="encryption"
            value={value.encryption}
            onChange={(e) => update('encryption', e.target.value)}
            options={encryptionOptions}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            placeholder="WiFi密码"
            value={value.password}
            onChange={(e) => update('password', e.target.value)}
            disabled={value.encryption === 'nopass'}
          />
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={value.hidden}
          onChange={(e) => update('hidden', e.target.checked)}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        <span className="text-sm text-foreground">隐藏网络</span>
      </label>
    </div>
  );
}
