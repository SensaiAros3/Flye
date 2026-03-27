import { cn, getRankColor } from "@/lib/utils"

export function RankBadge({ rank, className }: { rank: string, className?: string }) {
  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center w-6 h-6 rounded-sm border font-display font-bold text-sm tracking-tighter leading-none select-none",
        getRankColor(rank),
        className
      )}
    >
      {rank}
    </span>
  )
}
