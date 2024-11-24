import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomModal from "../../components/Modal";

import { RxCross2 } from "react-icons/rx";

import editIcon from "../../assets/images/edit.svg";
import dragIcon from "../../assets/images/drag.svg";
import chevronUpIcon from "../../assets/images/chevronUp.svg";
import chevronDownIcon from "../../assets/images/chevronDown.svg";

const ItemType = {
  PRODUCT: "PRODUCT",
  VARIANT: "VARIANT",
};

function Product({
  product,
  index,
  moveProduct,
  handleEditProduct,
  toggleShowVariants,
  productsLength,
  handleDeleteProduct,
  moveVariant,
  handleDeleteVariant,
  handleProductDiscountChange,
  handleVariantDiscountChange,
}) {
  const [, ref] = useDrag({ type: ItemType.PRODUCT, item: { index } });
  const [, drop] = useDrop({
    accept: ItemType.PRODUCT,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveProduct(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const toggleDiscount = () => {
    handleProductDiscountChange(
      index,
      product.discount ? null : { value: "", type: "percent" }
    );
  };

  return (
    <div ref={(node) => ref(drop(node))}>
      <div
        style={{
          borderBottom: "1px solid #ddd",
          width: "40%",
          paddingTop: "0.1rem",
          marginTop: "0.9rem",
          paddingBottom: "1rem",
        }}
      >
        <div style={productHeaderStyle}>
          <span style={indexStyle}>
            <img
              src={dragIcon}
              alt="drag-icon"
              style={{ marginRight: "0.5rem" }}
            />{" "}
            {index + 1}.
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "5px",
              border: "0.1px solid #ccc",
              boxShadow:
                "0px 3px 1px -2px rgba(0,0,0,0.1), 0px 2px 2px 0px rgba(0,0,0,0.07), 0px 1px 5px 0px rgba(0,0,0,0.07)",
            }}
          >
            <input
              type="text"
              disabled
              value={product.title}
              readOnly
              style={{
                ...inputStyle,
                flexGrow: 1,
                marginRight: "10px",
                background: "none",
                border: "none",
                color: "inherit",
              }}
            />
            <button
              style={{
                ...editButtonStyle,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handleEditProduct(index)}
            >
              <span role="img" aria-label="edit">
                <img src={editIcon} alt="edit" />
              </span>
            </button>
          </div>

          <div style={discountContainerStyle}>
            {!product.discount && (
              <button style={discountButtonStyle} onClick={toggleDiscount}>
                Add Discount
              </button>
            )}
            {product.discount && (
              <div style={discountInputContainerStyle}>
                <input
                  type="number"
                  value={product.discount.value}
                  onChange={(e) =>
                    handleProductDiscountChange(index, {
                      value: e.target.value,
                      type: product.discount.type,
                    })
                  }
                  style={discountInputStyle}
                />
                <select
                  value={product.discount.type}
                  onChange={(e) =>
                    handleProductDiscountChange(index, {
                      value: product.discount.value,
                      type: e.target.value,
                    })
                  }
                  style={discountSelectStyle}
                >
                  <option value="percent">% Off</option>
                  <option value="flat">Flat Off</option>
                </select>
              </div>
            )}
          </div>
          {productsLength > 1 && (
            <button
              style={deleteButtonStyle}
              onClick={() => handleDeleteProduct(index)}
            >
              <RxCross2
                style={{
                  color: "rgba(0, 0, 0, 0.4)",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              />
            </button>
          )}
        </div>
        {product.variants.length > 0 && (
          <p
            style={variantButtonStyle}
            onClick={() => toggleShowVariants(product.id)}
          >
            {product.showVariants ? (
              <span style={{ gap: "0.5rem" }}>
                <span>Hide Variants</span> <img src={chevronUpIcon} alt="up" />
              </span>
            ) : (
              <span>
                <span>Show Variants</span>{" "}
                <img src={chevronDownIcon} alt="up" />{" "}
              </span>
            )}
          </p>
        )}

        {product.showVariants && product.variants.length > 0 ? (
          <DndProvider backend={HTML5Backend}>
            <div style={tableStyle}>
              <div>
                {product.variants.map((variant, variantIndex) => (
                  <VariantRow
                    key={variant.id}
                    variant={variant}
                    productIndex={index}
                    index={variantIndex}
                    moveVariant={moveVariant}
                    handleDeleteVariant={handleDeleteVariant}
                    handleVariantDiscountChange={handleVariantDiscountChange}
                    variantLength={product.variants.length}
                  />
                ))}
              </div>
            </div>
          </DndProvider>
        ) : (
          product.showVariants && (
            <p style={noVariantStyle}>No variants available.</p>
          )
        )}
      </div>
    </div>
  );
}

function VariantRow({
  variant,
  productIndex,
  index,
  moveVariant,
  handleDeleteVariant,
  handleVariantDiscountChange,
  variantLength,
}) {
  const [, ref] = useDrag({
    type: ItemType.VARIANT,
    item: { productIndex, index },
  });
  const [, drop] = useDrop({
    accept: ItemType.VARIANT,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveVariant(draggedItem.productIndex, draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const toggleVariantDiscount = () => {
    handleVariantDiscountChange(
      productIndex,
      index,
      variant.discount ? null : { value: "", type: "percent" }
    );
  };

  return (
    <div ref={(node) => ref(drop(node))}>
      <div
        style={{
          paddingTop: "0.1rem",
          marginTop: "0.9rem",
          marginLeft: "2rem",
          paddingBottom: "1rem",
        }}
      >
        <div style={variantHeaderStyle}>
          <span style={indexStyle}>
            <img
              src={dragIcon}
              alt="drag-icon"
              style={{ marginRight: "0.5rem" }}
            />{" "}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "4rem",
              padding: "0rem 1rem",
              border: "0.1px solid #ccc",
              boxShadow:
                "0px 3px 1px -2px rgba(0,0,0,0.1), 0px 2px 2px 0px rgba(0,0,0,0.07), 0px 1px 5px 0px rgba(0,0,0,0.07)",
            }}
          >
            <input
              type="text"
              disabled
              value={variant.title}
              readOnly
              style={{
                ...inputStyle,
                flexGrow: 1,
                marginRight: "10px",
                background: "none",
                border: "none",
                color: "inherit",
              }}
            />
          </div>

          <div style={discountContainerStyle}>
            {!variant.discount && (
              <button
                style={discountButtonStyle}
                onClick={toggleVariantDiscount}
              >
                Add Discount
              </button>
            )}
            {variant.discount && (
              <div style={discountInputContainerStyle}>
                <input
                  type="number"
                  value={variant.discount.value}
                  onChange={(e) =>
                    handleVariantDiscountChange(productIndex, index, {
                      value: e.target.value,
                      type: variant.discount.type,
                    })
                  }
                  style={{ ...discountInputStyle, borderRadius: "4rem" }}
                />
                <select
                  value={variant.discount.type}
                  onChange={(e) =>
                    handleVariantDiscountChange(productIndex, index, {
                      value: variant.discount.value,
                      type: e.target.value,
                    })
                  }
                  style={{ ...discountSelectStyle, borderRadius: "4rem" }}
                >
                  <option value="percent">% Off</option>
                  <option value="flat">Flat Off</option>
                </select>
              </div>
            )}
          </div>

          {variantLength > 1 && (
            <button
              style={deleteButtonStyle}
              onClick={() => handleDeleteVariant(productIndex, index)}
            >
              <RxCross2
                style={{
                  color: "rgba(0, 0, 0, 0.4)",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([
    { id: "0", title: "Select Product", variants: [], showVariants: false },
  ]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddProduct = () => {
    setProducts((prevProducts) => [
      ...prevProducts,
      {
        id: Math.random().toString(),
        title: "Select Product",
        variants: [],
        showVariants: false,
      },
    ]);
  };

  const handleEditProduct = (index) => {
    setEditIndex(index);
    setOpen(true);
  };

  const handleSaveProducts = (newProducts) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts.splice(editIndex, 1, ...newProducts);
      return updatedProducts;
    });
  };

  const toggleShowVariants = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, showVariants: !product.showVariants }
          : product
      )
    );
  };

  const moveProduct = (fromIndex, toIndex) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const [movedProduct] = updatedProducts.splice(fromIndex, 1);
      updatedProducts.splice(toIndex, 0, movedProduct);
      return updatedProducts;
    });
  };

  const moveVariant = (productIndex, fromIndex, toIndex) => {
    if (
      productIndex < 0 ||
      productIndex >= products.length ||
      fromIndex < 0 ||
      toIndex < 0
    )
      return;

    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const product = updatedProducts[productIndex];
      if (!product || !product.variants) return updatedProducts;

      const updatedVariants = [...product.variants];
      const [movedVariant] = updatedVariants.splice(fromIndex, 1);
      updatedVariants.splice(toIndex, 0, movedVariant);

      updatedProducts[productIndex] = {
        ...product,
        variants: updatedVariants,
      };

      return updatedProducts;
    });
  };

  const handleDeleteProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleDeleteVariant = (productIndex, variantIndex) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const product = updatedProducts[productIndex];
      if (!product) return; // Safeguard against undefined product
      const updatedVariants = [...product.variants];
      updatedVariants.splice(variantIndex, 1);
      product.variants = updatedVariants;
      updatedProducts[productIndex] = product;
      return updatedProducts;
    });
  };
  // Handle discount changes for product
  const handleProductDiscountChange = (index, discount) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const product = updatedProducts[index];
      product.discount = discount;
      updatedProducts[index] = product;
      return updatedProducts;
    });
  };

  // Handle discount changes for variant
  const handleVariantDiscountChange = (
    productIndex,
    variantIndex,
    discount
  ) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const product = updatedProducts[productIndex];
      const variant = product.variants[variantIndex];
      variant.discount = discount;
      updatedProducts[productIndex] = product;
      return updatedProducts;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h3>Add Products</h3>
        <div
          style={{
            display: "flex",
            gap: "13rem",
            paddingLeft: "3.1rem",
            marginTop: "2.5rem",
            width: "40%",
          }}
        >
          <p style={{ fontWeight: "500", fontSize: "14px" }}>Product</p>
          <p style={{ fontWeight: "500", fontSize: "14px" }}>Discount</p>
        </div>
        {products.map((product, index) => (
          <Product
            key={product.id}
            index={index}
            product={product}
            moveProduct={moveProduct}
            handleEditProduct={handleEditProduct}
            toggleShowVariants={toggleShowVariants}
            productsLength={products.length}
            handleDeleteProduct={handleDeleteProduct}
            moveVariant={moveVariant}
            handleDeleteVariant={handleDeleteVariant}
            handleProductDiscountChange={handleProductDiscountChange}
            handleVariantDiscountChange={handleVariantDiscountChange}
          />
        ))}
        <div style={{ marginTop: "10px", width: "30%" }}>
          <button style={buttonStyle} onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
        <CustomModal
          setProducts={handleSaveProducts}
          open={open}
          setOpen={setOpen}
        />
      </div>
    </DndProvider>
  );
}

const productHeaderStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
};
const variantHeaderStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
};

const indexStyle = {
  marginRight: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
};

const inputStyle = {
  flex: 1,
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "3px",
  marginRight: "10px",
};

const editButtonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "3px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  color: "lightgray",
  backgroundColor: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "3px",
  cursor: "pointer",
  marginRight: "10px",
};

const variantButtonStyle = {
  cursor: "pointer",
  textDecoration: "underline",
  color: "#006EFF",
  fontSize: "12px",
  fontWeight: "400",
  width: "70%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "10px",
};

const noVariantStyle = {
  color: "#666",
};

const buttonStyle = {
  backgroundColor: "transparent",
  color: "#008060",
  border: "2px solid #008060",
  padding: "13px 50px",
  borderRadius: "3px",
  cursor: "pointer",
  float: "right",
};

const discountContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  gap: "10px",
  marginLeft: "13px",
};

const discountButtonStyle = {
  backgroundColor: "#008060",
  color: "white",
  border: "none",
  padding: "8px 18px",
  borderRadius: "3px",
  cursor: "pointer",
  marginTop: "-1.5vh",
};

const discountInputContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "-1.3vh",
};

const discountInputStyle = {
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "0.5rem",
  paddingLeft: "1rem",
  width: "100px",
  boxShadow:
    "0px 3px 1px -2px rgba(0,0,0,0.1), 0px 2px 2px 0px rgba(0,0,0,0.07), 0px 1px 5px 0px rgba(0,0,0,0.07)",
};

const discountSelectStyle = {

  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "0.5rem",
  paddingLeft: "1rem",
  boxShadow:
    "0px 3px 1px -2px rgba(0,0,0,0.1), 0px 2px 2px 0px rgba(0,0,0,0.07), 0px 1px 5px 0px rgba(0,0,0,0.07)",
};



export default Home;
