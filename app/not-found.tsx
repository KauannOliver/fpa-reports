import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <Logo className="w-64 h-auto mb-8" />
      <h1 className="text-4xl font-bold text-fpa-navy mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-fpa-navy mb-4">Página não encontrada</h2>
      <p className="text-muted-foreground mb-6 max-w-md">A página que você está procurando não existe ou foi movida.</p>
      <Link href="/">
        <Button className="bg-fpa-blue hover:bg-blue-600">Voltar para a página inicial</Button>
      </Link>
    </div>
  )
}
