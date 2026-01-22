import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-lg',
  showCloseButton = true,
  fullHeight = false // Option for modals that need more vertical space
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`
          relative bg-white rounded-xl shadow-2xl 
          w-full ${maxWidth}
          ${fullHeight ? 'h-[90vh]' : 'max-h-[85vh]'}
          flex flex-col
          animate-slide-up
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            {title && (
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 pr-4">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                aria-label="Close modal"
              >
                <X size={20} />
              </Button>
            )}
          </div>
        )}
        
        {/* Content - Flexible height based on content */}
        <div className="p-4 sm:p-6 overflow-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;