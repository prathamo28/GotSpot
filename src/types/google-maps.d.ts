declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      getZoom(): number;
      panTo(latLng: LatLng | LatLngLiteral): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      styles?: MapTypeStyle[];
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    class Marker {
      constructor(opts: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setTitle(title: string): void;
      setAnimation(animation: Animation | null): void;
      addListener(eventName: string, handler: Function): void;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      optimized?: boolean;
    }

    class InfoWindow {
      constructor(opts: InfoWindowOptions);
      open(map?: Map, anchor?: Marker): void;
      close(): void;
    }

    interface InfoWindowOptions {
      content: string | Element;
      maxWidth?: number;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: Array<{ [key: string]: any }>;
    }

    enum Animation {
      BOUNCE = 1,
      DROP = 2
    }
  }
}
