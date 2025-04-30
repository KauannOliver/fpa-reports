import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default async function Home() {
  const user = await getCurrentUser()

  if (user) {
    // Se o usuário estiver autenticado, redirecionar para o dashboard
    redirect("/dashboard")
  } else {
    // Se não estiver autenticado, redirecionar para a página de login
    redirect("/login")
  }
}
