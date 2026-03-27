import { useToast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      <AnimatePresence>
        {toasts.map(({ id, title, description, variant }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all mb-4 clip-edges",
              variant === "destructive" 
                ? "border-destructive bg-destructive/20 text-destructive-foreground backdrop-blur-md"
                : variant === "epic"
                ? "border-amber-500 bg-amber-500/20 text-amber-500 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                : "border-primary/50 bg-card/80 backdrop-blur-md text-foreground"
            )}
          >
            <div className="grid gap-1">
              {title && <div className={cn("text-sm font-semibold uppercase tracking-wider font-display", variant === "epic" && "text-xl text-glow")}>{title}</div>}
              {description && <div className="text-sm opacity-90">{description}</div>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
