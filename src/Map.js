import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const Map = React.memo(({ coordinates }) => {
    const [map, setMap] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [mapCoordinates, setMapCoordinates] = useState(null);

    const mapStyles = {
        height: '600px',
        width: '100%'
    };


    const defaultCenter = {
        lat: 46.510712 || 0,
        lng: -63.416813 || 0
    };

    const handleMapLoad = (map) => {
        setMap(map);
    };

    const handleMarkerClick = (coordinates) => {
        setSelectedCar(coordinates);
    };

    const handleInfoWindowClose = () => {
        setSelectedCar(null);
    };

    useEffect(() => {
        setMapCoordinates(coordinates);
    }, [coordinates]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=KEY`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            setIsApiLoaded(true);
        };
        script.onerror = () => {
            console.error('Failed to load Google Maps API');
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    if (!isApiLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className='my-9'>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={3}
                center={defaultCenter}
                options={{
                    mapId: '9f2c35df3a8d157e',
                    draggable: false
                }}
                onLoad={handleMapLoad}
            >
                {mapCoordinates && (
                    <Marker
                        position={mapCoordinates}
                        onClick={() => handleMarkerClick(true)}
                        icon={{
                            url: '/images/leaf-logo.svg',
                            scaledSize: new window.google.maps.Size(30, 30)
                        }}
                    />
                )}

                {selectedCar && (
                    <InfoWindow
                        position={mapCoordinates}
                        pixelOffset={{
                            x: 50,
                            y: 30
                        }}
                        onCloseClick={handleInfoWindowClose}
                    >
                        <div>
                            <h3>lat -  {mapCoordinates.lat}</h3>
                            <h3>long  - {mapCoordinates.lng}</h3>
                            <p>CAR</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
});

export default Map;
