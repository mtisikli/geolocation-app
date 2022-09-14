import { MapContainer, TileLayer, FeatureGroup, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useEffect, useRef, useState } from "react";
import osmtogeojson from "osmtogeojson";
import useOnClickOutside from "../../hooks/useOutsideAlerter";
import "leaflet-draw/dist/leaflet.draw.css";
import useDataFetch from "../../hooks/useDataFetch";

const Map = () => {
  const [bBoxString, setBBoxString] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const wrapperRef = useRef(null);

  const clickOutsideHandler = () => {
    if (bBoxString) setBBoxString(null);
  };

  const { osmData, loading, error } = useDataFetch(bBoxString);
  useOnClickOutside(wrapperRef, clickOutsideHandler);

  useEffect(() => {
    if (osmData) setGeoJsonData(osmtogeojson(osmData));
  }, [osmData]);

  const handleCreatePolygon = (e: any) => {
    const polygonBBOX = e.layer.getBounds().toBBoxString();
    setBBoxString(polygonBBOX);
  };

  const handleDeletePolygon = () => {
    setBBoxString(null);
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={20}
      scrollWheelZoom={false}
      className="h-5/6"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreatePolygon}
          onDeleted={handleDeletePolygon}
          draw={{
            polyline: false,
            polygon: true,
            rectangle: true,
            marker: false,
            circle: false,
            circlemarker: false,
          }}
        />
        <div ref={wrapperRef}>
          <Popup className="h-96 overflow-scroll">
            {loading && <p>Loading...</p>}
            {typeof error === "string" && <p>{error}</p>}

            {geoJsonData && (
              <div>
                <h3 className="text-xl font-semibold text-center">
                  GeoJSON Features
                </h3>
                {geoJsonData.features.map((feature: any, index: number) => (
                  <div key={feature.id}>
                    <p>
                      <span className="font-semibold">{index + 1}) Type: </span>
                      {feature.geometry.type}
                    </p>
                    <p className="font-semibold">Coordinates:</p>
                    {feature.geometry.coordinates.map(
                      (coordinate: any, index: number) => (
                        <p key={index}>
                          {coordinate[0]} {coordinate[1]}
                        </p>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}
          </Popup>
        </div>
      </FeatureGroup>
    </MapContainer>
  );
};

export default Map;
