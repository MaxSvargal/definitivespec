import React from 'react';

// The props type definition (for TypeScript, optional for JS)
interface SocialButtonProps {
  Icon: React.ElementType;
  name: string;
  href: string;
  colors: {
    main: string;
    before: string;
    after: string;
  };
  size?: 'default' | 'large';
}

const SocialButton: React.FC<SocialButtonProps> = ({ Icon, name, href, colors, size = 'default' }) => {
  // We use CSS variables to dynamically set the hover colors from props.
  // This is a clean way to pass brand colors into Tailwind's utility classes.
  const style = {
    '--main-bg': colors.main,
    '--before-bg': colors.before,
    '--after-bg': colors.after,
  } as React.CSSProperties;

  // Size-based styling
  const sizeClasses = {
    default: {
      container: 'px-0.5',
      button: 'h-10 w-[110px] pl-2.5',
      shadow: 'shadow-[-10px_10px_5px_rgba(0,0,0,0.5)]',
      hover: 'group-hover:translate-x-2.5 group-hover:-translate-y-2 group-hover:shadow-[-25px_25px_25px_rgba(0,0,0,0.5)]',
      before: 'before:left-[-10px] before:top-[5px] before:w-2.5',
      after: 'after:bottom-[-10px] after:left-[-5px] after:h-2.5',
      icon: 'mr-1.5 text-3xl',
      text: 'text-sm'
    },
    large: {
      container: 'px-1.5',
      button: 'h-20 w-[210px] pl-5',
      shadow: 'shadow-[-20px_20px_10px_rgba(0,0,0,0.5)]',
      hover: 'group-hover:translate-x-5 group-hover:-translate-y-4 group-hover:shadow-[-50px_50px_50px_rgba(0,0,0,0.5)]',
      before: 'before:left-[-20px] before:top-[10px] before:w-5',
      after: 'after:bottom-[-20px] after:left-[-10px] after:h-5',
      icon: 'mr-3 text-6xl',
      text: 'font-medium'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`group m-0 list-none ${currentSize.container}`}>
      <a
        href={href}
        className={`
          relative block ${currentSize.button}
          bg-white text-left no-underline
          transition-all duration-500
          
          /* --- The 3D Skew & Rotate Effect --- */
          -rotate-[30deg] skew-x-[25deg]
          
          /* --- The 3D Shadow --- */
          ${currentSize.shadow}

          /* --- Hover Effects --- */
          ${currentSize.hover}
          
          /* Using the CSS variable for dynamic background color on hover */
          group-hover:bg-[var(--main-bg)]

          /* --- The Left Side of the 3D block (:before) --- */
          before:absolute ${currentSize.before} 
          before:h-full 
          before:bg-[#b1b1b1] 
          before:transition-all before:duration-500 
          before:content-['']
          before:-skew-y-[45deg]
          /* Using the CSS variable for dynamic side color on hover */
          group-hover:before:bg-[var(--before-bg)]

          /* --- The Bottom Side of the 3D block (:after) --- */
          after:absolute ${currentSize.after} 
          after:w-full 
          after:bg-[#b1b1b1] 
          after:transition-all after:duration-500 
          after:content-['']
          after:-skew-x-[45deg]
          /* Using the CSS variable for dynamic bottom color on hover */
          group-hover:after:bg-[var(--after-bg)]
        `}
        target='_blank'
        style={style}
      >
        <div className="flex items-center h-full">
          {/* Icon */}
          <Icon className={`
              ${currentSize.icon} text-[#262626]
              transition-colors duration-500 group-hover:text-white
            `}
            aria-hidden="true"
          />
          {/* Text */}
          <span className={`
              text-[#262626] ${currentSize.text}
              transition-colors duration-500 group-hover:text-white
            `}
          >
            {name}
          </span>
        </div>
      </a>
    </div>
  );
};

export default SocialButton;