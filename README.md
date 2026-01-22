# Crestron Conference Control System

A modern, offline-first React frontend for Crestron HTML5 control systems, designed for managing AV, environmental, and conferencing controls across multiple rooms.

## Features

- **Multi-Room Control**: Boardroom, Training Room, and Combined Room configurations
- **Comprehensive Device Control**: AC, lighting, drapes, speakers, microphones, displays
- **Crestron Integration**: Full WebXPanel integration with digital, analog, and serial joins
- **Offline-First Architecture**: All assets stored locally, no external dependencies
- **Touch-Optimized Design**: Responsive design for touch panels, tablets, and browsers
- **No-Scroll Layout**: All content fits within viewport for optimal panel experience
- **Modern UI**: Clean, elegant design with consistent theming

## Technology Stack

- **Frontend**: React.js (JSX only, no TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theme configuration
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Crestron**: @crestron/ch5-webxpanel integration

## Project Structure

```
src/
├── components/
│   ├── devices/          # Device control components
│   ├── layout/           # Navigation and layout components
│   └── ui/              # Reusable UI components
├── pages/               # Room pages and main views
├── hooks/               # Custom React hooks for Crestron joins
├── crestron/            # Crestron WebXPanel integration
├── styles/              # Theme configuration and global styles
└── assets/              # Local fonts, images, and other assets
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Crestron Integration

The system uses custom hooks for seamless Crestron integration:

### Digital Joins
- `useDigitalJoin(joinNumber)` - For boolean controls (on/off, toggle states)

### Analog Joins  
- `useAnalogJoin(joinNumber)` - For numeric values (volume, temperature, brightness)

### Serial Joins
- `useSerialJoin(joinNumber)` - For text-based data (status messages, labels)

### Example Usage

```jsx
import { useDigitalJoin, useAnalogJoin } from '../hooks/useJoin';

function MicrophoneControl() {
  const [micActive, toggleMic] = useDigitalJoin(5);
  const [volume, setVolume] = useAnalogJoin(10, 50); // Default 50%
  
  return (
    <button onClick={toggleMic}>
      {micActive ? 'Turn Off' : 'Turn On'} Mic
    </button>
  );
}
```

## Join Number Mapping

All join numbers are centrally managed in `src/crestron/joins.js`:

- **Digital Joins**: System controls, room selection, device power states
- **Analog Joins**: Volume levels, temperature settings, brightness controls  
- **Serial Joins**: Status displays, error messages, feedback text

## Room Configuration

### Boardroom
- Executive conference setup
- 12-person capacity
- Premium AV equipment

### Training Room  
- Interactive learning environment
- 20-person capacity
- Educational technology integration

### Combined Room
- Unified control of both spaces
- 32-person total capacity
- Large meeting and presentation capabilities

## Device Controls

### Climate Control
- Individual AC control per room
- Temperature sliders (60-80°F)
- Power state monitoring

### Audio System
- Master volume control with visual feedback
- Color-coded volume levels (Green/Yellow/Red)
- Individual microphone toggles per room

### Lighting Control
- Preset lighting scenes (Welcome, Presentation, Video Conference, Meeting)
- Manual brightness adjustment
- All lights off functionality

### Display Management
- Room display power control
- Source selection (Wireless, BYOD, Zoom, Blank)
- Status monitoring

### Drapes Control
- Individual section control (Left, Center, Right)
- Master control for all sections
- Position presets and manual adjustment

## Design System

### Color Palette
- **Primary**: #191e4f (Navy blue for text and primary elements)
- **Danger**: #f21212 (Red for critical actions and alerts)
- **Success**: #10b981 (Green for positive states)
- **Warning**: #f59e0b (Yellow for warnings)

### Typography
- Font: Inter (loaded locally for offline use)
- Weights: 400, 500, 600, 700

### Spacing
- 8px grid system for consistent spacing
- Touch-friendly button sizes (minimum 44px)

## Offline Capability

- All assets stored locally in `/src/assets/`
- No external CDN dependencies
- Service worker ready for enhanced caching
- Local font loading for complete offline operation

## Browser Support

- Modern browsers (Chrome 88+, Firefox 85+, Safari 14+)
- Touch-enabled devices
- Crestron HTML5 panels
- Responsive design for various screen sizes

## Deployment

The application is designed for deployment via Actis to Crestron control systems. Ensure all local assets are properly bundled during the build process.

## Contributing

1. Follow the established project structure
2. Use the centralized theme configuration
3. Maintain offline-first architecture
4. Test on target Crestron hardware
5. Follow JSX-only development (no TypeScript)

## License

Proprietary - For use with Crestron control systems only.