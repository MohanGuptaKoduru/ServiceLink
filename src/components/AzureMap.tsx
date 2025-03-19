import { useEffect, useRef } from 'react';
import * as atlas from 'azure-maps-control';

interface AzureMapProps {
  technicianaddress: string;
  customerAddress: string;
}

interface GeocodeResult {
  results: { position: { lat: number; lon: number } }[];
}

interface RouteResult {
  routes: {
    legs: {
      points: { latitude: number; longitude: number }[];
    }[];
  }[];
}

const AzureMap = ({ technicianaddress, customerAddress }: AzureMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<atlas.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    mapInstance.current = new atlas.Map(mapRef.current, {
      center: [-122.135, 47.65], // Default center
      zoom: 12,
      style: 'grayscale_dark',
      view: 'Auto',
      authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey: '7Ip9Q6ncAZgprlscLgTeUDZxc7p6kLy7L3hjpMz2H8aQlNoIzTxfJQQJ99BCACYeBjFOYEqrAAAgAZMPVaZn', // Replace with your actual key
      },
    });

    // Handle missing images
    mapInstance.current.events.add('styleimagemissing', (e: any) => {
      const { id } = e;
      console.warn(`Image "${id}" is missing. Add it using map.addImage().`);
    });

    // Wait until the map resources are ready
    mapInstance.current.events.add('ready', async () => {
      const geocodeUrl = 'https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=7Ip9Q6ncAZgprlSfLgTeUDZxc7p6kLy7L3hjpMz2H8aQlNoIzTxfJQQJ99BCACYeBjFOYEqrAAAgAZMPVaZn';

      try {
        // Geocode technician address
        const techResponse = await fetch(`${geocodeUrl}&query=${encodeURIComponent(technicianaddress)}`);
        if (!techResponse.ok) throw new Error('Failed to geocode technician address');
        const techData: GeocodeResult = await techResponse.json();
        const techCoords = techData.results[0]?.position;

        // Validate technician coordinates
        if (!techCoords || isNaN(techCoords.lat) || isNaN(techCoords.lon)) {
          throw new Error('Invalid technician coordinates');
        }
        console.log('Technician Coordinates:', techCoords);

        // Geocode customer address
        const custResponse = await fetch(`${geocodeUrl}&query=${encodeURIComponent(customerAddress)}`);
        if (!custResponse.ok) throw new Error('Failed to geocode customer address');
        const custData: GeocodeResult = await custResponse.json();
        const custCoords = custData.results[0]?.position;

        // Validate customer coordinates
        if (!custCoords || isNaN(custCoords.lat) || isNaN(custCoords.lon)) {
          throw new Error('Invalid customer coordinates');
        }
        console.log('Customer Coordinates:', custCoords);

        // Calculate route using Azure Maps Route Directions API
        const routeUrl = `https://atlas.microsoft.com/route/directions/json?api-version=1.0&subscription-key=7Ip9Q6ncAZgprlSLgTeUDZxc7p6kjLy7L3hjpMz2H8aQlNoIzTxfJQQJ99BCACYeBjFOYEqrAAAgAZMPVaZn&query=${techCoords.lat},${techCoords.lon}:${custCoords.lat},${custCoords.lon}`;
        const routeResponse = await fetch(routeUrl);
        if (!routeResponse.ok) throw new Error('Failed to calculate route');
        const routeData: RouteResult = await routeResponse.json();
        console.log('Route Data:', routeData);

        // Validate route data
        if (!routeData.routes || !routeData.routes[0]?.legs[0]?.points) {
          throw new Error('Invalid route data');
        }

        // Create a data source and add it to the map
        const datasource = new atlas.source.DataSource();
        mapInstance.current?.sources.add(datasource);

        // Convert route points to LineString
        const routePoints = routeData.routes[0].legs[0].points.map((p) => [p.longitude, p.latitude]);
        const routeLine = new atlas.data.Feature(new atlas.data.LineString(routePoints));
        datasource.add(routeLine);

        // Create a line layer to render the route
        mapInstance.current?.layers.add(
          new atlas.layer.LineLayer(datasource, null, {
            strokeColor: 'blue',
            strokeWidth: 5,
          })
        );

        // Add markers for technician and customer locations
        const techMarker = new atlas.data.Feature(new atlas.data.Point([techCoords.lon, techCoords.lat]), {
          title: 'Technician',
        });
        const custMarker = new atlas.data.Feature(new atlas.data.Point([custCoords.lon, custCoords.lat]), {
          title: 'Customer',
        });

        datasource.add([techMarker, custMarker]);

        const markerLayer = new atlas.layer.SymbolLayer(datasource, null, {
          iconOptions: {
            image: 'pin-round-blue', // Use a built-in icon
          },
          textOptions: {
            textField: ['get', 'title'], // Display the title (Technician/Customer)
            offset: [0, -1.5], // Adjust text position
          },
        });
        mapInstance.current?.layers.add(markerLayer);

        // Fit the map to the route
        const bounds = atlas.data.BoundingBox.fromData(routeLine);
        mapInstance.current?.setCamera({ bounds, padding: 50 });
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.dispose();
      }
    };
  }, [technicianaddress, customerAddress]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default AzureMap;