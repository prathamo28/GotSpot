export interface CityInfo {
  name: string;
  lat: number;
  lng: number;
}

export const POLISH_CITIES: Record<string, CityInfo> = {
  Warsaw: { name: 'Warsaw', lat: 52.2297, lng: 21.0122 },
  'Kraków': { name: 'Kraków', lat: 50.0647, lng: 19.945 },
  'Łódź': { name: 'Łódź', lat: 51.7592, lng: 19.455 },
  'Wrocław': { name: 'Wrocław', lat: 51.1079, lng: 17.0385 },
  'Poznań': { name: 'Poznań', lat: 52.4064, lng: 16.9252 },
  'Gdańsk': { name: 'Gdańsk', lat: 54.352, lng: 18.6466 },
  'Szczecin': { name: 'Szczecin', lat: 53.4285, lng: 14.5528 },
  'Bydgoszcz': { name: 'Bydgoszcz', lat: 53.1235, lng: 18.0084 },
  'Lublin': { name: 'Lublin', lat: 51.2465, lng: 22.5684 },
  'Katowice': { name: 'Katowice', lat: 50.2649, lng: 19.0238 },
  'Białystok': { name: 'Białystok', lat: 53.1325, lng: 23.1688 },
  'Gdynia': { name: 'Gdynia', lat: 54.5189, lng: 18.5305 },
  'Częstochowa': { name: 'Częstochowa', lat: 50.8118, lng: 19.1203 },
  'Radom': { name: 'Radom', lat: 51.4027, lng: 21.1471 },
  'Toruń': { name: 'Toruń', lat: 53.0138, lng: 18.5984 },
  'Rzeszów': { name: 'Rzeszów', lat: 50.0413, lng: 21.999 },
  'Olsztyn': { name: 'Olsztyn', lat: 53.7784, lng: 20.4801 },
  'Kielce': { name: 'Kielce', lat: 50.8661, lng: 20.6286 },
  'Opole': { name: 'Opole', lat: 50.6751, lng: 17.9213 },
  'Zielona Góra': { name: 'Zielona Góra', lat: 51.9356, lng: 15.5064 },
};
