import { Hand, HandMetal, Scroll, CircleDashed } from "lucide-react";
import { motion } from "framer-motion";

type MoveType = "R" | "P" | "S" | null;

interface MoveIconProps {
  move: MoveType;
  className?: string;
  animate?: boolean;
}

export function MoveIcon({ move, className = "w-12 h-12", animate = false }: MoveIconProps) {
  const Icon = (() => {
    switch (move) {
      case "R": return HandMetal; // Rock
      case "P": return Hand;      // Paper
      case "S": return Scroll;    // Scissors
      default: return CircleDashed;
    }
  })();

  const variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, rotate: move === "R" ? 0 : move === "P" ? 10 : -10 },
    exit: { scale: 0.8, opacity: 0 }
  };

  if (!animate) {
    return <Icon className={className} />;
  }

  return (
    <motion.div
      key={move || "empty"}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Icon className={className} />
    </motion.div>
  );
}
