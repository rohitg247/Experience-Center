// src/components/settings/DefaultValues.jsx
import { Settings } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Slider from '../ui/Slider';

const DefaultValues = ({ defaultValues, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings size={20} />
          <span>Default Values</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <Slider
            value={defaultValues.volume}
            onChange={(value) => onChange('volume', value)}
            min={0}
            max={100}
            step={5}
            label="Default volume level (%)"
            showValue={true}
          />
        </div>
        
        <div>
          <Slider
            value={defaultValues.temperature}
            onChange={(value) => onChange('temperature', value)}
            min={60}
            max={80}
            step={1}
            label="Default temperature (°F)"
            showValue={true}
          />
        </div>
        
        <div>
          <Slider
            value={defaultValues.brightness}
            onChange={(value) => onChange('brightness', value)}
            min={10}
            max={100}
            step={5}
            label="Default brightness (%)"
            showValue={true}
          />
        </div>

        <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
          <p>These values will be applied when devices are reset to defaults</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultValues;