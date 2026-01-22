// src/components/devices/DoorLockControl.jsx

import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';

// NOTE: This is a PLACEHOLDER component. Replace 'useDigitalJoin' and 'lockJoins'
// logic with your actual Crestron join hooks when you implement them.

const DoorLockControl = ({ lockJoins = [] }) => {
  const [isLocked, setIsLocked] = useState(true);

  const toggleLock = (index) => {
    // Placeholder logic for toggling the lock state and sending the join command
    setIsLocked(prev => !prev);
    console.log(`Toggling lock for join: ${lockJoins[index]} (Currently ${!isLocked ? 'Locked' : 'Unlocked'})`);
    // In a real scenario, you'd use useDigitalJoin(lockJoins[index])[1]() here
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock size={20} />
          <span>Door Lock Control</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-full flex flex-col justify-between">
        <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-100">
                <span className="font-medium text-sm">Main Door Lock</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${isLocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {isLocked ? 'LOCKED' : 'UNLOCKED'}
                </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-100">
                <span className="font-medium text-sm">Service Door Lock</span>
                <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-600">
                    UNLOCKED
                </span>
            </div>
        </div>
        
        {/* Main Control Button */}
        <div className='mt-auto'>
            <Button
                variant={isLocked ? 'success' : 'danger'}
                onClick={() => toggleLock(0)}
                className="w-full flex items-center justify-center space-x-2 py-3"
            >
                {isLocked ? <Unlock size={20} /> : <Lock size={20} />}
                <span>{isLocked ? 'Unlock All' : 'Lock All'}</span>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoorLockControl;