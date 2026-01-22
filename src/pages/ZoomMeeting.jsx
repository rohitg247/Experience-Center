import { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Users, Settings, Phone, PhoneOff, Share, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDigitalJoin } from '../hooks/useJoin';
import { DIGITAL_JOINS } from '../crestron/joins';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ZoomMeeting = () => {
  const navigate = useNavigate();
  
  // Meeting state
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [meetingId] = useState('123-456-7890');

  // Crestron join integration
  const [boardroomMic, toggleBoardroomMic] = useDigitalJoin(DIGITAL_JOINS.BOARDROOM_MIC);
  const [trainingMic, toggleTrainingMic] = useDigitalJoin(DIGITAL_JOINS.TRAINING_ROOM_MIC);

  // Timer effect
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Simulate connection process
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      setParticipantCount(3);
    }, 2000);
    
    return () => clearTimeout(connectTimer);
  }, []);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndMeeting = () => {
    navigate(-1);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // Also toggle room microphones
    if (isAudioOn) {
      if (boardroomMic) toggleBoardroomMic();
      if (trainingMic) toggleTrainingMic();
    }
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  if (!isConnected) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white space-y-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Connecting to Meeting...</h2>
            <p className="text-gray-300">Meeting ID: {meetingId}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="font-semibold">Conference Room Meeting</h1>
            <p className="text-sm text-gray-300">Meeting ID: {meetingId}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Users size={20} />
            <span>{participantCount}</span>
          </div>
          <div className="text-sm">
            Duration: {formatDuration(meetingDuration)}
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 bg-gray-800 relative">
        {/* Simulated Video Feed */}
        <div className="w-full h-full flex items-center justify-center">
          {isVideoOn ? (
            <div className="bg-gray-700 rounded-lg w-full max-w-4xl h-full max-h-96 flex items-center justify-center mx-4">
              <div className="text-center text-white">
                <Video size={64} className="mx-auto mb-4 opacity-60" />
                <p className="text-lg">Conference Room Camera</p>
                <p className="text-sm text-gray-400">Main view showing room participants</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg w-full max-w-4xl h-full max-h-96 flex items-center justify-center mx-4">
              <div className="text-center text-white">
                <VideoOff size={64} className="mx-auto mb-4 opacity-60" />
                <p className="text-lg">Camera Off</p>
                <p className="text-sm text-gray-400">Video is disabled</p>
              </div>
            </div>
          )}
        </div>

        {/* Screen Sharing Overlay */}
        {isScreenSharing && (
          <div className="absolute top-4 left-4 bg-success text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
            <Share size={16} />
            <span>You are sharing your screen</span>
          </div>
        )}

        {/* Participant Gallery */}
        <div className="absolute bottom-20 right-4 space-y-2">
          <div className="bg-gray-700 rounded-lg w-32 h-24 flex items-center justify-center">
            <div className="text-white text-xs text-center">
              <div className="w-6 h-6 bg-gray-600 rounded-full mx-auto mb-1"></div>
              <div>Remote User 1</div>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg w-32 h-24 flex items-center justify-center">
            <div className="text-white text-xs text-center">
              <div className="w-6 h-6 bg-gray-600 rounded-full mx-auto mb-1"></div>
              <div>Remote User 2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-black bg-opacity-90 backdrop-blur-sm p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Audio Control */}
          <Button
            variant={isAudioOn ? "secondary" : "danger"}
            size="lg"
            onClick={handleToggleAudio}
            className={`flex items-center space-x-2 ${isAudioOn ? '' : 'bg-danger hover:bg-danger-700'}`}
          >
            {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
            <span>{isAudioOn ? 'Mute' : 'Unmute'}</span>
          </Button>

          {/* Video Control */}
          <Button
            variant={isVideoOn ? "secondary" : "danger"}
            size="lg"
            onClick={handleToggleVideo}
            className={`flex items-center space-x-2 ${isVideoOn ? '' : 'bg-danger hover:bg-danger-700'}`}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            <span>{isVideoOn ? 'Stop Video' : 'Start Video'}</span>
          </Button>

          {/* Screen Share */}
          <Button
            variant={isScreenSharing ? "primary" : "secondary"}
            size="lg"
            onClick={handleScreenShare}
            className="flex items-center space-x-2"
          >
            <Share size={20} />
            <span>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
          </Button>

          {/* Participants */}
          <Button
            variant="secondary"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Users size={20} />
            <span>Participants ({participantCount})</span>
          </Button>

          {/* Settings */}
          <Button
            variant="secondary"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Settings size={20} />
            <span>Settings</span>
          </Button>

          {/* End Meeting */}
          <Button
            variant="danger"
            size="lg"
            onClick={handleEndMeeting}
            className="flex items-center space-x-2 ml-8"
          >
            <PhoneOff size={20} />
            <span>End Meeting</span>
          </Button>
        </div>

        {/* Room Microphone Status */}
        <div className="flex justify-center mt-3 space-x-4 text-sm">
          <div className={`flex items-center space-x-2 ${boardroomMic ? 'text-success' : 'text-gray-400'}`}>
            <div className="w-2 h-2 rounded-full bg-current"></div>
            <span>Boardroom Mic</span>
          </div>
          <div className={`flex items-center space-x-2 ${trainingMic ? 'text-success' : 'text-gray-400'}`}>
            <div className="w-2 h-2 rounded-full bg-current"></div>
            <span>Training Room Mic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomMeeting;