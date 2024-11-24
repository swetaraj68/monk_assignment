import React, { useState } from "react";
import { Checkbox, Divider } from "antd";
import "./ProductListSelector.css";

const CheckboxGroup = Checkbox.Group;

const ProductListSelector = ({ product, onSelectionChange, reset }) => {
  const [checkedList, setCheckedList] = useState([]);
  const checkAll = product.variants.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < product.variants.length;

  const onChange = (selectedTitles) => {
    const selectedVariants = product.variants.filter((variant) =>
      selectedTitles.includes(variant.title)
    );
    setCheckedList(selectedTitles);
    onSelectionChange(product.id, selectedVariants); 
  };

  const onCheckAllChange = (e) => {
    const selectedVariants = e.target.checked ? product.variants : [];
    setCheckedList(selectedVariants.map((variant) => variant.title));
    onSelectionChange(product.id, selectedVariants); 
  };

  
  React.useEffect(() => {
    if (reset) {
      setCheckedList([]);
    }
  }, [reset]);

  return (
    <div>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        {product.title}
      </Checkbox>
      <Divider style={{ margin: "6px 0px" }} />
      <CheckboxGroup value={checkedList} onChange={onChange}>
      {product.variants.map((variant) => (
  <div
    style={{
      marginLeft: "2vw",
      width: "100%",
      marginBottom: "5px",
      padding: "10px",
      alignSelf: "center",
    }}
    key={variant.id}
  >
    <Checkbox value={variant.title}>
      <div
        style={{
          display: "flex",
          alignItems: "center", 
          justifyContent: "space-between",
          gap: "80px",
        }}
      >
        <p style={{ margin: 0 }}>{variant.title}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <p style={{ margin: 0 }}>
            {variant.inventory_quantity
              ? `${variant.inventory_quantity} available`
              : null}
          </p>
          <p style={{ margin: 0 , float : "right" }}>{variant.price ? `$${variant.price}` : null}</p>
        </div>
      </div>
    </Checkbox>
  </div>
))}

      </CheckboxGroup>
    </div>
  );
};

export default ProductListSelector;
