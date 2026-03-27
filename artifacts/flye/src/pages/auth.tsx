import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLogin, useSignup, getGetMeQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const loginMutation = useLogin()
  const signupMutation = useSignup()
  
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema)
  })

  const onSubmit = (data: z.infer<typeof authSchema>) => {
    const mutation = isLogin ? loginMutation : signupMutation
    
    mutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "System Access Granted", description: `Welcome, Player.` })
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
      },
      onError: (err: any) => {
        toast({ 
          title: "Access Denied", 
          description: err.message || "Invalid credentials", 
          variant: "destructive" 
        })
      }
    })
  }

  const isPending = loginMutation.isPending || signupMutation.isPending

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/auth-bg.png)` }}
      />
      
      {/* Vignette / Vignette effect */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent to-black" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm p-6 sm:p-8"
      >
        <div className="mb-12 text-center flex flex-col items-center">
          <motion.div
            animate={{ 
              boxShadow: ["0 0 20px rgba(59,130,246,0.2)", "0 0 40px rgba(59,130,246,0.6)", "0 0 20px rgba(59,130,246,0.2)"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-sm clip-edges bg-primary/20 border-2 border-primary flex items-center justify-center mb-6"
          >
            <Activity className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-5xl font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
            FLYE
          </h1>
          <p className="text-sm font-display tracking-widest uppercase text-primary font-bold text-glow">
            Player Initiation System
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 clip-edges shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-display uppercase tracking-widest text-muted-foreground font-bold">Player ID</label>
              <Input 
                {...register("username")} 
                placeholder="Enter username" 
                className="bg-black/50 border-white/10 focus-visible:border-primary font-mono"
              />
              {errors.username && <span className="text-xs text-destructive">{errors.username.message}</span>}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-display uppercase tracking-widest text-muted-foreground font-bold">Passcode</label>
              <Input 
                type="password"
                {...register("password")} 
                placeholder="••••••••" 
                className="bg-black/50 border-white/10 focus-visible:border-primary font-mono"
              />
              {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
            </div>

            <Button 
              type="submit" 
              variant="gaming" 
              className="w-full mt-4" 
              disabled={isPending}
            >
              {isPending ? "Connecting..." : isLogin ? "Initialize" : "Awaken"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-display tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "No ID? Register to start" : "Have ID? Initialize system"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
