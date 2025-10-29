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
  busyLevel: 'busy' | 'moderate' | 'free'; // Busy level determines color
}

export const PARKING_LOCATIONS: ParkingLocation[] = [
  // Gdańsk - Oliwa area (busy office/business district) - RED
  {
    id: 'olivia-centre',
    name: 'Olivia Centre',
    lat: 54.4089,
    lng: 18.5711,
    type: 'office',
    available: 15,
    total: 200,
    price: '5 PLN/h',
    rating: 4.7,
    features: ['Security', 'EV Charging', 'Business'],
    busyLevel: 'busy' // RED - very busy
  },
  {
    id: 'olivia-tower',
    name: 'Olivia Tower Parking',
    lat: 54.4105,
    lng: 18.5732,
    type: 'office',
    available: 8,
    total: 150,
    price: '5 PLN/h',
    rating: 4.5,
    features: ['Security', 'Covered', 'Office'],
    busyLevel: 'busy' // RED - very busy
  },
  {
    id: 'dworek-olivia',
    name: 'Dworek Olivia',
    lat: 54.4031,
    lng: 18.5736,
    type: 'office',
    available: 22,
    total: 180,
    price: '4 PLN/h',
    rating: 4.3,
    features: ['Security', 'Covered'],
    busyLevel: 'busy' // RED - very busy
  },
  // Galeria Metropolia area (moderate/free) - GREEN
  {
    id: 'street-metropolia',
    name: 'Street Parking - Grunwaldzka',
    lat: 54.3800,
    lng: 18.5900,
    type: 'street',
    available: 85,
    total: 100,
    price: 'FREE',
    rating: 4.2,
    features: ['Street', 'Free', 'Easy Access'],
    busyLevel: 'free' // GREEN - mostly free
  },
  {
    id: 'galeria-metropolia',
    name: 'Galeria Metropolia Area',
    lat: 54.3850,
    lng: 18.5920,
    type: 'street',
    available: 65,
    total: 120,
    price: '2 PLN/h',
    rating: 4.4,
    features: ['Street', 'Close to Mall', 'Cheap'],
    busyLevel: 'free' // GREEN - mostly free
  },
  // Other locations
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
    features: ['Security', 'Covered', 'Shopping'],
    busyLevel: 'moderate'
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
    features: ['Security', 'Covered', 'Shopping'],
    busyLevel: 'moderate'
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
    features: ['Student Discount', 'Security'],
    busyLevel: 'free' // GREEN - cheap and mostly free
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
    features: ['Security', 'Hospital Access'],
    busyLevel: 'moderate'
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
    features: ['Family-friendly', 'Parking'],
    busyLevel: 'free' // GREEN - not too busy
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
    features: ['Security', 'Covered', 'Office'],
    busyLevel: 'moderate'
  }
];
