import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CPSTest from "@/components/cps-test"


export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <main className="min-h-screen bg-background text-foreground">
        <CPSTest />
      </main>
    </ThemeProvider>
  )
}

