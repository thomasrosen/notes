import * as Location from "expo-location";
import { useCallback, useState } from "react";

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [status, setStatus] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setStatus(status);
    if (status !== "granted") {
      return {
        location: undefined,
        status,
      };
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    return {
      location,
      status,
    };
  }, []);

  return { requestLocation, location, status };
}
