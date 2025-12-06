import { useEffect, useRef } from "react";

interface IconProps {
  icon: string;
  className?: string;
}

const Icon = ({ icon, className = "" }: IconProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = `<iconify-icon icon="${icon}" class="${className}"></iconify-icon>`;
    }
  }, [icon, className]);

  return <span ref={ref} />;
};

export default Icon;
