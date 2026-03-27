import { useGetPosts, useLogWorkout, getGetPostsQueryKey, getGetMeQueryKey, getGetLeaderboardQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { Dumbbell, MapPin, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { RankBadge } from "@/components/rank-badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getWorkoutColor } from "@/lib/utils"

export function Feed() {
  const { data: posts, isLoading, isError } = useGetPosts()
  const { mutate: logWorkout, isPending: isWorkingOut } = useLogWorkout()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const handleWorkout = (postId: number) => {
    logWorkout({ postId }, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() })
        
        if (res.leveledUp) {
          toast({ 
            title: "RANK UP ACHIEVED!", 
            description: `You have ascended to Rank ${res.newRank}.`, 
            variant: "epic" 
          })
        } else {
          toast({ 
            title: "Quest Completed", 
            description: `Gained +${res.xpGained} XP` 
          })
        }
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" })
      }
    })
  }

  if (isLoading) return <div className="p-8 text-center font-display tracking-widest animate-pulse text-muted-foreground">Loading Feed Data...</div>
  if (isError) return <div className="p-8 text-center font-display tracking-widest text-destructive">Failed to connect to System.</div>

  return (
    <div className="pb-12">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <h1 className="text-xl font-display font-bold tracking-widest text-primary text-glow">GLOBAL QUESTS</h1>
      </div>

      <div className="p-4 space-y-4">
        {posts?.length === 0 && (
          <div className="text-center p-12 border border-dashed border-white/10 rounded-lg text-muted-foreground font-display tracking-widest">
            No quests available. Create one.
          </div>
        )}

        {posts?.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border/50 clip-edges p-5 hover:border-primary/30 transition-colors shadow-lg shadow-black/50"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <RankBadge rank={post.userRank} />
                <div>
                  <div className="font-display font-bold tracking-widest text-sm text-white">{post.username}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              
              <div className={`px-2 py-1 border text-[10px] font-bold font-display uppercase tracking-widest rounded-sm ${getWorkoutColor(post.workoutType)}`}>
                {post.workoutType}
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4 font-sans leading-relaxed">
              {post.description}
            </p>

            {post.location && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 font-mono">
                <MapPin className="w-3 h-3" />
                {post.location}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-primary text-sm font-display font-bold tracking-widest">
                <Zap className="w-4 h-4" />
                +{post.xpEarned} XP
              </div>
              
              <Button 
                variant="gaming" 
                size="sm"
                onClick={() => handleWorkout(post.id)}
                disabled={isWorkingOut}
                className="h-8 text-xs px-4"
              >
                <Dumbbell className="w-3 h-3 mr-2" />
                Do Workout
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
