import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import Icon from "@/components/ui/icon"

export default function HomePage() {
  const featuredProperties = [
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
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Квартиры, дома, коттеджи и участки
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Вторичное жильё, новостройки, загородные дома и земельные участки — всё в одном месте. Проверенные объекты и честные цены.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/properties">
                  <Button size="lg" className="gap-1.5">
                    <Icon name="Home" size={16} />
                    Смотреть каталог
                  </Button>
                </Link>
                <Link to="/properties/new">
                  <Button size="lg" variant="outline" className="gap-1.5">
                    <Icon name="Plus" size={16} />
                    Подать объявление
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Icon name="CheckCircle" size={16} className="text-primary" />
                  Вторичное жильё
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="CheckCircle" size={16} className="text-primary" />
                  Новостройки
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="CheckCircle" size={16} className="text-primary" />
                  Коттеджи и дома
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="CheckCircle" size={16} className="text-primary" />
                  Земельные участки
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-lg border bg-background p-4 shadow-sm">
                <div className="flex items-center gap-2 pb-4">
                  <Icon name="Filter" size={20} className="text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Быстрый поиск</h2>
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Тип недвижимости
                    </label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="">Любой тип</option>
                      <option value="secondary">Вторичное жильё</option>
                      <option value="newbuilding">Новостройка</option>
                      <option value="cottage">Коттедж</option>
                      <option value="house">Дом</option>
                      <option value="land">Земельный участок</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Цена от
                      </label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Любая</option>
                        <option value="1000000">1 млн</option>
                        <option value="3000000">3 млн</option>
                        <option value="5000000">5 млн</option>
                        <option value="10000000">10 млн</option>
                        <option value="20000000">20 млн</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Цена до
                      </label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Любая</option>
                        <option value="5000000">5 млн</option>
                        <option value="10000000">10 млн</option>
                        <option value="20000000">20 млн</option>
                        <option value="50000000">50 млн</option>
                        <option value="100000000">100+ млн</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Комнат
                      </label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Любое</option>
                        <option value="0">Студия</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Площадь, м²
                      </label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Любая</option>
                        <option value="30">от 30 м²</option>
                        <option value="50">от 50 м²</option>
                        <option value="80">от 80 м²</option>
                        <option value="120">от 120 м²</option>
                        <option value="200">от 200 м²</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Город, район или адрес"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <Link to="/properties">
                    <Button className="w-full">Найти объекты</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 pb-8 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter">Актуальные предложения</h2>
              <p className="text-muted-foreground">Свежие объекты — вторичка, новостройки, коттеджи и участки</p>
            </div>
            <Link to="/properties">
              <Button variant="outline">Смотреть все объекты</Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tighter mb-2">Почему выбирают нас</h2>
            <p className="text-muted-foreground">Работаем с полным спектром недвижимости</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background border">
              <Icon name="Building2" size={32} className="text-primary mb-3" />
              <h3 className="font-semibold mb-1">Вторичное жильё</h3>
              <p className="text-sm text-muted-foreground">Проверенные квартиры с историей и прозрачной документацией</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background border">
              <Icon name="Sparkles" size={32} className="text-primary mb-3" />
              <h3 className="font-semibold mb-1">Новостройки</h3>
              <p className="text-sm text-muted-foreground">Квартиры от застройщиков — с отделкой и без, на любой вкус</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background border">
              <Icon name="Home" size={32} className="text-primary mb-3" />
              <h3 className="font-semibold mb-1">Коттеджи и дома</h3>
              <p className="text-sm text-muted-foreground">Загородная недвижимость — от дач до элитных коттеджей</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background border">
              <Icon name="MapPin" size={32} className="text-primary mb-3" />
              <h3 className="font-semibold mb-1">Земельные участки</h3>
              <p className="text-sm text-muted-foreground">ИЖС, СНТ, сельхозназначение — земля под любые цели</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
