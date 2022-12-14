import Map from "./components/Map/Map";

const App = () => {
  return (
    <div className="h-screen">
      <p className="font-sans text-4xl text-center py-4 text-gray-500">
        Geolocation App
      </p>
      <Map />
    </div>
  );
};

export default App;
