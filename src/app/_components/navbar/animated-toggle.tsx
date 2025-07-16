'use client';

interface AnimatedToggleProps {
  toggle: boolean;
  onToggle: () => void;
}

export default function AnimatedToggle({ toggle, onToggle }: AnimatedToggleProps) {
  return (
    <div 
      className="h-full w-full" 
      tabIndex={0} 
      data-highlight="true"
      onClick={onToggle}
      aria-label={toggle ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={toggle}
    >
      <div style={{ transform: 'none', transformOrigin: '50% 50%' }}>
        <div 
          className="w-[5px] h-[5px] bg-black transition-all duration-300" 
          style={{ 
            transform: 'none', 
            transformOrigin: '50% 50%', 
            position: 'absolute', 
            top: toggle ? '1.5px' : '0px', 
            left: toggle ? '1.5px' : '0px'
          }}
        ></div>
        <div 
          className="w-[5px] h-[5px] bg-black transition-all duration-300" 
          style={{ 
            transform: 'none', 
            transformOrigin: '50% 50%', 
            position: 'absolute', 
            top: toggle ? '1.5px' : '0px', 
            left: toggle ? '11.5px' : '13px'
          }}
        ></div>
      </div>
      <div 
        className="w-[5px] h-[5px] bg-black transition-opacity duration-300" 
        style={{ 
          opacity: toggle ? 1 : 0, 
          willChange: 'transform', 
          position: 'absolute', 
          top: '6.5px', 
          left: '6.5px' 
        }}
      ></div>
      <div style={{ transform: 'none', transformOrigin: '50% 50%' }}>
        <div 
          className="w-[5px] h-[5px] bg-black transition-all duration-300" 
          style={{ 
            transform: 'none', 
            transformOrigin: '50% 50%', 
            position: 'absolute', 
            top: toggle ? '11.5px' : '13px', 
            left: toggle ? '1.5px' : '0px'
          }}
        ></div>
        <div 
          className="w-[5px] h-[5px] bg-black transition-all duration-300" 
          style={{ 
            transform: 'none', 
            transformOrigin: '50% 50%', 
            position: 'absolute', 
            top: toggle ? '11.5px' : '13px', 
            left: toggle ? '11.5px' : '13px'
          }}
        ></div>
      </div>
    </div>
  );
}