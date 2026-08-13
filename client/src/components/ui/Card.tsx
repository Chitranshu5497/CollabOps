import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

const Card = ({ children, className = "", glass = false }: CardProps) => {
  return (
    <div
      className={`rounded-xl p-8 shadow-lg animate-[cardIn_0.4s_ease-out] ${
        glass ? "bg-white/60 backdrop-blur-2xl" : "bg-white"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;