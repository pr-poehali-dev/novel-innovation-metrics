import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Icon from "@/components/ui/icon"

const GET_APARTMENTS_URL = "https://functions.poehali.dev/b1211926-5bce-4e8b-a2a1-2e89b020174b"

interface Apartment {
  id: number
  rooms: number | null
  floor: number | null
  floors_total: number | null
  area: number | null
  living_space: number | null
  kitchen_space: number | null
  price: number | null
  renovation: string | null
  balcony: string | null
  building_name: string | null
  building_state: string | null
  building_phase: string | null
  building_section: string | null
  built_year: number | null
  ready_quarter: number | null
  lift: boolean | null
  parking: string | null
  address: string | null
  locality: string | null
  description: string | null
  images: string[]
  payment_methods: string | null
  advantages: string[] | null
  sales_agent_name: string | null
  sales_agent_phone: string | null
}

function httpsUrl(url: string) {
  return url.replace(/^http:\/\//i, "https://")
}

function roomsLabel(rooms: number | null) {
  if (!rooms) return "Студия"
  if (rooms === 1) return "1-комнатная"
  if (rooms === 2) return "2-комнатная"
  if (rooms === 3) return "3-комнатная"
  return `${rooms}-комнатная`
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price)

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [apt, setApt] = useState<Apartment | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`${GET_APARTMENTS_URL}?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.apartment) {
          setApt(data.apartment)
        } else {
          setNotFound(true)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="aspect-video w-full rounded-lg" />
      </div>
    )
  }

  if (notFound || !apt) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Icon name="Home" size={64} className="mx-auto mb-4 opacity-30" />
        <p className="text-xl font-semibold">Объект не найден</p>
        <Link to="/properties">
          <Button className="mt-4">Вернуться в каталог</Button>
        </Link>
      </div>
    )
  }

  const images = (apt.images || []).map(httpsUrl)
  const title = `${roomsLabel(apt.rooms)} кв. ${apt.area ? apt.area + " м²" : ""}, ${apt.building_name || "Новостройка"}`
  const address = apt.address || apt.locality || ""

  const features: string[] = []
  if (apt.renovation) features.push(`Ремонт: ${apt.renovation}`)
  if (apt.balcony) features.push(`Балкон: ${apt.balcony}`)
  if (apt.floor && apt.floors_total) features.push(`Этаж ${apt.floor} из ${apt.floors_total}`)
  if (apt.kitchen_space) features.push(`Кухня ${apt.kitchen_space} м²`)
  if (apt.living_space) features.push(`Жилая площадь ${apt.living_space} м²`)
  if (apt.lift) features.push("Лифт")
  if (apt.parking) features.push(`Парковка: ${apt.parking}`)
  if (apt.building_phase) features.push(`Корпус: ${apt.building_phase}`)
  if (apt.building_section) features.push(`Секция: ${apt.building_section}`)
  if (apt.payment_methods) features.push(`Оплата: ${apt.payment_methods}`)
  if (apt.advantages) features.push(...apt.advantages)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground">
          <Icon name="Home" size={16} />
          Главная
        </Link>
        <Icon name="ChevronRight" size={16} />
        <Link to="/properties" className="hover:text-foreground">Объекты</Link>
        <Icon name="ChevronRight" size={16} />
        <span className="text-foreground line-clamp-1">{title}</span>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{title}</h1>
          <div className="mb-4 flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-muted-foreground shrink-0" />
            <span>{address}</span>
            {apt.building_state && (
              <Badge variant="outline" className="bg-green-100 text-green-800">{apt.building_state}</Badge>
            )}
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-4 text-muted-foreground">
            {apt.rooms !== null && (
              <div className="flex items-center gap-1">
                <Icon name="Bed" size={20} />
                <span>{apt.rooms} комн.</span>
              </div>
            )}
            {apt.area && (
              <div className="flex items-center gap-1">
                <Icon name="Square" size={20} />
                <span>{apt.area} м²</span>
              </div>
            )}
            {apt.floor && apt.floors_total && (
              <div className="flex items-center gap-1">
                <Icon name="Building" size={20} />
                <span>Этаж {apt.floor}/{apt.floors_total}</span>
              </div>
            )}
            {apt.built_year && (
              <div className="flex items-center gap-1">
                <Icon name="Calendar" size={20} />
                <span>{apt.built_year} г.</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-center">
          {apt.price && <div className="text-3xl font-bold">{formatPrice(apt.price)}</div>}
          <div className="mt-4 flex gap-2">
            <Button size="lg">Связаться</Button>
            <Button size="lg" variant="outline">
              <Icon name="Heart" size={16} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mb-8 grid grid-cols-4 gap-4">
          <div className="col-span-4 aspect-video overflow-hidden rounded-lg lg:col-span-2 lg:row-span-2">
            <img src={images[0]} alt={title} className="h-full w-full object-cover" />
          </div>
          {images.slice(1, 5).map((img, i) => (
            <div key={i} className="col-span-2 aspect-video overflow-hidden rounded-lg sm:col-span-1">
              <img src={img} alt={`${title} ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="mb-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <Tabs defaultValue="description">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="features">Характеристики</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4">
              <h2 className="text-2xl font-semibold">Описание объекта</h2>
              <p className="leading-relaxed text-muted-foreground">
                {apt.description || `${roomsLabel(apt.rooms)} квартира в ЖК «${apt.building_name || "Новостройка"}». Площадь ${apt.area} м². ${apt.floor ? `Этаж ${apt.floor} из ${apt.floors_total}.` : ""}`}
              </p>
            </TabsContent>
            <TabsContent value="features">
              <h2 className="mb-4 text-2xl font-semibold">Характеристики</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-lg">Связаться с агентом</h3>
          {(apt.sales_agent_name || apt.sales_agent_phone) && (
            <div className="mb-4 space-y-2">
              {apt.sales_agent_name && (
                <div className="flex items-center gap-2">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                  <span>{apt.sales_agent_name}</span>
                </div>
              )}
              {apt.sales_agent_phone && (
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-muted-foreground" />
                  <a href={`tel:${apt.sales_agent_phone}`} className="hover:underline">{apt.sales_agent_phone}</a>
                </div>
              )}
            </div>
          )}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Ваше имя"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <input
              type="tel"
              placeholder="Ваш телефон"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <textarea
              rows={3}
              placeholder={`Интересует: ${title}`}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button className="w-full">Отправить заявку</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
