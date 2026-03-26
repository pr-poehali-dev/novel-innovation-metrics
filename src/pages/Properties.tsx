import { useState, useEffect } from "react"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Icon from "@/components/ui/icon"

const GET_APARTMENTS_URL = "https://functions.poehali.dev/b1211926-5bce-4e8b-a2a1-2e89b020174b"

interface Apartment {
  id: number
  internal_id: string
  rooms: number | null
  floor: number | null
  floors_total: number | null
  area: number | null
  price: number | null
  building_name: string | null
  building_state: string | null
  building_phase: string | null
  building_section: string | null
  built_year: number | null
  ready_quarter: number | null
  renovation: string | null
  address: string | null
  locality: string | null
  images: string[]
  payment_methods: string | null
}

function roomsLabel(rooms: number | null) {
  if (!rooms) return "Студия"
  if (rooms === 1) return "1-комнатная"
  if (rooms === 2) return "2-комнатная"
  if (rooms === 3) return "3-комнатная"
  return `${rooms}-комнатная`
}

function toProperty(a: Apartment) {
  return {
    id: String(a.id),
    title: `${roomsLabel(a.rooms)} кв. ${a.area ? a.area + " м²" : ""} — ${a.building_name || "Новостройка"}`,
    type: "Новостройка",
    address: a.address || a.locality || "",
    price: a.price || 0,
    bedrooms: a.rooms || 0,
    bathrooms: 1,
    squareFeet: a.area || 0,
    yearBuilt: a.built_year || 0,
    status: "Доступно",
    imageUrl: (a.images?.[0] || "/placeholder.svg?height=300&width=400").replace(/^http:\/\//i, "https://"),
  }
}

export default function PropertiesPage() {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [rooms, setRooms] = useState("")
  const [sortBy, setSortBy] = useState("price_asc")

  const fetchApartments = async (p = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), limit: "12" })
    if (rooms && rooms !== "all") params.set("rooms", rooms)
    if (search) params.set("building_name", search)

    const res = await fetch(`${GET_APARTMENTS_URL}?${params}`)
    const data = await res.json()
    setApartments(data.apartments || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setPage(p)
    setLoading(false)
  }

  useEffect(() => {
    fetchApartments(1)
  }, [rooms])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchApartments(1)
  }

  const sorted = [...apartments].sort((a, b) => {
    if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0)
    if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0)
    if (sortBy === "area_desc") return (b.area || 0) - (a.area || 0)
    return 0
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Каталог новостроек</h1>
        <p className="text-muted-foreground">Найдено {total} квартир в новостройках</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <Icon name="Search" size={16} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск по названию ЖК..."
              className="w-full pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm">Найти</Button>
        </form>

        <div className="flex gap-2">
          <Select value={rooms} onValueChange={setRooms}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Комнаты" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="0">Студия</SelectItem>
              <SelectItem value="1">1-комнатные</SelectItem>
              <SelectItem value="2">2-комнатные</SelectItem>
              <SelectItem value="3">3-комнатные</SelectItem>
              <SelectItem value="4">4+ комнат</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Сначала дешевле</SelectItem>
              <SelectItem value="price_desc">Сначала дороже</SelectItem>
              <SelectItem value="area_desc">По площади</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <Icon name="Home" size={48} className="mx-auto mb-4 opacity-30" />
          <p>Квартиры не найдены</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((apt) => (
              <PropertyCard key={apt.id} property={toProperty(apt)} />
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => fetchApartments(page - 1)}
              >
                Назад
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                {page} / {pages}
              </span>
              <Button
                variant="outline"
                disabled={page >= pages}
                onClick={() => fetchApartments(page + 1)}
              >
                Далее
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}