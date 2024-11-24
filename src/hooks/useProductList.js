import { useState, useEffect } from "react";
import axiosInstance from "../service/axiosInstance";

const useProductList = (search, page) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          limit: 10,
          apiKey: "72njgfa948d9aS7gs5",
          ...(search && { search }),
          ...(page && { page }),
        };

        const response = await axiosInstance.get("/products/search", { params });
        const products = response.data || [];
        
        setData(products);

        setHasMore(products.length === 10); 
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, page]);

  return { data, loading, error, hasMore };
};

export default useProductList;
