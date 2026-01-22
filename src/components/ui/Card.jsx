const Card = ({ 
  children, 
  className = "", 
  hover = true, 
  variant = "default",  // ✅ NEW: default | device
  ...props 
}) => {
  const hoverClass = hover
    ? "hover:shadow-lg transition-shadow duration-200"
    : "";

  const baseClasses = "rounded-xl border shadow-md";

  const variants = {
    // ✅ DEFAULT: Your exact current styling
    default: "bg-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border-gray-100 px-6 py-4",
    
    // ✅ FORCE GRAY with !important + LAST position
    device: "!bg-gray-50 border-gray-200 shadow-xl rounded-2xl p-4 lg:p-6 touchPanel:p-8 h-full"
  };

  const cardVariant = variants[variant] || variants.default;

  return (
    <div
      className={`${baseClasses} ${cardVariant} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => (
  // CHANGED: mb-4 (1rem) is now mb-2 (0.5rem) to reduce space below the title
  <div className={`mb-2 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`text-lg font-semibold text-primary ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export default Card;


// const Card = ({ children, className = "", hover = true, ...props }) => {
//   const hoverClass = hover
//     ? "hover:shadow-lg transition-shadow duration-200"
//     : "";

//   return (
//     <div
//       // CHANGED: p-6 (1.5rem) is now px-6 py-4 (1rem top/bottom)
//       // CHANGED: Added 'bg-opacity-80' to set the background opacity to 80%
//       className={`bg-white-300 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 px-6 py-4 ${hoverClass} ${className}`}
//       // className={`bg-white bg-opacity-80 rounded-xl shadow-md border border-gray-100 px-6 py-4 ${hoverClass} ${className}`}
//       // className={`bg-white rounded-xl shadow-md border border-gray-100 px-6 py-4 ${hoverClass} ${className}`}
//       {...props}
//     >
//       {children}
//     </div>
//   );
// };

// export const CardHeader = ({ children, className = "", ...props }) => (
//   // CHANGED: mb-4 (1rem) is now mb-2 (0.5rem) to reduce space below the title
//   <div className={`mb-2 ${className}`} {...props}>
//     {children}
//   </div>
// );

// export const CardTitle = ({ children, className = "", ...props }) => (
//   <h3
//     className={`text-lg font-semibold text-primary ${className}`}
//     {...props}
//   >
//     {children}
//   </h3>
// );

// export const CardContent = ({ children, className = "", ...props }) => (
//   <div className={className} {...props}>
//     {children}
//   </div>
// );

// export default Card;