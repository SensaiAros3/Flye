import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useLocation } from "wouter"
import { Dumbbell, MapPin, AlignLeft } from "lucide-react"
import { useCreatePost, getGetPostsQueryKey, getGetMeQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const createSchema = z.object({
  workoutType: z.enum(["calisthenics", "gym", "power"], {
    required_error: "Select a workout type",
  }),
  description: z.string().min(5, "Description too short").max(500, "Too long"),
  location: z.string().max(100).optional(),
})

export function CreatePost() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { mutate: createPost, isPending } = useCreatePost()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { workoutType: "gym" }
  })

  const selectedType = watch("workoutType")

  const onSubmit = (data: z.infer<typeof createSchema>) => {
    createPost({ data }, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
        
        if (res.leveledUp) {
          toast({ title: "RANK UP!", description: `Advanced to Rank ${res.newRank}`, variant: "epic" })
        } else {
          toast({ title: "Quest Registered", description: `You gained +${res.xpGained} XP` })
        }
        setLocation("/")
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" })
      }
    })
  }

  const types = [
    { id: "gym", label: "Gym", color: "text-blue-400 border-blue-400" },
    { id: "calisthenics", label: "Calisthenics", color: "text-emerald-400 border-emerald-400" },
    { id: "power", label: "Power", color: "text-orange-400 border-orange-400" },
  ] as const

  return (
    <div className="pb-12">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <h1 className="text-xl font-display font-bold tracking-widest text-primary text-glow">CREATE QUEST</h1>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Type Selector */}
          <div className="space-y-3">
            <label className="text-xs font-display uppercase tracking-widest text-muted-foreground font-bold">Discipline</label>
            <div className="grid grid-cols-3 gap-2">
              {types.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setValue("workoutType", t.id)}
                  className={cn(
                    "h-12 border rounded-sm font-display font-bold text-sm tracking-wider uppercase transition-all clip-edges",
                    selectedType === t.id 
                      ? `${t.color} bg-${t.color.split('-')[1]}-500/10 shadow-[0_0_15px_currentColor]`
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {errors.workoutType && <p className="text-xs text-destructive">{errors.workoutType.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-display uppercase tracking-widest text-muted-foreground font-bold">
              <AlignLeft className="w-4 h-4" /> Objective Details
            </label>
            <Textarea 
              {...register("description")} 
              placeholder="What did you conquer today?" 
              className="h-32 bg-black/40 border-white/10 focus-visible:border-primary font-sans"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-display uppercase tracking-widest text-muted-foreground font-bold">
              <MapPin className="w-4 h-4" /> Location Zone (Optional)
            </label>
            <Input 
              {...register("location")} 
              placeholder="e.g. Iron Temple" 
              className="bg-black/40 border-white/10 focus-visible:border-primary font-mono"
            />
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
          </div>

          <Button type="submit" variant="gaming" size="lg" className="w-full mt-4" disabled={isPending}>
            {isPending ? "Transmitting..." : "Initialize Quest"}
          </Button>
        </form>
      </div>
    </div>
  )
}
