import { motion, AnimatePresence } from "framer-motion";
import { MoveIcon } from "./MoveIcon";
import { type Move, type GameOutcome } from "@shared/schema";
import { BrainCircuit } from "lucide-react";

interface PlayAreaProps {
  playerMove: Move | null;
  botMove: Move | null;
  result: GameOutcome | null;
  isPending: boolean;
}

export function PlayArea({ playerMove, botMove, result, isPending }: PlayAreaProps) {
  
  const getResultText = (res: GameOutcome) => {
    switch (res) {
      case "win": return "VICTORY";
      case "loss": return "DEFEAT";
      case "tie": return "STALEMATE";
      default: return "";
    }
  };

  const getResultColor = (res: GameOutcome) => {
    switch (res) {
      case "win": return "text-primary drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]";
      case "loss": return "text-destructive drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]";
      case "tie": return "text-secondary drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]";
      default: return "text-foreground";
    }
  };

  return (
    <div className="relative w-full max-w-4xl h-[400px] bg-black/40 border border-primary/20 rounded-xl backdrop-blur-md flex items-center justify-between px-4 md:px-16 overflow-hidden">
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Player Side */}
      <div className="flex flex-col items-center gap-6 z-10 relative">
        <div className="text-sm font-mono text-primary/80 tracking-widest">PLAYER_01</div>
        <div className="w-32 h-32 md:w-48 md:h-48 border-2 border-primary/30 rounded-full flex items-center justify-center bg-primary/5 shadow-[0_0_30px_-10px_rgba(0,243,255,0.3)]">
          <AnimatePresence mode="wait">
            {playerMove ? (
              <MoveIcon move={playerMove} className="w-16 h-16 md:w-24 md:h-24 text-primary" animate />
            ) : (
              <div className="w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* VS / Result Center */}
      <div className="z-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
        <AnimatePresence mode="wait">
          {result && !isPending ? (
            <motion.div
              key="result"
              initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 1.5, opacity: 0 }}
              className={`text-5xl md:text-7xl font-black italic font-display tracking-tighter ${getResultColor(result)}`}
            >
              {getResultText(result)}
            </motion.div>
          ) : (
            <motion.div
              key="vs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-4xl font-display font-bold text-muted-foreground/20 select-none"
            >
              VS
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bot Side */}
      <div className="flex flex-col items-center gap-6 z-10 relative">
        <div className="text-sm font-mono text-destructive/80 tracking-widest flex items-center gap-2">
          AI_CORE <BrainCircuit className="w-4 h-4" />
        </div>
        <div className={`w-32 h-32 md:w-48 md:h-48 border-2 ${isPending ? 'border-accent/50 animate-pulse shadow-[0_0_50px_-10px_rgba(57,255,20,0.3)]' : 'border-destructive/30'} rounded-full flex items-center justify-center bg-destructive/5 transition-all duration-300`}>
          <AnimatePresence mode="wait">
            {isPending ? (
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               >
                 <BrainCircuit className="w-12 h-12 text-accent" />
               </motion.div>
            ) : botMove ? (
              <MoveIcon move={botMove} className="w-16 h-16 md:w-24 md:h-24 text-destructive" animate />
            ) : (
              <div className="w-4 h-4 bg-destructive/20 rounded-full animate-pulse" />
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
