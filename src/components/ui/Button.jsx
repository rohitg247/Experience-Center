import { forwardRef, useRef } from 'react';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    setDigital,
    momentary = false,
    onMomentaryPress,  // NEW: callback when button is pressed
    onMomentaryRelease, // NEW: callback when button is released
    ...props
}, ref) => {
    const baseClasses = 'font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 touch-manipulation user-select-none';

    const variants = {
        primary: 'bg-primary hover:bg-primary-800 text-white border-2 border-transparent',
        danger: 'bg-danger hover:bg-danger-700 text-white border-2 border-transparent',
        success: 'bg-green-500 hover:bg-green-600 text-white border-2 border-transparent',
        secondary: 'bg-white hover:bg-gray-50 text-primary border-2 border-gray-200 hover:border-primary-200',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'bg-transparent text-primary hover:bg-gray-100 border-2 border-transparent',
        icon: 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300 hover:border-gray-400 p-3 rounded-xl shadow-sm hover:shadow-md active:scale-95'
    };

    const sizes = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6 text-base',
        lg: 'py-4 px-8 text-lg',
        xl: 'py-5 px-10 text-xl'
    };

    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed hover:shadow-md active:scale-100'
        : '';

    // Ref to track if touch event is active
    const touchActiveRef = useRef(false);

    // Momentary event handlers with deduplication logic
    const joinHandlers = {};
    if (momentary && setDigital) {
        joinHandlers.onTouchStart = () => {
            touchActiveRef.current = true;
            setDigital(true);
            onMomentaryPress?.();  // Call press callback
        };
        joinHandlers.onTouchEnd = () => {
            touchActiveRef.current = false;
            setDigital(false);
            onMomentaryRelease?.();  // Call release callback
        };
        joinHandlers.onMouseDown = () => {
            if (!touchActiveRef.current) {
                setDigital(true);
                onMomentaryPress?.();  // Call press callback
            }
        };
        joinHandlers.onMouseUp = () => {
            if (!touchActiveRef.current) {
                setDigital(false);
                onMomentaryRelease?.();  // Call release callback
            }
        };
    }

    return (
        <button
            ref={ref}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
            {...joinHandlers}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;