import { useState, useEffect } from "react";
import { isActive } from "@crestron/ch5-webxpanel";
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import ShutdownScreen from "./components/ShutdownScreen";
import ShutdownModal from "./components/modals/ShutdownModal";
import ClimateLightingModal from "./components/modals/ClimateLightingModal";

// Import room header components
import CombinedRoom, { CombinedRoomHeader } from "./pages/CombinedRoom";
import Settings, { SettingsHeader } from "./pages/Settings";
import Boardroom, { BoardroomHeader } from "./pages/Boardroom";
import TrainingRoom, { TrainingRoomHeader } from "./pages/TrainingRoom";

import Modal from "./components/ui/Modal";
import MicrophoneControl from "./components/devices/MicrophoneControl";
import DrapesControl from "./components/devices/DrapesControl";

import LandingPage from "./pages/LandingPage";
import ZoomMeeting from "./pages/ZoomMeeting";

// --- Helper Component to manage Navbar and Page Content ---
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";

const ContentWrapper = ({ children, onShutdown }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [previousPage, setPreviousPage] = useState(null);

  // Track last non-settings page
  useEffect(() => {
    if (location.pathname !== "/settings") {
      setPreviousPage(location.pathname);
    }
  }, [location.pathname]);

  // State for modals
  const [isMicModalOpen, setIsMicModalOpen] = useState(false);
  const [isDrapesModalOpen, setIsDrapesModalOpen] = useState(false);
  const [isClimateModalOpen, setIsClimateModalOpen] = useState(false);

  // Settings handlers state
  const [settingsHandlers, setSettingsHandlers] = useState({
    onSave: null,
    onReset: null,
  });

  const handleZoomMeeting = useCallback(() => {
    navigate("/zoom-meeting");
  }, [navigate]);

  const openMicModal = useCallback(() => setIsMicModalOpen(true), []);
  const closeMicModal = useCallback(() => setIsMicModalOpen(false), []);

  const openDrapesModal = useCallback(() => setIsDrapesModalOpen(true), []);
  const closeDrapesModal = useCallback(() => setIsDrapesModalOpen(false), []);

  const openClimateModal = useCallback(() => setIsClimateModalOpen(true), []);
  const closeClimateModal = useCallback(() => setIsClimateModalOpen(false), []);

  const handleSettingsHandlersReady = useCallback((handlers) => {
    setSettingsHandlers(handlers);
  }, []);

  let centerContent = null;

  if (location.pathname === "/combined-room") {
    centerContent = (
      <CombinedRoomHeader
        navigate={navigate}
        handleZoomMeeting={handleZoomMeeting}
        openMicModal={openMicModal}
        openDrapesModal={openDrapesModal}
        openClimateModal={openClimateModal}
      />
    );
  } else if (location.pathname === "/boardroom") {
    centerContent = (
      <BoardroomHeader
        navigate={navigate}
        handleZoomMeeting={handleZoomMeeting}
        openClimateModal={openClimateModal}
        openDrapesModal={openDrapesModal}
      />
    );
  } else if (location.pathname === "/training-room") {
    centerContent = (
      <TrainingRoomHeader
        navigate={navigate}
        handleZoomMeeting={handleZoomMeeting}
        openClimateModal={openClimateModal}
        openDrapesModal={openDrapesModal}
      />
    );
  } else if (location.pathname === "/settings") {
    centerContent = (
      <SettingsHeader
        onSave={settingsHandlers.onSave}
        onReset={settingsHandlers.onReset}
      />
    );
  }

  return (
    <>
      <Navbar
        onShutdown={onShutdown}
        centerContent={centerContent}
        previousPage={previousPage}
      />

      <div className="flex-1 overflow-hidden">
        {location.pathname === "/settings" ? (
          <Settings onHandlersReady={handleSettingsHandlersReady} />
        ) : location.pathname === "/combined-room" ? (
          <>
            {children}

            {isMicModalOpen && (
              <Modal
                isOpen={isMicModalOpen}
                onClose={closeMicModal}
                title="Microphone Control"
                maxWidth="max-w-2xl"
              >
                <MicrophoneControl room="both" isModalContent />
              </Modal>
            )}

            {isDrapesModalOpen && (
              <Modal
                isOpen={isDrapesModalOpen}
                onClose={closeDrapesModal}
                title="Drapes Control"
                maxWidth="max-w-2xl"
              >
                <DrapesControl isModalContent />
              </Modal>
            )}

            {isClimateModalOpen && (
              <Modal
                isOpen={isClimateModalOpen}
                onClose={closeClimateModal}
                title="Climate & Lighting Control"
                maxWidth="max-w-6xl"
                fullHeight
              >
                <ClimateLightingModal room="both" isModalContent />
              </Modal>
            )}
          </>
        ) : location.pathname === "/boardroom" ||
          location.pathname === "/training-room" ? (
          <>
            {children}

            {isClimateModalOpen && (
              <Modal
                isOpen={isClimateModalOpen}
                onClose={closeClimateModal}
                title="Climate & Lighting Control"
                maxWidth="max-w-6xl"
                fullHeight
              >
                <ClimateLightingModal
                  room={
                    location.pathname === "/boardroom"
                      ? "boardroom"
                      : "training"
                  }
                  isModalContent
                />
              </Modal>
            )}

            {isDrapesModalOpen && (
              <Modal
                isOpen={isDrapesModalOpen}
                onClose={closeDrapesModal}
                title="Drapes Control"
                maxWidth="max-w-2xl"
              >
                <DrapesControl isModalContent />
              </Modal>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </>
  );
};

function App() {
  const [showShutdown, setShowShutdown] = useState(false);
  const [showShutdownModal, setShowShutdownModal] = useState(false);

  // Keyboard shortcut for theme switching (Alt+1, Alt+2, Alt+3)
  const handleKeyPress = useCallback((e) => {
    if (e.altKey) {
      if (e.key === '1') {
        document.documentElement.removeAttribute('data-theme');
        console.log('🎨 Switched to: Default (Dark Blue #191e4f)');
      }
      if (e.key === '2') {
        document.documentElement.setAttribute('data-theme', 'blue-yellow');
        console.log('🎨 Switched to: Blue-Yellow (#003D82 Dark)');
      }
      if (e.key === '3') {
        document.documentElement.setAttribute('data-theme', 'light');
        console.log('🎨 Switched to: Light Theme');
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleShutdownClick = () => setShowShutdownModal(true);
  const handleShutdownConfirm = () => {
    setShowShutdownModal(false);
    setShowShutdown(true);
  };
  const handleShutdownCancel = () => setShowShutdownModal(false);
  const handleShutdownComplete = () => {
    setShowShutdown(false);
  };

  return (
    <MemoryRouter initialEntries={["/"]}>
      <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/boardroom"
            element={
              <ContentWrapper onShutdown={handleShutdownClick}>
                <Boardroom />
              </ContentWrapper>
            }
          />
          <Route
            path="/training-room"
            element={
              <ContentWrapper onShutdown={handleShutdownClick}>
                <TrainingRoom />
              </ContentWrapper>
            }
          />
          <Route
            path="/combined-room"
            element={
              <ContentWrapper onShutdown={handleShutdownClick}>
                <CombinedRoom />
              </ContentWrapper>
            }
          />
          <Route
            path="/settings"
            element={
              <ContentWrapper onShutdown={handleShutdownClick}>
                <Settings />
              </ContentWrapper>
            }
          />

          <Route path="/zoom-meeting" element={<ZoomMeeting />} />
        </Routes>

        <ShutdownModal
          isOpen={showShutdownModal}
          onConfirm={handleShutdownConfirm}
          onCancel={handleShutdownCancel}
        />

        <ShutdownScreen
          isVisible={showShutdown}
          onComplete={handleShutdownComplete}
        />
      </div>
    </MemoryRouter>
  );
}

export default App;
