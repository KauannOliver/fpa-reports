"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/app/actions"
import { AlertCircle, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  })

  // Validar email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "E-mail é obrigatório"
    if (!emailRegex.test(email)) return "Formato de e-mail inválido"
    return ""
  }

  // Validar senha
  const validatePassword = (password: string) => {
    if (!password) return "Senha é obrigatória"
    if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres"
    return ""
  }

  // Validar formulário
  const validateForm = () => {
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setFormErrors({
      email: emailError,
      password: passwordError,
    })

    return !emailError && !passwordError
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validar formulário antes de enviar
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await login(email, password)

      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(result.error || "Ocorreu um erro ao fazer login.")
      }
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Permitir envio com Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading) {
        const form = document.querySelector("form")
        if (form) form.dispatchEvent(new Event("submit", { cancelable: true }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLoading])

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          E-mail
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Digite seu e-mail corporativo"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (formErrors.email) {
                setFormErrors({ ...formErrors, email: validateEmail(e.target.value) })
              }
            }}
            onBlur={() => setFormErrors({ ...formErrors, email: validateEmail(email) })}
            className={cn(
              "pl-10 w-full transition-all",
              formErrors.email ? "border-red-500 focus-visible:ring-red-500" : "",
            )}
            aria-invalid={!!formErrors.email}
            aria-describedby={formErrors.email ? "email-error" : undefined}
            disabled={isLoading}
          />
        </div>
        {formErrors.email && (
          <p id="email-error" className="text-sm text-red-500 mt-1 animate-fade-in">
            {formErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Senha
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (formErrors.password) {
                setFormErrors({ ...formErrors, password: validatePassword(e.target.value) })
              }
            }}
            onBlur={() => setFormErrors({ ...formErrors, password: validatePassword(password) })}
            className={cn(
              "pl-10 pr-10 w-full transition-all",
              formErrors.password ? "border-red-500 focus-visible:ring-red-500" : "",
            )}
            aria-invalid={!!formErrors.password}
            aria-describedby={formErrors.password ? "password-error" : undefined}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {formErrors.password && (
          <p id="password-error" className="text-sm text-red-500 mt-1 animate-fade-in">
            {formErrors.password}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-11 font-medium bg-gradient-to-r from-fpa-blue to-fpa-navy hover:opacity-90 transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Autenticando...
            </>
          ) : (
            "Acessar Painel"
          )}
        </Button>
      </div>
    </form>
  )
}
