import { MapContainer, TileLayer, FeatureGroup, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import osmtogeojson from "osmtogeojson";
import useOnClickOutside from "../../hooks/useOutsideAlerter";
import "leaflet-draw/dist/leaflet.draw.css";

const Map = () => {
  const [bBox, setBBox] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);
  const wrapperRef = useRef(null);

  console.log(geoJsonData);

  const clickOutsideHandler = () => {
    if (bBox) setBBox(null);
  };

  useOnClickOutside(wrapperRef, clickOutsideHandler);

  useEffect(() => {
    if (bBox) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://www.openstreetmap.org/api/0.6/map?bbox=${bBox}`
          );
          setGeoJsonData(osmtogeojson(response.data));
        } catch (error) {
          const { response } = error as AxiosError;
          setError(response?.data);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [bBox]);

  const handleCreatePolygon = (e: any) => {
    const polygonBBOX = e.layer.getBounds().toBBoxString();
    setBBox(polygonBBOX);
  };

  const handleDeletePolygon = () => {
    setBBox(null);
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

            {geoJsonData &&
              geoJsonData.features.map((feature: any, index: number) => (
                <div key={feature.id}>
                  <p className="font-semibold">{index + 1}</p>
                  <p>
                    <span className="font-semibold">Type: </span>
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
          </Popup>
        </div>
      </FeatureGroup>
    </MapContainer>
  );
};

export default Map;
