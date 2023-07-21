import { API_URL } from "config";
import { useEffect, useState } from "react";
import { CURRENCY_SYMBOLE } from "../../../config";
import Loader from "../../loader";

const CheckoutItems = () => {
  var token: any;
  var cartId: any;
  if (typeof window !== "undefined") {
    // Code running in the browser
    token = localStorage.getItem("token");
    cartId = localStorage.getItem("cartId");
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartData, setCartData] = useState<any>();
  const [cartItems, setCartItems] = useState<any>();
  const [cartPrductArr, setCartPrductArr] = useState<any>([]);
  const [cartPrductImgArr, setCartPrductImgArr] = useState<any>([]);
  const [configuredBundleData, setConfiguredBundleData] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const handleGetCart = async () => {
      try {
        const resp = await fetch(`${API_URL}/carts/${cartId}?include=items%2Cbundle-items`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (resp.status === 401) {
          // Redirect to "/login" route
          alert("Please Login");
          window.location.href = "/login";
          return;
        }
        const response = await resp.json();
        if (response) {
          setCartData(response);
          const configurableItems = response?.included.filter(
            (item: any) => item.attributes.configuredBundle !== null
          );
          const filteredItems = response?.included.filter(
            (item: any) => item.attributes.configuredBundle === null
          );
          const formattedData: any[] = [];
          configurableItems.forEach((item: any) => {
            if (item.attributes.configuredBundle !== null) {
              const uuid = item.attributes.configuredBundle.template.uuid;
              const groupKey = item.attributes.configuredBundle.groupKey;
              const existingItem = formattedData.find(
                (dataItem) => dataItem.uuid === uuid && dataItem.groupKey === groupKey
              );
              const unitPrice = item.attributes.calculations.unitPrice;
              if (existingItem) {
                existingItem.data.push(item);
                existingItem.total += unitPrice;
              } else {
                formattedData.push({
                  uuid: uuid,
                  groupKey: groupKey,
                  name: item.attributes.configuredBundle.template.name,
                  data: [item],
                  total: unitPrice,
                });
              }
            }
          });
          await handleImage(formattedData);
          setCartItems(filteredItems);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    handleGetCart();
  }, []);

  const handleImage = async (formattedData: any) => {
    if (formattedData.length) {
      await Promise.all(
        formattedData.map(async (element: any) => {
          await Promise.all(
            element.data.map(async (item: any) => {
              const resp = await fetch(
                `${API_URL}/concrete-products/${item.attributes.sku}?include=concrete-product-image-sets`,
                {
                  method: "GET",
                }
              );
              const result = await resp.json();
              item.attributes.image = result.included[0].attributes.imageSets[0].images[0].externalUrlLarge;
              item.attributes.name = result.data.attributes.name;
            })
          );
        })
      );
    }
    setConfiguredBundleData(formattedData);
  };

  useEffect(() => {
    const setCartData = async () => {
      const tempData: any = [];
      const tempImgData: any = [];

      await Promise.all(
        cartItems?.map(async (item: any, index: number) => {
          const result = await getProductDetails(item?.attributes?.sku);
          const imgData = await getProductImage(item?.attributes?.sku);

          tempData[index] = result?.data;
          tempImgData[index] = imgData?.data[0]?.attributes?.imageSets[0]?.images[0]?.externalUrlSmall;
        })
      );

      setCartPrductImgArr(tempImgData);
      setCartPrductArr(tempData);
    };

    if (cartItems && cartItems.length > 0) {
      console.log(cartItems.length,"hiii")
      setCartData();
    }
  }, [cartItems]);

  const getProductDetails = async (productId: string) => {
    const resp = await fetch(`${API_URL}/concrete-products/${productId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const result = await resp.json();
    return result;
  };

  const getProductImage = async (productId: string) => {
    const img = await fetch(`${API_URL}/concrete-products/${productId}/concrete-product-image-sets`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const imgData = await img.json();
    return imgData;
  };

  return (
    <div className="checkout-items">
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}>
          <Loader />
        </div>
      ) : (
        <>
         <h1 style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "1rem" }}>
              Total Cart Items: {cartItems?.length}
            </h1>
          {cartPrductArr &&
            cartPrductArr &&
            cartItems &&
            cartItems?.map((item: any, Index: number) => (
             
             
              <div
             
                className="checkout-item"
                style={{
                  background: "#fff",
                  border: "3px solid rgba(0, 0, 0, 0.05)",
                  paddingRight: "5rem",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
               
            
                <div
                  className="image_adjustment"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.05)", height: "14rem", padding: "28px" }}
                >
                  <div
                    className="checkout-item__img"
                    style={{ width: "7rem", height: "7rem", overflow: "hidden", marginTop: "8vh", marginRight: "10px" }}
                  >
                    <img src={cartPrductImgArr[Index]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
                <div style={{ flex: 1, marginLeft: "2rem" }}>
                  <h3
                    style={{
                      fontWeight: "500",
                      fontSize: "0.875rem",
                      lineHeight: 1.4,
                      display: "block",
                      color: "#333",
                    }}
                  >
                    {cartPrductArr[Index]?.attributes?.name}
                  </h3>
                  <p>{/* Add any other description elements here */}</p>
                </div>
                <h3
                  style={{
                    marginLeft: "auto",
                    fontWeight: "800",
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                    display: "block",
                    color: "#333",
                    background: "rgba(0, 0, 0, 0.05)",
                    padding: "12px",
                    marginRight: "-75px",
                  }}
                >
                  Item Total : {CURRENCY_SYMBOLE} {item.attributes?.calculations?.unitPrice * item?.attributes?.quantity}
                </h3>
           
              </div>
            ))}

          {configuredBundleData?.length > 0 && (
            <h1 style={{ fontWeight: "500", fontSize: "1.2rem", marginBottom: "1rem" }}>
              Total Configured Bundles: {configuredBundleData?.length}
            </h1>
          )}

          {configuredBundleData?.map((item: any, index: number) => (
            <div key={index} style={{ border: "8px solid rgb(245, 245, 245)", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", background: "#f5f5f5", padding: "20px" }}>
                <div>
                  <h1>{item?.name}</h1>
                </div>
                <div style={{ display: "flex" }}>
                  <p style={{ padding: "10px", fontWeight: "bold" }}>
                    Total {CURRENCY_SYMBOLE} {item.total} X {item.data[0].attributes.quantity}
                  </p>
                </div>
              </div>
              <div style={{ padding: "20px", background: "#fff" }}>
                {item?.data?.map((val: any) => (
                  <div style={{ margin: "auto", width: "95%", marginBottom: "10px" }}>
                    <div
                      style={{
                        padding: "1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        background: "#dedede",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            marginRight: "10px",
                            backgroundColor: "red",
                          }}
                        >
                          <img
                            src={val?.attributes?.image}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        <div style={{ flex: 1, padding: "20px", color: "black" }}>
                          {val.attributes.name}
                          <p style={{ color: "black", fontWeight: "bold" }}>SKU: {val.attributes.abstractSku}</p>
                          {/* Add any other description elements here */}
                        </div>
                      </div>
                      <p style={{ color: "black", paddingTop: "20px", fontWeight: "bold" }}>
                        {val.attributes.quantity} X {val.attributes.calculations.unitPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CheckoutItems;
