// // src/components/devices/SpeakerControl.jsx

// import { Volume2, VolumeX, Plus, Minus, RotateCcw } from 'lucide-react';
// import { useAnalogJoin, useDigitalJoin } from '../../hooks/useJoin';
// import { ANALOG_JOINS, DIGITAL_JOINS } from '../../crestron/joins';
// import Card, { CardHeader, CardTitle } from '../ui/Card';
// import Button from '../ui/Button';

// const SpeakerControl = () => {
//   // Digital join for speaker on/off
//   const [speakerOn, toggleSpeaker] = useDigitalJoin(DIGITAL_JOINS.SPEAKER_POWER || 999);

//   // Analog join for volume control (0-100 percentage)
//   const [volume, setVolume] = useAnalogJoin(ANALOG_JOINS.SPEAKER_VOLUME, 50); // 50% default

//   // Default volume value (65%)
//   const DEFAULT_VOLUME_PERCENT = 65;

//   // Volume is already 0-100 from hook
//   const volumePercent = volume;

//   const handleVolumeChange = (change) => {
//     const newPercent = Math.max(0, Math.min(100, volumePercent + change));
//     setVolume(newPercent); // Direct percentage
//   };

//   const handleResetToDefault = () => {
//     setVolume(DEFAULT_VOLUME_PERCENT);
//   };

//   const getVolumeColorData = () => {
//     if (!speakerOn) return { textColorClass: 'text-gray-400', strokeColor: '#9ca3af' };
//     if (volumePercent === 0) return { textColorClass: 'text-gray-500', strokeColor: '#9ca3af' };
//     if (volumePercent < 70) return { textColorClass: 'text-green-500', strokeColor: '#10b981' };
//     if (volumePercent < 90) return { textColorClass: 'text-orange-500', strokeColor: '#f97316' };
//     return { textColorClass: 'text-red-500', strokeColor: '#ef4444' };
//   };

//   const { textColorClass, strokeColor } = getVolumeColorData();

//   const getVolumeIcon = (size = 20) => {
//     const colorClass = (!speakerOn || volumePercent === 0) ? 'text-gray-400' : textColorClass;
//     if (!speakerOn || volumePercent === 0) return <VolumeX size={size} className={colorClass} />;
//     return <Volume2 size={size} className={colorClass} />;
//   };

//   const radius = 45; 
//   const circumference = 2 * Math.PI * radius;
//   const strokeDasharrayValue = speakerOn ? (volumePercent / 100) * circumference : 0;

//   return (
//     <Card variant="device" className="flex flex-col items-center cursor-pointer relative" onClick={toggleSpeaker}>
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2">
//           {getVolumeIcon(20)}
//           <span>Speaker Control</span>
//         </CardTitle>
//       </CardHeader>
      
//       <div className="flex flex-col items-center space-y-4 w-full pt-3 pb-0">
        
//         {/* Circular Volume Display */}
//         <div className="relative w-36 h-36 flex items-center justify-center">
//           <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
//             <circle cx="50" cy="50" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
//             <circle
//               cx="50" cy="50" r={radius}
//               stroke={strokeColor} strokeWidth="8" strokeLinecap="round"
//               fill="none" strokeDasharray={`${strokeDasharrayValue} ${circumference}`}
//               style={{ transition: 'stroke-dasharray 0.3s' }}
//             />
//           </svg>
//           <div className="flex flex-col items-center justify-center h-full w-full">
//             {getVolumeIcon(40)}
//             <div className={`text-3xl font-light ${textColorClass}`} style={{ minWidth: '3.5ch', textAlign: 'center' }}>
//               {speakerOn ? `${volumePercent}%` : 'OFF'}
//             </div>
//           </div>
//         </div>

//         {/* Volume Controls - ALL BUTTON COMPONENTS */}
//         <div className="flex flex-col items-center space-y-3 w-full max-w-xs pb-0">
          
//           {/* Volume Up/Down Buttons - NEW Button Components */}
//           <div className="flex items-center space-x-4 w-full justify-center">
            
//             {/* Volume Down */}
//             <Button
//               variant="icon"
//               size="sm"
//               onClick={(e) => {
//                 e.stopPropagation();  // ✅ STOP CARD TOGGLE
//                 handleVolumeChange(-5);
//               }}
//               disabled={volumePercent <= 0 || !speakerOn}
//               className="flex-shrink-0"
//             >
//               <Minus size={20} />
//             </Button>
            
//             {/* Volume Label */}
//             <span className="text-lg font-semibold text-gray-700 flex-shrink-0">Volume</span>
            
//             {/* Volume Up */}
//             <Button
//               variant="icon"
//               size="sm"
//               onClick={(e) => {
//                 e.stopPropagation();  // ✅ STOP CARD TOGGLE
//                 handleVolumeChange(5);
//               }}
//               disabled={volumePercent >= 100 || !speakerOn}
//               className="flex-shrink-0"
//             >
//               <Plus size={20} />
//             </Button>
            
//           </div>

//             {/* Reset Button - Added pt-2 */}
//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={(e) => {
//                 e.stopPropagation();  // ✅ STOP CARD TOGGLE
//                 handleResetToDefault();
//               }}
//               disabled={!speakerOn}
//               className="w-full pt-2"  // ✅ Added pt-2 padding-top
//             >
//               <RotateCcw size={20} />
//               <span>Reset to Default</span>
//             </Button>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default SpeakerControl;
