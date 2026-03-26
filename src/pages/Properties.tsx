import { PropertyCard } from "@/components/property-card"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Icon from "@/components/ui/icon"

export default function PropertiesPage() {
  const properties = [
    {
      id: "1",
      title: "3-комнатная квартира, вторичка",
      type: "Вторичное жильё",
      address: "ул. Ленина, 42, Екатеринбург",
      price: 7200000,
      bedrooms: 3,
      bathrooms: 1,
      squareFeet: 78,
      yearBuilt: 2005,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "2",
      title: "Коттедж с участком 12 соток",
      type: "Коттедж",
      address: "КП Берёзовый, Свердловская обл.",
      price: 14500000,
      bedrooms: 4,
      bathrooms: 2,
      squareFeet: 185,
      yearBuilt: 2019,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "3",
      title: "1-комнатная квартира, новостройка",
      type: "Новостройка",
      address: "ЖК «Академический», Екатеринбург",
      price: 5800000,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 42,
      yearBuilt: 2024,
      status: "Бронь",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "4",
      title: "Земельный участок под ИЖС",
      type: "Земельный участок",
      address: "пос. Сысерть, Свердловская обл.",
      price: 1800000,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 1200,
      yearBuilt: 0,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "5",
      title: "Жилой дом в черте города",
      type: "Дом",
      address: "ул. Садовая, 18, Берёзовский",
      price: 9500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 140,
      yearBuilt: 2012,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "6",
      title: "2-комнатная квартира с ремонтом",
      type: "Вторичное жильё",
      address: "пр. Космонавтов, 55, Екатеринбург",
      price: 6300000,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 56,
      yearBuilt: 1998,
      status: "Доступно",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Каталог недвижимости</h1>
        <p className="text-muted-foreground">Вторичное жильё, новостройки, коттеджи, дома и земельные участки</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input type="search" placeholder="Поиск по адресу, типу или ключевым словам..." className="w-full pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1 sm:hidden">
            <Icon name="SlidersHorizontal" size={16} />
            Фильтры
          </Button>
          <Tabs defaultValue="grid" className="hidden sm:block">
            <TabsList>
              <TabsTrigger value="grid">
                <Icon name="Grid2X2" size={16} />
              </TabsTrigger>
              <TabsTrigger value="list">
                <Icon name="List" size={16} />
              </TabsTrigger>
              <TabsTrigger value="map">
                <Icon name="MapPin" size={16} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="h-9">
            Сначала новые
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="hidden lg:block">
          <SearchFilters />
        </div>
        <div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Загрузить ещё</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
