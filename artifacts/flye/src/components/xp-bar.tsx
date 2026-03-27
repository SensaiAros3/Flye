import { motion } from "framer-motion"
import { getRankHexColor } from "@/lib/utils"

interface XpBarProps {
  currentXp: number
  nextRankXp: number
  progress: number
  rank: string
  label?: string
}

export function XpBar({ currentXp, nextRankXp, progress, rank, label }: XpBarProps) {
  const color = getRankHexColor(rank)
  const isMaxed = rank === 'S'
  const displayProgress = isMaxed ? 100 : Math.min(Math.max(progress, 0), 100)

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end text-sm font-display uppercase tracking-widest font-bold text-muted-foreground">
        <span>{label || "EXPERIENCE"}</span>
        <span className="text-foreground" style={{ color, textShadow: `0 0 10px ${color}80` }}>
          {currentXp} {isMaxed ? 'XP (MAX)' : `/ ${nextRankXp} XP`}
        </span>
      </div>
      
      <div className="h-4 w-full bg-black/50 border border-white/10 p-[2px] clip-edges overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full relative"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 20px ${color}`
          }}
        >
          {/* Animated glow sweep */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>
    </div>
  )
}
