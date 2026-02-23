import { useState } from "react";
import { usePlayGame, useResetGame } from "@/hooks/use-game";
import { PlayArea } from "@/components/PlayArea";
import { GameStats } from "@/components/GameStats";
import { MoveIcon } from "@/components/MoveIcon";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { type Move, type GameOutcome } from "@shared/schema";
import { RefreshCcw, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GameState {
  playerMove: Move | null;
  botMove: Move | null;
  result: GameOutcome | null;
  stats: {
    wins: number;
    losses: number;
    ties: number;
    total: number;
    winRate: number;
  };
}

export default function Home() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    playerMove: null,
    botMove: null,
    result: null,
    stats: { wins: 0, losses: 0, ties: 0, total: 0, winRate: 0 }
  });

  const playMutation = usePlayGame();
  const resetMutation = useResetGame();

  const handleMove = (move: Move) => {
    // Optimistic UI update could happen here, but since backend determines bot move,
    // we just show loading state on the PlayArea
    playMutation.mutate(move, {
      onSuccess: (data) => {
        setGameState(data);
      },
      onError: () => {
        toast({
          title: "System Error",
          description: "Could not process move. AI core unresponsive.",
          variant: "destructive",
        });
      }
    });
  };

  const handleReset = () => {
    resetMutation.mutate(undefined, {
      onSuccess: () => {
        setGameState({
          playerMove: null,
          botMove: null,
          result: null,
          stats: { wins: 0, losses: 0, ties: 0, total: 0, winRate: 0 }
        });
        toast({
          title: "System Reset",
          description: "Memory banks cleared. Ready for new sequence.",
        });
      }
    });
  };

  const controls = [
    { move: "R" as Move, label: "ROCK", color: "from-pink-500 to-purple-600", hoverShadow: "hover:shadow-pink-500/50" },
    { move: "P" as Move, label: "PAPER", color: "from-cyan-400 to-blue-600", hoverShadow: "hover:shadow-cyan-400/50" },
    { move: "S" as Move, label: "SCISSORS", color: "from-green-400 to-emerald-600", hoverShadow: "hover:shadow-green-400/50" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-accent" />
          <span className="text-xs font-mono text-accent tracking-[0.3em]">RANKED_MATCH_V1.0</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary text-glow drop-shadow-2xl">
          R.P.S. <span className="text-white/20">ARENA</span>
        </h1>
        <p className="font-mono text-muted-foreground mt-4 max-w-md mx-auto">
          Engage in probabilistic combat against the AI Neural Net.
          Select your weapon below.
        </p>
      </motion.div>

      {/* Main Game Area */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="z-10 w-full flex flex-col items-center gap-8"
      >
        <PlayArea 
          playerMove={gameState.playerMove}
          botMove={gameState.botMove}
          result={gameState.result}
          isPending={playMutation.isPending}
        />

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {controls.map((control, idx) => (
            <motion.button
              key={control.move}
              disabled={playMutation.isPending}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMove(control.move)}
              className={`
                group relative px-8 py-6 rounded-xl overflow-hidden
                bg-card border border-white/10 backdrop-blur-xl
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
                ${control.hoverShadow} hover:shadow-2xl hover:border-white/30
              `}
            >
              {/* Button Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${control.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="flex flex-col items-center gap-3 relative z-10">
                <MoveIcon move={control.move} className="w-8 h-8 md:w-10 md:h-10 text-foreground group-hover:text-white transition-colors" />
                <span className="text-xs font-bold font-display tracking-widest text-muted-foreground group-hover:text-white transition-colors">
                  {control.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats & Footer */}
      <GameStats stats={gameState.stats} />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 z-10"
      >
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={resetMutation.isPending || gameState.stats.total === 0}
          className="border-white/10 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
        >
          <RefreshCcw className={`w-4 h-4 mr-2 ${resetMutation.isPending ? 'animate-spin' : ''}`} />
          RESET SYSTEM MEMORY
        </Button>
      </motion.div>

    </div>
  );
}
