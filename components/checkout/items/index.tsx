import { API_URL } from "config";
import { useEffect, useState } from "react";

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
  const [cartUpdated, setCartUpdated] = useState<number>(0);
  const [configuredBundleData, setConfiguredBundleData] = useState<any[]>([]);

  useEffect(() => {
    const handleGetCart = async () => {
      try {
        const resp = await fetch(
          `${API_URL}/carts/${cartId}?include=items%2Cbundle-items`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
                (dataItem) =>
                  dataItem.uuid === uuid && dataItem.groupKey === groupKey
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
  }, [cartUpdated]);

  const handleImage = async (formattedData: any) => {
    const data = (await formattedData.length)
      ? await formattedData.forEach(async (element: any) => {
          await element.data.forEach(async (item: any) => {
            const resp = await fetch(
              `${API_URL}/concrete-products/${item.attributes.sku}?include=concrete-product-image-sets`,
              {
                method: "GET",
              }
            );
            const result = await resp.json();
            item.attributes.image = await result.included[0].attributes
              .imageSets[0].images[0].externalUrlLarge;
            item.attributes.name = result.data.attributes.name;
          });
        })
      : null;
    await setConfiguredBundleData(formattedData);
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
          tempImgData[index] =
            imgData?.data[0]?.attributes?.imageSets[0]?.images[0]?.externalUrlSmall;
        })
      );

      setCartPrductImgArr(tempImgData);
      setCartPrductArr(tempData);
    };

    if (cartItems && cartItems.length > 0) {
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
    const img = await fetch(
      `${API_URL}/concrete-products/${productId}/concrete-product-image-sets`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const imgData = await img.json();
    return imgData;
  };

  return (
    <ul className="checkout-items">
      {cartPrductArr &&
        cartPrductArr &&
        cartItems &&
        cartItems?.map((item: any, Index: number) => (
          <li className="checkout-item" style={{background:"#fff", border:"8px solid rgb(245, 245, 245)", padding:"8px"}}>
            <div className="checkout-item__content">
              <div className="checkout-item__img">
                <img src={cartPrductImgArr[Index]} />
              </div>

              <div className="checkout-item__data">
                <h3>{cartPrductArr[Index]?.attributes?.name}</h3>
              </div>
            </div>
            <h3>
              &euro;{" "}
              {item.attributes?.calculations?.unitPrice *
                item?.attributes?.quantity}
            </h3>
          </li>
        ))}
      {configuredBundleData?.length &&
        configuredBundleData?.map((item: any, index: number) => {
          return (
            <div
              key={index}
              style={{
                border:"8px solid rgb(245, 245, 245)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#f5f5f5",
                  padding: "20px",
                }}
              >
                <div>
                  <h1>{item?.name}</h1>
                </div>
                <div style={{ display: "flex" }}>
                  <p style={{ padding: "10px", fontWeight: "bold" }}>
                    Total &euro; {item.total} X {item.data[0].attributes.quantity}
                  </p>
                </div>
              </div>
              <div style={{ padding: "20px" , background:"#fff" }}>
                {item?.data?.map((val: any) => {
                  return (
                    <div
                      style={{
                        margin: "auto",
                        width: "95%",
                      }}
                    >
                      <div
                        style={{
                          padding: "1rem",
                          display: "flex",
                          justifyContent: "space-between",
                          background: "#dedede",
                          margin: "1rem",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <div style={{ width: "70px" }}>
                            <img
                              src={val?.attributes?.image}
                              style={{
                                width: "100%",
                                background: "#dedede",
                                objectFit: "cover",
                              }}
                            />
                          </div>

                          <div style={{ padding: "20px", color: "black" }}>
                            {val.attributes.name}
                            <p style={{ color: "black", fontWeight: "bold" }}>
                              {" "}
                              SKU : {val.attributes.sku}
                            </p>
                          </div>
                        </div>
                        <p
                          style={{
                            color: "black",
                            paddingTop: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          {val.attributes.quantity} X{" "}
                          {val.attributes.calculations.unitPrice}
                        </p>
                        {/* <div
                          style={{
                            paddingTop: "20px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          = &euro;
                          {val.attributes.quantity *
                            val.attributes.calculations.unitPrice}
                        </div> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </ul>
  );
};

export default CheckoutItems;
