import { useState, useEffect } from "react";

const useFetchData = (initialUrl) => {
  const [data, setData] = useState({});
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const response = await fetch(url, { signal });
        const json = await response.json();

        if (json.error_id) {
          setIsError(true);
          setIsLoading(false);
          return null;
        }

        setData(json);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return [{ data, isLoading, isError }, setUrl];
};

export default useFetchData;
