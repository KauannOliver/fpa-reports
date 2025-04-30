import { LoginForm } from "@/components/login/login-form"
import { Logo } from "@/components/logo"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Verificar se o usuário já está autenticado
  const user = await getCurrentUser()
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Seção de boas-vindas - visível apenas em telas médias e maiores */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-fpa-navy to-fpa-blue p-8 text-white flex-col justify-between">
        <div className="max-w-md mx-auto mt-20">
          {/*<Logo className="w-32 h-auto mb-6" />*/}

          <h1 className="text-3xl font-bold mb-6 animate-slide-up">Sistema de Relatórios FP&A</h1>

          <p className="text-lg opacity-90 mb-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Bem-vindo à plataforma centralizada de relatórios financeiros da Expresso Nepomuceno.
          </p>

          <p className="opacity-80 animate-slide-up" style={{ animationDelay: "200ms" }}>
            Acesse indicadores financeiros, análises de desempenho e relatórios gerenciais em um só lugar.
          </p>

          <div className="mt-12 space-y-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Acesso Seguro</h3>
                <p className="text-sm opacity-80">Dados protegidos e acesso controlado</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Relatórios Dinâmicos</h3>
                <p className="text-sm opacity-80">Visualize dados em tempo real</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Acesso Responsivo</h3>
                <p className="text-sm opacity-80">Disponível em qualquer dispositivo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm opacity-70 mt-8">
          © {new Date().getFullYear()} FP&A Expresso Nepomuceno. Todos os direitos reservados.
        </div>
      </div>

      {/* Seção de login */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo visível apenas em telas pequenas */}
          <div className="md:hidden flex justify-center mb-8">
            <Logo className="w-48 h-auto" />
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Acesso ao Sistema</h2>
                <p className="text-gray-600 mt-1">Entre com suas credenciais para continuar</p>
              </div>

              <LoginForm />
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Problemas para acessar? Entre em contato com o 
                <a
                  href="mailto:kauantavares@expressonepomuceno.com.br"
                  className="text-fpa-blue hover:text-blue-700 font-medium"
                > 
                  suporte técnico
                </a>
              </p>
            </div>
          </div>

          {/* Copyright em telas pequenas */}
          <div className="md:hidden text-center text-xs text-gray-500 mt-8">
            © {new Date().getFullYear()} FP&A Expresso Nepomuceno
          </div>
        </div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-5 animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-fpa-navy rounded-full opacity-5 animate-pulse-slow"></div>
    </div>
  )
}
