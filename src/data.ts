export type Service = {
  id: string
  name: string
  minutes: number
  price: number
  image: string
}

export const services: Service[] = [
  {
    id: 'cut',
    name: 'Coupe homme',
    minutes: 30,
    price: 15,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600',
  },
  {
    id: 'beard',
    name: 'Taille de barbe',
    minutes: 20,
    price: 10,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600',
  },
  {
    id: 'both',
    name: 'Coupe + barbe',
    minutes: 45,
    price: 22,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600',
  },
  {
    id: 'kid',
    name: 'Coupe enfant',
    minutes: 25,
    price: 10,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600',
  },
]