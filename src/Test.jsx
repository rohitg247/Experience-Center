import { useState } from 'react';
import { Layers, Video, Users, GraduationCap, Menu, X, Thermometer, Mic, Volume2, Monitor, Lightbulb, Blinds, Power, MicOff, VolumeX, Plus, Minus, Wifi, ChevronUp, ChevronDown, Square, Sun, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDigitalJoin, useAnalogJoin } from '../hooks/useJoin';
import { DIGITAL_JOINS, ANALOG_JOINS } from '../crestron/joins';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import Slider from '../components/ui/Slider';

const CombinedRoom = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Climate Control Hooks
  const [boardroomAC, toggleBoardroomAC] = useDigitalJoin(DIGITAL_JOINS.BOARDROOM_AC_POWER);
  const [trainingAC, toggleTrainingAC] = useDigitalJoin(DIGITAL_JOINS.TRAINING_ROOM_AC_POWER);
  const [boardroomTemp, setBoardroomTemp] = useAnalogJoin(ANALOG_JOINS.BOARDROOM_TEMP, 72);
  const [trainingTemp, setTrainingTemp] = useAnalogJoin(ANALOG_JOINS.TRAINING_ROOM_TEMP, 72);

  // Microphone Control Hooks
  const [boardroomMic, toggleBoardroomMic] = useDigitalJoin(DIGITAL_JOINS.BOARDROOM_MIC);
  const [trainingMic, toggleTrainingMic] = useDigitalJoin(DIGITAL_JOINS.TRAINING_ROOM_MIC);
  const [combinedMicControl, toggleCombinedMicControl] = useDigitalJoin(DIGITAL_JOINS.MIC_COMBINED_CONTROL);

  // Speaker Control Hooks
  const [volume, setVolume] = useAnalogJoin(ANALOG_JOINS.SPEAKER_VOLUME, 32768);

  // Lighting Control Hooks
  const [welcomePreset, setWelcome] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_WELCOME);
  const [presentationPreset, setPresentation] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_PRESENTATION);
  const [videoConfPreset, setVideoConf] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_VIDEO_CONF);
  const [meetingPreset, setMeeting] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_MEETING);
  const [allOffPreset, setAllOff] = useDigitalJoin(DIGITAL_JOINS.LIGHTS_ALL_OFF);
  const [brightness, setBrightness] = useAnalogJoin(ANALOG_JOINS.LIGHTS_BRIGHTNESS, 32768);

  // Source Selection Hooks
  const [wirelessActive, toggleWireless] = useDigitalJoin(DIGITAL_JOINS.SOURCE_WIRELESS);
  const [byodActive, toggleBYOD] = useDigitalJoin(DIGITAL_JOINS.SOURCE_BYOD);
  const [zoomActive, toggleZoom] = useDigitalJoin(DIGITAL_JOINS.SOURCE_ZOOM);
  const [blankActive, toggleBlank] = useDigitalJoin(DIGITAL_JOINS.SOURCE_BLANK);

  // Drapes Control Hooks
  const [drapesUp, triggerUp] = useDigitalJoin(DIGITAL_JOINS.DRAPES_UP);
  const [drapesDown, triggerDown] = useDigitalJoin(DIGITAL_JOINS.DRAPES_DOWN);
  const [drapesStop, triggerStop] = useDigitalJoin(DIGITAL_JOINS.DRAPES_STOP);
  const [allPosition, setAllPosition] = useAnalogJoin(ANALOG_JOINS.DRAPES_ALL, 0);
  const [leftPosition, setLeftPosition] = useAnalogJoin(ANALOG_JOINS.DRAPES_LEFT, 0);
  const [centerPosition, setCenterPosition] = useAnalogJoin(ANALOG_JOINS.DRAPES_CENTER, 0);
  const [rightPosition, setRightPosition] = useAnalogJoin(ANALOG_JOINS.DRAPES_RIGHT, 0);

  const handleZoomMeeting = () => {
    navigate('/zoom-meeting');
  };

  const handleResetDefaults = () => {
    console.log('Resetting combined room to defaults...');
  };

  // Helper functions
  const convertTempToF = (analogVal) => Math.round(60 + (analogVal / 65535) * 20);
  const convertTempToAnalog = (tempF) => ((tempF - 60) / 20) * 65535;
  const convertVolumePercent = (analogVal) => Math.round((analogVal / 65535) * 100);
  const convertBrightnessPercent = (analogVal) => Math.round((analogVal / 65535) * 100);
  const convertDrapesPercent = (analogVal) => Math.round((analogVal / 65535) * 100);

  const handleVolumeChange = (change) => {
    const currentPercent = convertVolumePercent(volume);
    const newPercent = Math.max(0, Math.min(100, currentPercent + change));
    const newAnalogValue = (newPercent / 100) * 65535;
    setVolume(newAnalogValue);
  };

  const handleCombinedMicToggle = () => {
    toggleCombinedMicControl();
    const newState = !combinedMicControl;
    if (newState !== boardroomMic) toggleBoardroomMic();
    if (newState !== trainingMic) toggleTrainingMic();
  };

  const handleDrapesPositionChange = (section, percent) => {
    const analogValue = (percent / 100) * 65535;
    switch (section) {
      case 'all':
        setAllPosition(analogValue);
        setLeftPosition(analogValue);
        setCenterPosition(analogValue);
        setRightPosition(analogValue);
        break;
      case 'left':
        setLeftPosition(analogValue);
        break;
      case 'center':
        setCenterPosition(analogValue);
        break;
      case 'right':
        setRightPosition(analogValue);
        break;
    }
  };

  const renderModal = () => {
    switch (activeModal) {
      case 'climate-boardroom':
        return (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Climate Control - Boardroom">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Toggle checked={boardroomAC} onChange={toggleBoardroomAC} label="AC Power" />
                <div className={`w-3 h-3 rounded-full ${boardroomAC ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              
              {boardroomAC && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Temperature</span>
                    <span className="text-lg font-semibold">{convertTempToF(boardroomTemp)}°F</span>
                  </div>
                  <Slider
                    value={convertTempToF(boardroomTemp)}
                    onChange={(temp) => setBoardroomTemp(convertTempToAnalog(temp))}
                    min={60}
                    max={80}
                    step={1}
                    showValue={false}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>60°F</span>
                    <span>Cool</span>
                    <span>80°F</span>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        );

      case 'climate-training':
        return (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Climate Control - Training Room">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Toggle checked={trainingAC} onChange={toggleTrainingAC} label="AC Power" />
                <div className={`w-3 h-3 rounded-full ${trainingAC ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              
              {trainingAC && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Temperature</span>
                    <span className="text-lg font-semibold">{convertTempToF(trainingTemp)}°F</span>
                  </div>
                  <Slider
                    value={convertTempToF(trainingTemp)}
                    onChange={(temp) => setTrainingTemp(convertTempToAnalog(temp))}
                    min={60}
                    max={80}
                    step={1}
                    showValue={false}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>60°F</span>
                    <span>Cool</span>
                    <span>80°F</span>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        );

      case 'microphone':
        return (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Microphone Control">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {boardroomMic ? <Mic size={20} className="text-red-500" /> : <MicOff size={20} className="text-gray-400" />}
                    <span className="font-medium">Boardroom Microphone</span>
                  </div>
                  <Toggle checked={boardroomMic} onChange={toggleBoardroomMic} />
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {trainingMic ? <Mic size={20} className="text-red-500" /> : <MicOff size={20} className="text-gray-400" />}
                    <span className="font-medium">Training Room Microphone</span>
                  </div>
                  <Toggle checked={trainingMic} onChange={toggleTrainingMic} />
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center justify-between p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center space-x-3">
                      <Mic size={20} className="text-blue-400" />
                      <span className="font-semibold text-blue-400">All Microphones</span>
                    </div>
                    <Toggle checked={combinedMicControl} onChange={handleCombinedMicToggle} />
                  </div>
                </div>

                <div className="text-center text-sm text-blue-300">
                  Active: {[boardroomMic, trainingMic].filter(Boolean).length} of 2 microphones
                </div>
              </div>
            </div>
          </Modal>
        );

      case 'speaker':
        return (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Speaker Control">
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="text-3xl font-bold text-blue-400">
                  {convertVolumePercent(volume)}%
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all duration-200"
                    style={{ width: `${convertVolumePercent(volume)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleVolumeChange(5)}
                  disabled={convertVolumePercent(volume) >= 100}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Volume Up</span>
                </Button>

                <Button
                  onClick={() => handleVolumeChange(-5)}
                  disabled={convertVolumePercent(volume) <= 0}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Minus size={20} />
                  <span>Volume Down</span>
                </Button>

                <Button
                  onClick={() => setVolume(0)}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <VolumeX size={20} />
                  <span>Speaker Off</span>
                </Button>
              </div>
            </div>
          </Modal>
        );

      case 'lighting':
        return (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Lighting Control">
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-blue-400">Lighting Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={welcomePreset ? "primary" : "secondary"}
                    onClick={() => setWelcome()}
                    className="flex items-center space-x-2 text-xs h-auto py-2"
                  >
                    <Coffee size={18} />
                    <span>Welcome</span>
                  </Button>
                  <Button
                    variant={presentationPreset ? "primary" : "secondary"}
                    onClick={() => setPresentation()}
                    className="flex items-center space-x-2 text-xs h-auto py-2"
                  >
                    <Sun size={18} />
                    <span>Presentation</span>
                  </Button>
                  <Button
                    variant={videoConfPreset ? "primary" : "secondary"}
                    onClick={() => setVideoConf()}
                    className="flex items-center space-x-2 text-xs h-auto py-2"
                  >
                    <Video size={18} />
                    <span>Video Conference</span>
                  </Button>
                  <Button
                    variant={meetingPreset ? "primary" : "secondary"}
                    onClick={() => setMeeting()}
                    className="flex items-center space-x-2 text-xs h-auto py-2"
                  >
                    <Users size={18} />
                    <span>Meeting</span>
                  </Button>
                </div>
              </div>

              <Button
                variant={allOffPreset ? "danger" : "outline"}
                onClick={() => setAllOff()}
                className="w-full"
              >
                All Lights Off
              </Button>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-blue-400">Brightness</h4>
                  <span className="text-sm font-medium text-blue-400">{convertBrightnessPercent(brightness)}%</span>
                </div>
                <Slider
                  value={convertBrightnessPercent(brightness)}
                  onChange={(percent) => setBrightness((percent / 100) * 65535)}
                  min={0}
                  max={100}
                  step={5}
                  showValue={false}
                />
              </div>
            </div>
          </Modal>
        );

      case 'source':
        return (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Source Selection">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={wirelessActive ? "primary" : "secondary"}
                  onClick={() => toggleWireless()}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Wifi size={20} />
                  <span className="text-xs font-medium">Wireless</span>
                </Button>
                <Button
                  variant={byodActive ? "primary" : "secondary"}
                  onClick={() => toggleBYOD()}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Monitor size={20} />
                  <span className="text-xs font-medium">BYOD</span>
                </Button>
                <Button
                  variant={zoomActive ? "primary" : "secondary"}
                  onClick={() => toggleZoom()}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Video size={20} />
                  <span className="text-xs font-medium">Zoom</span>
                </Button>
                <Button
                  variant={blankActive ? "primary" : "secondary"}
                  onClick={() => toggleBlank()}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <span>Blank</span>
                </Button>
              </div>
            </div>
          </Modal>
        );

      case 'drapes':
        return (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Drapes Control">
            <div className="space-y-6">
              <div className="flex justify-center space-x-4 mb-6">
                <Button onClick={() => triggerUp()} className="flex items-center space-x-2">
                  <ChevronUp size={20} />
                  <span>All Up</span>
                </Button>
                <Button onClick={() => triggerStop()} className="flex items-center space-x-2">
                  <Square size={20} />
                  <span>Stop All</span>
                </Button>
                <Button onClick={() => triggerDown()} className="flex items-center space-x-2">
                  <ChevronDown size={20} />
                  <span>All Down</span>
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'All Drapes', key: 'all', position: convertDrapesPercent(allPosition) },
                  { name: 'Left Section', key: 'left', position: convertDrapesPercent(leftPosition) },
                  { name: 'Center Section', key: 'center', position: convertDrapesPercent(centerPosition) },
                  { name: 'Right Section', key: 'right', position: convertDrapesPercent(rightPosition) }
                ].map((section) => (
                  <div key={section.key} className="p-4 border border-white/20 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-blue-400">{section.name}</h4>
                      <span className="text-sm font-semibold text-blue-400">{section.position}% Open</span>
                    </div>
                    <Slider
                      value={section.position}
                      onChange={(percent) => handleDrapesPositionChange(section.key, percent)}
                      min={0}
                      max={100}
                      step={5}
                      showValue={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-white">Crestron Control</h1>
                <p className="text-xs text-blue-200">AV Management System</p>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-blue-200 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/boardroom')}
                  className="text-blue-200 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1"
                >
                  <Users size={16} />
                  <span>Boardroom</span>
                </button>
                <button
                  onClick={() => navigate('/training-room')}
                  className="text-blue-200 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1"
                >
                  <GraduationCap size={16} />
                  <span>Training Room</span>
                </button>
                <button
                  onClick={handleZoomMeeting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1"
                >
                  <Video size={16} />
                  <span>Zoom Meeting</span>
                </button>
                <button
                  onClick={() => navigate('/combined-room')}
                  className="bg-white/20 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Combined Room
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="bg-white/10 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-white/20 transition-colors duration-200"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/5 backdrop-blur-md">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-200 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-200"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/boardroom')}
                className="text-blue-200 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-200 flex items-center space-x-2"
              >
                <Users size={16} />
                <span>Boardroom</span>
              </button>
              <button
                onClick={() => navigate('/training-room')}
                className="text-blue-200 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-200 flex items-center space-x-2"
              >
                <GraduationCap size={16} />
                <span>Training Room</span>
              </button>
              <button
                onClick={handleZoomMeeting}
                className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-200 flex items-center space-x-2"
              >
                <Video size={16} />
                <span>Zoom Meeting</span>
              </button>
              <button
                onClick={() => navigate('/combined-room')}
                className="bg-white/20 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Combined Room
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content - Now properly scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Climate Controls */}
            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer"
              onClick={() => setActiveModal('climate-boardroom')}
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Thermometer size={20} />
                  <span>Climate Control (Boardroom)</span>
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">AC Power</span>
                  <div className={`w-3 h-3 rounded-full ${boardroomAC ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{convertTempToF(boardroomTemp)}°F</div>
                  <div className="text-sm text-blue-300">Current Temperature</div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer"
              onClick={() => setActiveModal('climate-training')}
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Thermometer size={20} />
                  <span>Climate Control (Training)</span>
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">AC Power</span>
                  <div className={`w-3 h-3 rounded-full ${trainingAC ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{convertTempToF(trainingTemp)}°F</div>
                  <div className="text-sm text-blue-300">Current Temperature</div>
                </div>
              </div>
            </div>

            {/* Audio Controls */}
            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer"
              onClick={() => setActiveModal('speaker')}
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Volume2 size={20} />
                  <span>Speaker Control</span>
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{convertVolumePercent(volume)}%</div>
                  <div className="text-sm text-blue-300">Volume Level</div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-200"
                      style={{ width: `${convertVolumePercent(volume)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer"
              onClick={() => setActiveModal('microphone')}
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Mic size={20} />
                  <span>Microphone Control</span>
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center">
                  <div className="text-sm text-blue-300 mb-2">
                    Active: {[boardroomMic, trainingMic].filter(Boolean).length} of 2 microphones
                  </div>
                  <div className="flex justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${boardroomMic ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${trainingMic ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Environment Controls */}
            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer"
              onClick={() => setActiveModal('lighting')}
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Lightbulb size={20} />
                  <span>Lighting Control</span>
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{convertBrightnessPercent(brightness)}%</div>
                  <div className="text-sm text-blue-300 mb-2">Brightness Level</div>
                  <div className="text-xs text-blue-300">
                    {[welcomePreset, presentationPreset, videoConfPreset, meetingPreset].some(p => p) 
                      ? 'Preset Active' 
                      : 'Manual Control'}
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer"
              onClick={() => setActiveModal('drapes')}
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Blinds size={20} />
                  <span>Drapes Control</span>
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{convertDrapesPercent(allPosition)}%</div>
                  <div className="text-sm text-blue-300">Open Position</div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${convertDrapesPercent(allPosition)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer"
              onClick={() => setActiveModal('source')}
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Monitor size={20} />
                  <span>Source Selection</span>
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center">
                  <div className="text-sm text-blue-300 mb-2">
                    {[wirelessActive, byodActive, zoomActive, blankActive].some(Boolean) 
                      ? 'Source Active' 
                      : 'No Source Selected'}
                  </div>
                  <div className="flex justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${wirelessActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${byodActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${zoomActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${blankActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Layers size={20} />
                  <span>Display Status</span>
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-200">Boardroom Display</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-200">Training Display</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-200">Combined Mode</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/20 text-center">
                  <div className="text-xs text-green-400 font-medium">All displays operational</div>
                </div>
              </div>
            </div>

            {/* Room Configuration */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Layers size={20} />
                  <span>Room Configuration</span>
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-blue-200 mb-3 text-center">Combined Layout</div>
                  <div className="space-y-2">
                    <div className="bg-blue-600 rounded p-2 text-white text-xs text-center">
                      Boardroom Section (12 seats)
                    </div>
                    <div className="bg-amber-600 rounded p-2 text-white text-xs text-center">
                      Training Section (20 seats)
                    </div>
                  </div>
                  <div className="text-xs text-blue-300 mt-2 text-center">
                    Total capacity: 32 participants
                  </div>
                </div>
                <button
                  onClick={handleResetDefaults}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200 text-sm font-medium"
                >
                  Reset All to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Modal */}
      {renderModal()}
    </div>
  );
};

export default CombinedRoom;





