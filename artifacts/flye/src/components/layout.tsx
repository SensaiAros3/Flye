import { Link, useLocation } from "wouter"
import { Home, PlusSquare, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()

  const navItems = [
    { href: "/", icon: Home, label: "Feed" },
    { href: "/create", icon: PlusSquare, label: "Post" },
    { href: "/leaderboard", icon: Trophy, label: "Ranks" },
    { href: "/profile", icon: User, label: "System" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-primary/30">
      <main className="max-w-md mx-auto min-h-screen w-full border-x border-border/30 bg-black/20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = location === href
            return (
              <Link 
                key={href} 
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground transition-all duration-300",
                  isActive && "text-primary scale-110"
                )}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,1)]" />
                  )}
                </div>
                <span className="text-[10px] font-display uppercase tracking-widest font-bold opacity-0 hidden">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
