import { useEffect, useState } from "react";

// 사용자의 위치를 가져오는 커스텀 훅

type useCoordsState = {
  latitude: number | null;
  longitude: number | null;
};

const useCoords = () => {
  const [coords, setCoords] = useState<useCoordsState>({
    latitude: null,
    longitude: null,
  });

  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCoords({ latitude, longitude });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);
  return coords;
};

export default useCoords;
