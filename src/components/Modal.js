import React, { useRef, useState } from "react";
import { Button, Modal } from "antd";
import ProductPicker from "./ProductPicker";
import "./CustomModal.css";


const CustomModal = ({ open, setOpen, setProducts }) => {
  const productPickerRef = useRef();
  const [selectedCount, setSelectedCount] = useState(0);

  const handleOk = () => {
    if (productPickerRef.current) {
      const result = productPickerRef.current.submit(); // Fetch selected products
      if (result?.length > 0) {
        setProducts(result); // Update the products in Home.js
      }
    }
    setOpen(false); // Close the modal
  };

  const handleCancel = () => {
    setOpen(false); // Close the modal
  };

  return (
    <Modal
      width={"50%"}
      open={open}
      title="Select Products"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <ProductPicker ref={productPickerRef} onSelectionCountChange={setSelectedCount}/>
     
     <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" , alignItems:"center"}}>

     <div>{
        selectedCount > 0 && `${selectedCount} Product selected`
        }</div>

    
      <div style={{ display: "flex", justifyContent: "flex-end",}}>
        <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
          Cancel
        </Button>
        <Button style={{backgroundColor:"#008060", color:"white"}} onClick={handleOk}>
          Add
        </Button>
      </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
