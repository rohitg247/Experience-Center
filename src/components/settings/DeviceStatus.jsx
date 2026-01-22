// src/components/settings/DeviceStatus.jsx
import { useState, useEffect } from 'react';
import { Monitor, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

const DeviceStatus = () => {
  // Mock data - will be replaced with serial joins data from backend
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Boardroom Display',
      ipAddress: '192.168.1.101',
      status: 'online',
    },
    {
      id: 2,
      name: 'Training Display',
      ipAddress: '192.168.1.102',
      status: 'online',
    },
    {
      id: 3,
      name: 'Audio Processor',
      ipAddress: '192.168.1.103',
      status: 'online',
    },
    {
      id: 4,
      name: 'Lighting Controller',
      ipAddress: '192.168.1.104',
      status: 'online',
    },
    {
      id: 5,
      name: 'Climate Control',
      ipAddress: '192.168.1.105',
      status: 'online',
    },
    {
      id: 6,
      name: 'Microphone System',
      ipAddress: '192.168.1.106',
      status: 'online',
    },
    {
      id: 7,
      name: 'Drapes Controller',
      ipAddress: '192.168.1.107',
      status: 'offline',
    },
    {
      id: 8,
      name: 'Camera System',
      ipAddress: '192.168.1.108',
      status: 'online',
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to fetch device status from backend
  const refreshDeviceStatus = async () => {
    setIsRefreshing(true);
    // TODO: Replace with actual API call to get device status
    // const response = await fetch('/api/devices/status');
    // const data = await response.json();
    // setDevices(data);
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Monitor size={20} />
            <span>Device Status</span>
          </CardTitle>
          <button
            onClick={refreshDeviceStatus}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            disabled={isRefreshing}
          >
            <RefreshCw size={18} className="text-primary" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle size={18} className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Online: <span className="text-green-600">{onlineDevices}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle size={18} className="text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Offline: <span className="text-red-600">{offlineDevices}</span>
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            Total: {devices.length} devices
          </span>
        </div>

        {/* Device List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`p-3 rounded-lg border transition-colors ${
                device.status === 'online'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {device.status === 'online' ? (
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-medium text-sm text-gray-800">
                      {device.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      IP: {device.ipAddress}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xs font-medium ${
                      device.status === 'online' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {device.status === 'online' ? 'Online' : 'Offline'}
                  </div>
                  {/* <div className="text-xs text-gray-500">{device.lastSeen}</div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatus;