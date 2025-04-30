"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function ReportFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSegment, setSelectedSegment] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  const segments = [
    { id: "bebidas", name: "Bebidas" },
    { id: "corporativo", name: "Corporativo" },
    { id: "florestal", name: "Florestal" },
    { id: "rodoviario", name: "Rodoviário" },
  ]

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedSegment("")
  }

  return (
    <Card className="border shadow-sm animate-slide-up">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar relatórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-muted" : ""}
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtrar</span>
            </Button>

            {(searchTerm || selectedSegment) && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-4 animate-fade-in">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Segmento</label>
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os segmentos</SelectItem>
                  {segments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Todos
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Favoritos
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Recentes
                </Badge>
              </div>
            </div>
          </div>
        )}

        {selectedSegment && (
          <div className="mt-4 flex flex-wrap gap-2 animate-fade-in">
            <Badge variant="secondary" className="flex items-center gap-1">
              {segments.find((s) => s.id === selectedSegment)?.name}
              <button onClick={() => setSelectedSegment("")}>
                <X className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
