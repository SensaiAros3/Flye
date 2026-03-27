import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { LogOut, Activity, CalendarDays, Swords } from "lucide-react"
import { RankBadge } from "@/components/rank-badge"
import { XpBar } from "@/components/xp-bar"
import { Button } from "@/components/ui/button"

export function Profile() {
  const { data: user, isLoading } = useGetMe()
  const { mutate: logout } = useLogout()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
      }
    })
  }

  if (isLoading) return <div className="p-8 text-center font-display tracking-widest animate-pulse text-muted-foreground">Loading Player Data...</div>
  if (!user) return null

  return (
    <div className="pb-12 min-h-screen bg-black/40">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50 p-4 flex justify-between items-center">
        <h1 className="text-xl font-display font-bold tracking-widest text-primary text-glow">SYSTEM STATUS</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 space-y-8 mt-4">
        {/* Main Player Card */}
        <div className="relative p-6 border border-white/10 bg-card overflow-hidden clip-edges">
          {/* Decorative abstract elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-md border-2 border-primary/50 bg-black flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <User className="w-10 h-10 text-primary" />
            </div>
            
            <div>
              <h2 className="text-3xl font-display font-bold tracking-widest text-white">{user.username}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground font-mono uppercase">Current Rank:</span>
                <RankBadge rank={user.rank} className="shadow-lg" />
                <span className="text-xs font-display tracking-widest font-bold text-primary">{user.rankLabel}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
            <XpBar 
              currentXp={user.xp} 
              nextRankXp={user.xpForNextRank} 
              progress={user.xpProgress} 
              rank={user.rank} 
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-white/5 bg-card/50 clip-edges flex flex-col items-center justify-center text-center">
            <Swords className="w-6 h-6 text-primary mb-2 opacity-80" />
            <div className="text-2xl font-display font-bold text-white">{user.totalWorkouts}</div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Quests Completed</div>
          </div>
          
          <div className="p-4 border border-white/5 bg-card/50 clip-edges flex flex-col items-center justify-center text-center">
            <CalendarDays className="w-6 h-6 text-emerald-500 mb-2 opacity-80" />
            <div className="text-sm font-display font-bold text-white mt-1">
              {format(new Date(user.createdAt), "MMM d, yyyy")}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase mt-1">Awakening Day</div>
          </div>
        </div>

        {/* System Message */}
        <div className="p-4 border border-primary/20 bg-primary/5 text-primary text-sm font-mono leading-relaxed clip-edges shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
          <span className="font-bold text-glow">{"> SYSTEM NOTICE:"}</span><br />
          Keep completing quests to gain Experience Points. Higher ranks unlock greater prestige. The path to S-Rank requires relentless dedication.
        </div>
      </div>
    </div>
  )
}

function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
