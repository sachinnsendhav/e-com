import React from "react";
//@ts-ignore
import profileIcon from '../../assets/images/addresses.png';
//@ts-ignore
import addressesIcon from "../../assets/images/addresses.png";
//@ts-ignore
import orderIcon from "../../assets/images/order-history.png";
//@ts-ignore
import shoppingList from "../../assets/images/list.png";
function profileSection({ showBlock, setShowBlock }: any) {
  console.log("showBlock", showBlock, "setShowBlock", setShowBlock);
  return (
    <div
      style={{
        margin: "1rem",
        border: "0.0625rem solid #dce0e5",
        width: "20%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: showBlock === "profile" ? "#f2f2f2" : "#ffffff",
          padding: "0.125rem 0.8125rem",
          lineHeight: "1.3em",
          fontSize: "1.0625rem",
          fontWeight: "500",
          color: showBlock === "profile" ? "black" : "#b2b2b2",
        }}
        onClick={() => setShowBlock("profile")}
      >
        <div>
          <img
            src={profileIcon.src}
            style={{ height: "20px", width: "20px" }}
          />
        </div>
        <div>
          <p style={{ padding: "9px" }}>Profile</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: showBlock === "address" ? "#f2f2f2" : "#ffffff",
          padding: "0.125rem 0.8125rem",
          lineHeight: "1.3em",
          fontSize: "1.0625rem",
          fontWeight: "500",
          color: showBlock === "address" ? "black" : "#b2b2b2",
        }}
        onClick={() => setShowBlock("address")}
      >
        <div>
          <img
            src={addressesIcon.src}
            style={{ height: "20px", width: "20px" }}
          />
        </div>
        <div>
          <p style={{ padding: "9px" }}>Addresses</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: showBlock === "order" ? "#f2f2f2" : "#ffffff",
          padding: "0.125rem 0.8125rem",
          lineHeight: "1.3em",
          fontSize: "1.0625rem",
          fontWeight: "500",
          color: showBlock === "order" ? "black" : "#b2b2b2",
        }}
        onClick={() => setShowBlock("order")}
      >
        <div>
          <img src={orderIcon.src} style={{ height: "20px", width: "20px" }} />
        </div>
        <div>
          <p style={{ padding: "9px" }}>Order History</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: showBlock === "shoppingList" ? "#f2f2f2" : "#ffffff",
          padding: "0.125rem 0.8125rem",
          lineHeight: "1.3em",
          fontSize: "1.0625rem",
          fontWeight: "500",
          color: showBlock === "shoppingList" ? "black" : "#b2b2b2",
        }}
        onClick={() => setShowBlock("shoppingList")}
      >
        <div>
          <img
            src={shoppingList.src}
            style={{ height: "20px", width: "20px" }}
          />
        </div>
        <div>
          <p style={{ padding: "9px" }}>Shopping Lists</p>
        </div>
      </div>
    </div>
  );
}

export default profileSection;
