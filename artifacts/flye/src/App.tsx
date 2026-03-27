import { Switch, Route, Router as WouterRouter } from "wouter"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthPage } from "@/pages/auth"
import { Feed } from "@/pages/feed"
import { CreatePost } from "@/pages/create-post"
import { Leaderboard } from "@/pages/leaderboard"
import { Profile } from "@/pages/profile"
import { Layout } from "@/components/layout"
import { useGetMe } from "@workspace/api-client-react"
import { Activity } from "lucide-react"
import { motion } from "framer-motion"

const queryClient = new QueryClient()

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Activity className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
      </motion.div>
      <p className="mt-6 font-display uppercase tracking-widest text-primary font-bold text-glow text-sm">
        Initializing System...
      </p>
    </div>
  )
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useGetMe({ 
    query: { 
      retry: false,
      refetchOnWindowFocus: false
    } 
  })

  if (isLoading) return <LoadingScreen />
  if (isError || !user) return <AuthPage />

  return <Layout>{children}</Layout>
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-center p-4">
      <div>
        <h1 className="text-6xl font-display font-bold text-destructive text-glow mb-4">404</h1>
        <p className="font-mono text-muted-foreground uppercase">Area Not Found in System</p>
      </div>
    </div>
  )
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <AuthGuard><Feed /></AuthGuard>
      </Route>
      <Route path="/create">
        <AuthGuard><CreatePost /></AuthGuard>
      </Route>
      <Route path="/leaderboard">
        <AuthGuard><Leaderboard /></AuthGuard>
      </Route>
      <Route path="/profile">
        <AuthGuard><Profile /></AuthGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App;
