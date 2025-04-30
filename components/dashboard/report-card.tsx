"use client"

import { useState } from "react"
import type { Report } from "@/lib/reports"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Clock, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

/* -------------------------------------------------------------------------- */
/*  Util: converte "2025-04-26T13:00:00Z" ➜ "26/04/2025"                      */
/*  (pura string, sem fuso → evita erro de hidratação)                        */
function formatDateBR(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-") // YYYY-MM-DD
  return `${d}/${m}/${y}`
}

/* -------------------------------------------------------------------------- */
interface ReportCardProps {
  report: Report
  viewMode: "grid" | "list"
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function ReportCard({
  report,
  viewMode,
  isFavorite,
  onToggleFavorite,
}: ReportCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  /* Data vinda do banco (criado_em) */
  const formattedDate = formatDateBR(report.criado_em)

  /* ---------------------------------------------------------------------- */
  /*  LIST VIEW                                                             */
  /* ---------------------------------------------------------------------- */
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md card-hover-effect">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fpa-navy">
                  {report.titulo}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {report.descricao}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isFavorite
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "text-muted-foreground",
                )}
                onClick={(e) => {
                  e.preventDefault()
                  onToggleFavorite()
                }}
              >
                <Star className="h-5 w-5 fill-current" />
                <span className="sr-only">Favoritar</span>
              </Button>
            </div>

            <div className="flex items-center mt-4 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Atualizado em: {formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-end p-4 bg-gray-50">
            <Button
              variant="default"
              size="sm"
              className="bg-fpa-blue hover:bg-blue-600"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Expandir</span>
            </Button>
          </div>
        </div>

        {/* ─────────────────── modal tela-cheia */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>{report.titulo}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-[80vh]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fpa-blue mb-4" />
                    <p className="text-sm text-muted-foreground">Carregando relatório...</p>
                  </div>
                </div>
              )}
              <iframe
                src={report.url_embed}
                title={report.titulo}
                className="w-full h-full border-0"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }

  /* ---------------------------------------------------------------------- */
  /*  GRID VIEW                                                             */
  /* ---------------------------------------------------------------------- */
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md card-hover-effect">
      <CardHeader className="bg-gradient-to-r from-fpa-navy to-fpa-blue text-white p-4 pb-6 relative">
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-white hover:bg-white/20",
              isFavorite && "text-yellow-300",
            )}
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite()
            }}
          >
            <Star className={cn("h-5 w-5", isFavorite && "fill-yellow-300")} />
            <span className="sr-only">Favoritar</span>
          </Button>
        </div>
        <CardTitle className="text-lg">{report.titulo}</CardTitle>
        <CardDescription className="text-white/80 mt-1">
          {report.descricao}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <div className="aspect-video bg-gray-100 rounded-md relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fpa-blue mb-3" />
                <p className="text-sm text-muted-foreground">Carregando prévia...</p>
              </div>
            </div>
          )}
          <iframe
            src={report.url_embed}
            title={report.titulo}
            className="w-full h-full border-0"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </div>

        <div className="flex items-center mt-3 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Atualizado em: {formattedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end bg-gray-50 px-4 py-3">
        <Button
          variant="default"
          size="sm"
          className="bg-fpa-blue hover:bg-blue-600"
          onClick={() => setIsFullscreen(true)}
        >
          <Maximize2 className="h-4 w-4 mr-1" /> Expandir
        </Button>
      </CardFooter>

      {/* ─────────────────── modal tela-cheia */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{report.titulo}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[80vh]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fpa-blue mb-4" />
                  <p className="text-sm text-muted-foreground">Carregando relatório...</p>
                </div>
              </div>
            )}
            <iframe
              src={report.url_embed}
              title={report.titulo}
              className="w-full h-full border-0"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
