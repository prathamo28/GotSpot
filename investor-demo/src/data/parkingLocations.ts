export interface ParkingLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'mall' | 'office' | 'street' | 'university' | 'hospital' | 'attraction';
  available: number;
  total: number;
  price: string;
  rating: number;
  features: string[];
}

export const PARKING_LOCATIONS: ParkingLocation[] = [
  // Gdańsk
  {
    id: 'galeria-przymorze',
    name: 'Galeria Przymorze',
    lat: 54.4181,
    lng: 18.5803,
    type: 'mall',
    available: 45,
    total: 200,
    price: '3 PLN/h',
    rating: 4.5,
    features: ['Security', 'Covered', 'Shopping']
  },
  {
    id: 'olivia-centre',
    name: 'Olivia Centre',
    lat: 54.4089,
    lng: 18.5711,
    type: 'mall',
    available: 120,
    total: 400,
    price: '4 PLN/h',
    rating: 4.7,
    features: ['Security', 'EV Charging', 'Shopping']
  },
  {
    id: 'forum-gdansk',
    name: 'Forum Gdańsk',
    lat: 54.3522,
    lng: 18.6466,
    type: 'mall',
    available: 89,
    total: 300,
    price: '4 PLN/h',
    rating: 4.6,
    features: ['Security', 'Covered', 'Shopping']
  },
  {
    id: 'university-gdansk',
    name: 'University of Gdańsk',
    lat: 54.3884,
    lng: 18.6013,
    type: 'university',
    available: 34,
    total: 150,
    price: '2 PLN/h',
    rating: 4.2,
    features: ['Student Discount', 'Security']
  },
  {
    id: 'medical-university',
    name: 'Medical University of Gdańsk',
    lat: 54.3731,
    lng: 18.5914,
    type: 'hospital',
    available: 67,
    total: 200,
    price: '2 PLN/h',
    rating: 4.3,
    features: ['Security', 'Hospital Access']
  },
  {
    id: 'gdansk-zoo',
    name: 'Gdańsk Zoo',
    lat: 54.3994,
    lng: 18.5858,
    type: 'attraction',
    available: 156,
    total: 300,
    price: '3 PLN/h',
    rating: 4.4,
    features: ['Family-friendly', 'Parking']
  },
  {
    id: 'manhattan-center',
    name: 'Manhattan Centre',
    lat: 54.3953,
    lng: 18.5897,
    type: 'office',
    available: 78,
    total: 250,
    price: '5 PLN/h',
    rating: 4.5,
    features: ['Security', 'Covered', 'Office']
  },
  {
    id: 'dworek-olivia',
    name: 'Dworek Olivia',
    lat: 54.4031,
    lng: 18.5736,
    type: 'office',
    available: 112,
    total: 350,
    price: '4 PLN/h',
    rating: 4.3,
    features: ['Security', 'Covered']
  }
];

