import { motion } from "framer-motion";

interface GameStatsProps {
  stats: {
    wins: number;
    losses: number;
    ties: number;
    total: number;
    winRate: number;
  };
}

export function GameStats({ stats }: GameStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto mt-12">
      <StatBox label="WINS" value={stats.wins} color="text-primary" delay={0.1} />
      <StatBox label="LOSSES" value={stats.losses} color="text-destructive" delay={0.2} />
      <StatBox label="TIES" value={stats.ties} color="text-secondary" delay={0.3} />
      <StatBox 
        label="WIN RATE" 
        value={`${stats.winRate.toFixed(1)}%`} 
        color={stats.winRate > 50 ? "text-accent" : "text-muted-foreground"} 
        delay={0.4} 
      />
    </div>
  );
}

function StatBox({ label, value, color, delay }: { label: string; value: string | number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg clip-diagonal relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-xs font-mono text-muted-foreground mb-1 tracking-widest">{label}</div>
      <div className={`text-4xl font-bold font-display ${color} text-glow`}>
        {value}
      </div>
    </motion.div>
  );
}
