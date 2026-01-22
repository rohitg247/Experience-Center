import { useState, useRef, useEffect } from 'react';

const Slider = ({
    value = 0,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    orientation = 'horizontal',
    className = '',

    // New prop for Crestron analog join setter:
    setAnalog,

    showValue = true,
    label,
    ...props
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);

    const handleStart = (e) => {
        setIsDragging(true);
        updateValue(e);
    };

    const handleMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateValue(e);
    };

    const handleEnd = () => {
        setIsDragging(false);
    };

    const updateValue = (e) => {
        if (!sliderRef.current) return;

        const clientX = e.type.includes('touch') ? e.touches[0]?.clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0]?.clientY : e.clientY;

        const rect = sliderRef.current.getBoundingClientRect();
        let percentage;

        if (orientation === 'vertical') {
            percentage = 1 - (clientY - rect.top) / rect.height;
        } else {
            percentage = (clientX - rect.left) / rect.width;
        }

        percentage = Math.max(0, Math.min(1, percentage));
        const newValue = min + (max - min) * percentage;
        const steppedValue = Math.round(newValue / step) * step;

        if (setAnalog) {
            setAnalog(steppedValue);
        }

        onChange?.(steppedValue);
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleGlobalMove = (e) => handleMove(e);
        const handleGlobalEnd = () => handleEnd();

        document.addEventListener('mousemove', handleGlobalMove);
        document.addEventListener('mouseup', handleGlobalEnd);
        document.addEventListener('touchmove', handleGlobalMove, { passive: false });
        document.addEventListener('touchend', handleGlobalEnd);

        return () => {
            document.removeEventListener('mousemove', handleGlobalMove);
            document.removeEventListener('mouseup', handleGlobalEnd);
            document.removeEventListener('touchmove', handleGlobalMove);
            document.removeEventListener('touchend', handleGlobalEnd);
        };
    }, [isDragging]);

    const percentage = ((value - min) / (max - min)) * 100;

    const containerClass = orientation === 'vertical'
        ? 'h-48 w-6 flex-col'
        : 'w-full h-6 flex-row';

    const trackClass = orientation === 'vertical'
        ? 'w-2 h-full mx-auto'
        : 'h-2 w-full my-auto';

    const thumbStyle = orientation === 'vertical'
        ? { bottom: `${percentage}%`, transform: 'translate(-50%, 50%)', left: '50%' }
        : { left: `${percentage}%`, transform: 'translate(-50%, -50%)', top: '50%' };

    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label className="text-sm font-medium text-primary mb-3">
                    {label}{showValue && ` (${value})`}
                </label>
            )}
            <div
                ref={sliderRef}
                className={`relative cursor-pointer select-none touch-none ${containerClass}`}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                style={{ touchAction: 'none' }}
                {...props}
            >
                <div className={`absolute bg-gray-300 rounded-full ${trackClass}`}
                    style={orientation === 'vertical'
                        ? { left: '50%', transform: 'translateX(-50%)' }
                        : { top: '50%', transform: 'translateY(-50%)' }
                    }
                />
                <div
                    className="absolute bg-primary rounded-full transition-all duration-100"
                    style={
                        orientation === 'vertical'
                            ? {
                                width: '8px',
                                height: `${percentage}%`,
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderRadius: '4px'
                            }
                            : {
                                height: '8px',
                                width: `${percentage}%`,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                borderRadius: '4px'
                            }
                    }
                />
                <div
                    className="absolute w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg transition-transform duration-100 active:scale-125"
                    style={thumbStyle}
                />
            </div>
            {showValue && !label && (
                <span className="text-sm font-medium text-primary mt-2">
                    {value}
                </span>
            )}
        </div>
    );
};

export default Slider;
