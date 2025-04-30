"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HelpCircle, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SupportButtonProps extends ButtonProps {}

export function SupportButton({ className, variant = "outline", ...props }: SupportButtonProps) {
  const [open, setOpen] = useState(false)

  const contacts = [
    {
      segment: "Bebidas",
      contacts: [
        { name: "Thiago Coelho", email: "thiagocoelho@expressonepomuceno.com.br" },
        { name: "Luis Alves", email: "luisalves@expressonepomuceno.com.br" },
      ],
    },
    {
      segment: "Corporativo",
      contacts: [{ name: "Vinicius Mota", email: "viniciusmota@expressonepomuceno.com.br" }],
    },
    {
      segment: "Florestal",
      contacts: [{ name: "Adilon Campos", email: "adiloncampos@expressonepomuceno.com.br" }],
    },
    {
      segment: "Rodoviário",
      contacts: [{ name: "Elisangela Vicente", email: "elisangelavicente@expressonepomuceno.com.br" }],
    },
    {
      segment: "Suporte Técnico",
      contacts: [{ name: "Kauan Tavares", email: "kauantavares@expressonepomuceno.com.br" }],
    },
  ]

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setOpen(true)}
        className={cn("button-hover-effect", className)}
        {...props}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Suporte
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl">Suporte e Contatos</DialogTitle>
            <DialogDescription>
              Entre em contato com o responsável orçamentário do seu segmento ou com o suporte técnico.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto pr-1 py-4 space-y-4">
            {contacts.map((item) => (
              <Card key={item.segment} className="overflow-hidden">
                <CardHeader className="bg-muted py-3">
                  <CardTitle className="text-base">{item.segment}</CardTitle>
                  {item.segment === "Suporte Técnico" && (
                    <CardDescription>Para problemas técnicos ou bugs no sistema</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  {item.contacts.map((contact) => (
                    <div
                      key={contact.email}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-2"
                    >
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      </div>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-fpa-blue hover:text-blue-700 flex items-center w-fit"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        <span></span>
                      </a>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
