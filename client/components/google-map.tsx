import Map from "./map/map";

const GoogleMap = ({
  location = "Dhaka",
  position,
}: {
  position: { lat: number; lng: number };
  location: string;
}) => {
  return (
    <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden relative  z-20">
      <div className=" w-full h-full flex items-center justify-center">
        <Map position={position} />
      </div>
      <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-2 rounded shadow z-[400]">
        <p className="text-sm text-gray-600 dark:text-gray-300">{location}</p>
      </div>
    </div>
  );
};

export default GoogleMap;
