const Toggle = ({
    checked = false,
    onChange,
    label,
    disabled = false,
    className = '',
    checkedBgClass = 'bg-primary',
    innerText = null,

    // New props for Crestron integration
    setDigital,
    momentary = false,

    ...props
}) => {

    // Handler for click when momentary is enabled - sends true then false on release
    // But toggles usually don't require momentary. So optional here:
    const handleMouseDown = () => {
        if (momentary && setDigital) setDigital(true);
    };
    const handleMouseUp = () => {
        if (momentary && setDigital) setDigital(false);
    };

    return (
        <div className={`inline-flex items-center ${className}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => !disabled && !momentary && onChange?.(!checked)}
                disabled={disabled}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                className={`
                    relative inline-flex items-center w-16 h-8 rounded-full transition-colors duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                    ${checked ? checkedBgClass : 'bg-gray-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                {...props}
            >
                {innerText && (
                    <>
                        <span
                            className={`
                                absolute top-1/2 -translate-y-1/2 text-xs font-semibold
                                transition-opacity duration-150
                                ${checked
                                    ? 'right-2 text-white opacity-0'
                                    : 'right-2 text-gray-600 opacity-100'
                                }
                            `}
                        >
                            {innerText.off}
                        </span>

                        <span
                            className={`
                                absolute top-1/2 -translate-y-1/2 text-xs font-semibold
                                transition-opacity duration-150
                                ${checked
                                    ? 'left-2 text-white opacity-100'
                                    : 'left-2 text-gray-600 opacity-0'
                                }
                            `}
                        >
                            {innerText.on}
                        </span>
                    </>
                )}

                <span
                    className={`
                        inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
                        ${checked ? 'translate-x-9' : 'translate-x-1'}
                    `}
                />
            </button>
            {label && (
                <span className="ml-3 text-sm font-medium text-primary">
                    {label}
                </span>
            )}
        </div>
    );
};

export default Toggle;
