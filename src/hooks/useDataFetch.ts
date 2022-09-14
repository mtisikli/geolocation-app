import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

export interface ApiResponse {
  osmData: any;
  loading: boolean;
  error: string;
}

const useDataFetch = (bBoxString: string | null): ApiResponse => {
  const [osmData, setOsmData] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        setloading(true);
        const res = await axios.get(
          `https://www.openstreetmap.org/api/0.6/map?bbox=${bBoxString}`
        );
        setOsmData(res.data);
      } catch (err) {
        const { message } = err as AxiosError;
        setError(message);
      } finally {
        setloading(false);
      }
    };

    if (bBoxString) {
      makeRequest();
    }
  }, [bBoxString]);

  return { osmData, loading, error };
};

export default useDataFetch;
