import { useGetLeaderboard } from "@workspace/api-client-react"
import { motion } from "framer-motion"
import { Trophy, Swords } from "lucide-react"
import { RankBadge } from "@/components/rank-badge"

export function Leaderboard() {
  const { data: leaders, isLoading, isError } = useGetLeaderboard({ limit: 50 })

  if (isLoading) return <div className="p-8 text-center font-display tracking-widest animate-pulse text-muted-foreground">Scanning Ranks...</div>
  if (isError) return <div className="p-8 text-center font-display tracking-widest text-destructive">Failed to retrieve rankings.</div>

  return (
    <div className="pb-12 min-h-screen bg-black/40">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50 p-4 pb-6 flex flex-col items-center justify-center text-center">
        <Trophy className="w-10 h-10 text-amber-500 mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
        <h1 className="text-2xl font-display font-bold tracking-widest text-amber-500 text-glow">HALL OF FAME</h1>
        <p className="text-xs font-mono text-muted-foreground uppercase mt-1">Top Players By Experience</p>
      </div>

      <div className="p-4 space-y-3">
        {leaders?.map((player, index) => {
          const isTop3 = index < 3;
          return (
            <motion.div
              key={player.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-4 border clip-edges transition-all ${
                index === 0 ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02] my-4' : 
                index === 1 ? 'bg-slate-300/10 border-slate-300/50' :
                index === 2 ? 'bg-orange-800/20 border-orange-800/50' :
                'bg-card border-border/30 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`font-display font-bold text-xl w-6 text-center ${
                  index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-orange-400' : 'text-muted-foreground'
                }`}>
                  #{player.rank}
                </div>
                
                <RankBadge rank={player.userRank} />
                
                <div>
                  <div className={`font-display font-bold tracking-widest ${isTop3 ? 'text-base' : 'text-sm'}`}>
                    {player.username}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                    <Swords className="w-3 h-3" /> {player.totalWorkouts} Quests
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-display font-bold tracking-widest ${isTop3 ? 'text-primary text-glow' : 'text-muted-foreground'}`}>
                  {player.xp.toLocaleString()} XP
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
