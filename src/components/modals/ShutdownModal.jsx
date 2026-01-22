import { useState } from 'react';
import { Power } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ShutdownModal = ({ isOpen, onConfirm, onCancel }) => {
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const handleConfirm = () => {
    setIsShuttingDown(true);
    setTimeout(() => {
      onConfirm();
      setIsShuttingDown(false);
    },); // simulate shutdown delay
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Shutdown System"
      showCloseButton={!isShuttingDown}
    >
      <div className="text-center">
        <div className="mb-6">
          <Power size={48} className="mx-auto text-danger mb-4" />
          <p className="text-lg text-danger font-semibold mb-2">
            Are you sure you want to shut down the system?
          </p>
          <p className="text-sm text-gray-600">
            This will power off all connected AV equipment and end the session.
          </p>
        </div>

        {isShuttingDown ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-danger mx-auto"></div>
            <p className="text-danger">Shutting down system...</p>
          </div>
        ) : (
          <div className="flex space-x-3 justify-center">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              Confirm Shutdown
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShutdownModal;
