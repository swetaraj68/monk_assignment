import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Spin } from "antd";
import useProductList from "../hooks/useProductList";
import ProductListSelector from "./ProductListSelector";
import "./ProductPicker.css";

const ProductPicker = forwardRef((props, ref) => {
  const [selectedProducts, setSelectedProducts] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [resetSignal, setResetSignal] = useState(false);
  const { data, loading, error, hasMore } = useProductList(search, page);
  const [productList, setProductList] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (page === 1) {
      setProductList(data);
    } else if (data.length > 0) {
      setProductList((prev) => [...prev, ...data]);
    }
  }, [data]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelectionChange = (productId, selectedVariants) => {
    setSelectedProducts((prev) => {
      const updatedProducts = { ...prev, [productId]: selectedVariants };

      const productCount = Object.values(updatedProducts).filter(
        (variants) => variants.length > 0
      ).length;

      props.onSelectionCountChange(productCount);

      return updatedProducts;
    });
  };

  const handleSubmit = () => {
    const result = productList
      ?.filter((product) => selectedProducts[product.id]?.length > 0)
      .map((product) => ({
        id: product.id,
        title: product.title,
        variants: selectedProducts[product.id],
      }));

    setSelectedProducts({});
    setResetSignal(!resetSignal);
    setPage(1);
    setSearch("");
    return result;
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  const handleScroll = () => {
    if (!hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="product-picker">
      <div
        style={{
          borderBottom: "1px solid #ccc",
          borderTop: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <Input
          className="search-input"
          addonBefore={<SearchOutlined />}
          placeholder="Search Product"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div
        className="product-list"
        ref={containerRef}
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {productList.length > 0
          ? productList.map((product) => (
              <div className="product-item" key={product.id}>
                <ProductListSelector
                  product={product}
                  onSelectionChange={handleSelectionChange}
                  reset={resetSignal}
                />
              </div>
            ))
          : !loading && <p className="status-message">No products found</p>}
        {loading && (
          <div className="loading-spinner">
            <Spin />
          </div>
        )}
        {error && <p className="status-message">Error: {error}</p>}
      </div>
    </div>
  );
});

export default ProductPicker;
