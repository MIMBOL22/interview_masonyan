import { FunctionComponent, ReactNode, useEffect, useRef, useState } from 'react';

export interface DropdownProps {
  toggleContent: ReactNode;
  toggleClassName?: string;
  contentClassName?: string;
  useButton?: boolean;
  children: ReactNode;
}

export const Dropdown: FunctionComponent<DropdownProps> = ({
  toggleContent,
  toggleClassName,
  contentClassName,
  useButton,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!e.target || !open) {
        return;
      }
      const containerRefTarget = containerRef.current?.contains(e.target as any);
      if (!containerRefTarget) {
        setOpen(false);
      }
    };

    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  });

  return (
    <div ref={containerRef} className='relative'>
      {useButton ? (
        <button aria-expanded={open} className={toggleClassName} onClick={handleToggle}>
          {toggleContent}
        </button>
      ) : (
        <div aria-expanded={open} className={toggleClassName} onClick={handleToggle}>
          {toggleContent}
        </div>
      )}
      {open && <div className={`${contentClassName} absolute overflow-auto max-h-20 z-50 translate-y-0.25 shadow`}>{children}</div>}
    </div>
  );
};
