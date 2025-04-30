import { Card, CardContent } from "@/components/ui/card"
import { FileQuestion } from "lucide-react"
import { SupportButton } from "@/components/dashboard/support-button"

export function EmptyReports() {
  return (
    <Card className="border-dashed border-2 animate-fade-in">
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-fpa-navy mb-2">Nenhum relatório disponível</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Você ainda não possui relatórios atribuídos. Entre em contato com o responsável orçamentário do seu segmento.
        </p>
        <SupportButton variant="default" />
      </CardContent>
    </Card>
  )
}
