import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"

interface SettingsSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  timeLimit: string
  customTime: string
  onTimeLimitChange: (time: string) => void
  onCustomTimeChange: (time: string) => void
  mode: "click" | "spacebar"
  onModeChange: (mode: "click" | "spacebar") => void
}

export function SettingsSidebar({
  open,
  onOpenChange,
  timeLimit,
  customTime,
  onTimeLimitChange,
  onCustomTimeChange,
  mode,
  onModeChange,
}: SettingsSidebarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Test Mode</h3>
            <div className="flex rounded-md shadow-sm">
              <Button
                variant={mode === "click" ? "default" : "outline"}
                className="w-full rounded-r-none"
                onClick={() => onModeChange("click")}
              >
                Click Test
              </Button>
              <Button
                variant={mode === "spacebar" ? "default" : "outline"}
                className="w-full rounded-l-none"
                onClick={() => onModeChange("spacebar")}
              >
                Spacebar Test
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Time Limit</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 5, 10, 30, 60].map((seconds) => (
                <Button
                  key={seconds}
                  variant={timeLimit === String(seconds) ? "default" : "outline"}
                  onClick={() => {
                    onTimeLimitChange(String(seconds))
                    onCustomTimeChange("")
                  }}
                >
                  {seconds}s
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom time (seconds)"
              value={customTime}
              onChange={(e) => {
                onCustomTimeChange(e.target.value)
                if (e.target.value) {
                  onTimeLimitChange("custom")
                }
              }}
              min="1"
              max="3600"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Theme</h3>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              {theme === "light" ? "Light" : "Dark"} Mode
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

