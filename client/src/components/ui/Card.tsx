import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

/**
 * Drop-in replacement for the original Card. Default look (solid white,
 * rounded-xl, shadow-lg) is unchanged for any existing usage like
 * <Card>...</Card> elsewhere in the app (modals, panels, etc).
 * New optional props: `glass` (translucent + blur, used on the auth pages)
 * and `className` for one-off overrides.
 */
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