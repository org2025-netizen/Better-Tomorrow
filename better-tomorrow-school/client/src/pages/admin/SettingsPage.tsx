import { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { settingsApi } from '@/api/settings.api';
import toast from 'react-hot-toast';

const defaultConfig = {
  school_name: 'Better Tomorrow School',
  school_short_name: 'BTS',
  school_tagline: 'Incubating Learners for a Better Tomorrow',
  school_location: 'Donholm, Nairobi, Kenya',
  school_landmark: 'Behind Quickmart Supermarket',
  school_phone: '',
  school_whatsapp: '',
  school_email: '',
  school_website: '',
  school_facebook: '',
  school_instagram: '',
  school_tiktok: '',
  school_youtube: '',
};

export default function SettingsPage() {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsApi.getAll()
      .then((settings) => {
        setConfig((prev) => ({ ...prev, ...settings }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settings = Object.entries(config).map(([key, value]) => ({ key, value }));
      await settingsApi.bulkUpdate(settings);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">School Settings</h1>
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">School Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="School Name" value={config.school_name} onChange={(e) => setConfig({ ...config, school_name: e.target.value })} />
            <Input label="Short Name" value={config.school_short_name} onChange={(e) => setConfig({ ...config, school_short_name: e.target.value })} />
            <Input label="Tagline" value={config.school_tagline} onChange={(e) => setConfig({ ...config, school_tagline: e.target.value })} />
            <Input label="Location" value={config.school_location} onChange={(e) => setConfig({ ...config, school_location: e.target.value })} />
            <Input label="Landmark" value={config.school_landmark} onChange={(e) => setConfig({ ...config, school_landmark: e.target.value })} />
            <Input label="Phone" value={config.school_phone} onChange={(e) => setConfig({ ...config, school_phone: e.target.value })} />
            <Input label="WhatsApp" value={config.school_whatsapp} onChange={(e) => setConfig({ ...config, school_whatsapp: e.target.value })} />
            <Input label="Email" value={config.school_email} onChange={(e) => setConfig({ ...config, school_email: e.target.value })} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 pt-4">Social Media</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Facebook" value={config.school_facebook} onChange={(e) => setConfig({ ...config, school_facebook: e.target.value })} />
            <Input label="Instagram" value={config.school_instagram} onChange={(e) => setConfig({ ...config, school_instagram: e.target.value })} />
            <Input label="TikTok" value={config.school_tiktok} onChange={(e) => setConfig({ ...config, school_tiktok: e.target.value })} />
            <Input label="YouTube" value={config.school_youtube} onChange={(e) => setConfig({ ...config, school_youtube: e.target.value })} />
          </div>
          <div className="pt-4"><Button onClick={handleSave} loading={saving}>Save Settings</Button></div>
        </div>
      </Card>
    </div>
  );
}
