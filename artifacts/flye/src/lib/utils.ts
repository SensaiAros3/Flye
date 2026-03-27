import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRankColor(rank: string) {
  switch (rank?.toUpperCase()) {
    case 'S': return 'text-amber-500 border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
    case 'A': return 'text-purple-500 border-purple-500 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
    case 'B': return 'text-blue-500 border-blue-500 bg-blue-500/10';
    case 'C': return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
    case 'D':
    default: return 'text-slate-400 border-slate-500 bg-slate-500/10';
  }
}

export function getRankHexColor(rank: string) {
  switch (rank?.toUpperCase()) {
    case 'S': return '#f59e0b';
    case 'A': return '#a855f7';
    case 'B': return '#3b82f6';
    case 'C': return '#10b981';
    case 'D':
    default: return '#94a3b8';
  }
}

export function getWorkoutColor(type: string) {
  switch (type) {
    case 'gym': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    case 'calisthenics': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    case 'power': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
  }
}
