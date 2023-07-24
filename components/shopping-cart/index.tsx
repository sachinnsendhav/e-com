import CheckoutStatus from "../../components/checkout-status";
import Item from "./item";
import { useEffect, useState } from "react";
import { API_URL } from "config";
import { CURRENCY_SYMBOLE } from 'config';
// import Loader from "components/loader";


const ShoppingCart = () => {
  var token: any;
  var cartId: any;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    cartId = localStorage.getItem("cartId");
  }
 

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartData, setCartData] = useState<any>();
  const [cartItems, setCartItems] = useState<any>();
  const [configuredBundleData, setConfiguredBundleData] = useState<any[]>([]);
  const [cartPrductArr, setCartPrductArr] = useState<any>([]);
  const [cartPrductImgArr, setCartPrductImgArr] = useState<any>([]);
  const [cartPrductAvableArr, setCartPrductAvableArr] = useState<any>([]);
  const [cartUpdated, setCartUpdated] = useState<number>(0);

  // const priceTotal = () => {
  //   let totalPrice = 0;
  //   if (cartItems?.length > 0) {
  //     cartItems.map((item: any) => (totalPrice += item.price * item.count));
  //   }
  //   return totalPrice;
  // };

//@ts-ignore
  


  const handlecart = async () => {
    try {
      const resp = await fetch(`${API_URL}/carts`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 401) {
        alert("Please Login");
        window.location.href = "/login";
        return;
      }
      const response = await resp.json();

      if (response) {
        setCartUpdated(cartUpdated + 1);
        setIsLoading(false);
        localStorage.setItem("cartId", response?.data[0].id);
        cartId = response?.data[0].id;
        return response?.data[0].id;
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsLoading(false);
    }
  };

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
        } else if (resp.status === 404) {
          // alert("Cart not found: checking");
          await handlecart();
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
          await configurableItems.forEach((item: any) => {
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
  }, [cartUpdated, cartId]);

  useEffect(() => {
    const setCartData = async () => {
      const tempData: any = [];
      const tempImgData: any = [];
      const tempAvalbData: any = [];

      await Promise.all(
        cartItems?.map(async (item: any, index: number) => {
          const result = await getProductDetails(item?.attributes?.sku);
          const { imgData, avalibility } = await getProductImage(
            item?.attributes?.sku
          );
          tempData[index] = result?.data;
          tempImgData[index] =
            imgData?.attributes?.imageSets[0]?.images[0]?.externalUrlSmall;
          tempAvalbData[index] = avalibility?.attributes;
        })
      );
      setCartPrductAvableArr(tempAvalbData);
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
      `${API_URL}/concrete-products/${productId}?include=concrete-product-image-sets%2cconcrete-product-availabilities`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const imgData = await img.json();
    return { imgData: imgData?.included[0], avalibility: imgData?.included[1] };
  };

  const setProductCount = async (count: number, pliId: string, id: string) => {
    const productCart = {
      data: {
        type: "items",
        attributes: {
          sku: id,
          quantity: count,
          salesUnit: {
            id: 0,
            amount: 0,
          },
          productOptions: [null],
        },
      },
    };
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_URL}/carts/${cartId}/items/${pliId}`, {
        method: "PATCH",
        body: JSON.stringify(productCart),
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
      } else if (resp.status === 404) {
        // alert("Cart not found: checking");
        await handlecart();
        return;
      }
      const response = await resp.json();
      if (response) {
        
        setCartUpdated(cartUpdated + 1);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const removeProductFromCart = async (pliId: string) => {
    if (confirm("Do you want to remove this product")) {
      setIsLoading(true);
      try {
        const resp = await fetch(`${API_URL}/carts/${cartId}/items/${pliId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (resp.status === 401) {
          // Redirect to "/login" route
          alert("Please Login");
          
          setIsLoading(false);
          window.location.href = "/login";
          return;
        } else if (resp.status === 404) {
          // alert("Cart not found: checking");
          await handlecart();
          return;
        }

        if (resp.status == 204) {
          setTimeout(() => {
            setIsLoading(false);
          }, 10000);
          setCartUpdated(cartUpdated + 1);

          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  const deleteConfigureBundle = async (groupKey: any) => {
    const resp = await fetch(
      `${API_URL}/carts/${cartId}/configured-bundles/${groupKey}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (resp.status === 204) {
      const updatedItems = configuredBundleData.filter(
        (item: any) => item.groupKey !== groupKey
      );
      setConfiguredBundleData(updatedItems || []);
      alert("Configurable Item deleted sucessfully...!");
    }
  };

  const changeConfigBundleQuantity = async (quantity: number, item: any) => {

    const groupKey = item?.groupKey;
    const templateUUID = item?.uuid;
    const items = item?.data.map((items: any) => {
      return {
        sku: items?.attributes?.sku,
        quantity: quantity,
        slotUuid: items?.attributes?.configuredBundleItem?.slot?.uuid,
      };
    });
    const productCart = {
      data: {
        type: 'configured-bundles',
        attributes: {
          quantity: quantity,
          templateUuid: templateUUID,
          items: items,
        },
      },
    };
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_URL}/carts/${cartId}/configured-bundles/${groupKey}`, {
        method: "PATCH",
        body: JSON.stringify(productCart),
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
      } else if (resp.status === 404) {
        // alert("Cart not found: checking");
        await handlecart();
        return;
      }
      const response = await resp.json();
      if (response) {
        setCartUpdated(cartUpdated + 1);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  const handleImage = async (formattedData: any) => {
    console.log(formattedData, "formattedData")
    // var data1:any =formattedData
    await formattedData?.forEach(async (element: any) => {
      await element.data.forEach(async (item: any) => {
        const resp = await fetch(
          `${API_URL}/concrete-products/${item.attributes.sku}?include=concrete-product-image-sets`,
          {
            method: "GET",
          }
        );
        const result = await resp.json();
        item.attributes.image =
          await result.included[0].attributes.imageSets[0].images[0].externalUrlLarge;
        item.attributes.name = await result.data.attributes.name;
      });
      // await data1.push(element);
    })
    setTimeout(async () => {
      await setConfiguredBundleData(formattedData);

    }, 2000);
  }
  // }, [configuredBundleDataTemp]);

  console.log(configuredBundleData, "configBundleData")
  return (
    <section className="cart" style={{ paddingInline: "75px", background: '#FFF', color: 'black' }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
         
        >
         
        </div>
      ) : (
        <div className="container">
          {cartPrductArr && cartPrductArr && cartItems ? (
            <div className="cart__intro">
              <h3 className="cart__title">Shopping Cart</h3>
              <CheckoutStatus step="cart" />
            </div>
          ) : (
            <div></div>
          )}
          <div className="cart-list">
            {cartItems && cartItems?.length > 0 && (
              <table>
                <tbody>
                  {/* <tr>
                    <th style={{ textAlign: "left", color: "black" }}>
                      Product
                    </th>
                    <th> </th>
                    <th> </th>
                    <th style={{ color: "black" }}>Quantity</th>
                    <th style={{ color: "black" }}>Price</th>
                    <th></th>
                  </tr> */}
                  <div style={{ display: "flex", marginTop: "-54px" }}>
                    <div>
                      {cartItems.map((item: any, Index: number) => (
                        <Item
                          key={item.id}
                          pliId={item.id}
                          id={cartPrductArr[Index]?.id}
                          thumb={cartPrductImgArr[Index]}
                          avalibility={cartPrductAvableArr[Index]}
                          name={cartPrductArr[Index]?.attributes?.name}
                          color={item.color}
                          price={item.attributes?.calculations?.unitPrice}
                          size={item.size}
                          grandTotal={item.grandTotal}
                          subTotal={item.subtotal}
                          taxTotal={item.taxTotal}
                          count={item?.attributes?.quantity}
                          setProductCount={setProductCount}
                          removeProductFromCart={removeProductFromCart}
                        />
                      ))}
                    </div>
                    <div>
                      <div style={{ background: "#f0f0f0", display: "flex", flexDirection: "column", padding: "1rem", height: "267px", width: "18rem", marginBottom: "0.5rem", marginLeft: "0.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>

                          {/* <div style={{ flex: 1, marginRight: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                            <input
                              type="text"
                              placeholder="Promo Code"
                              className="cart__promo-code"
                            />

                            <hr style={{ borderTop: "1px solid #ccc" }} />
                          </div> */}
                        </div>
                     

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>

                          <div style={{ flex: 1, marginRight: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                            <p style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", fontWeight: "300", whiteSpace: "nowrap", display: "flex", marginLeft: "-14px", justifyContent: "space-between", fontFamily: "'Circular', sans-serif" }}>Sub Total</p>


                            <h3 style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", display: "flex", justifyContent: "space-between" }}>
                              {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.subtotal / 100}
                            </h3>
                          </div>
                        </div>
                        <hr style={{ borderTop: "1px solid #ccc" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <div style={{ flex: 1, marginRight: "0.5rem", fontSize: "0.875rem", fontWeight: "300", display: "flex", justifyContent: "space-between" }}>
                            <p style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", fontWeight: "300", marginLeft: "-14px", display: "flex", justifyContent: "space-between", fontFamily: "'Circular', sans-serif" }}>Tax Total</p>
                            <h3 style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", display: "flex", justifyContent: "space-between" }}>

                              {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.taxTotal/ 100}
                            </h3>
                          </div>

                        </div>
                        <hr style={{ borderTop: "1px solid #ccc" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <div style={{ flex: 1, marginRight: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                            <p style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", marginLeft: "-14px", fontWeight: "300", display: "flex", fontFamily: "'Circular', sans-serif", justifyContent: "space-between" }}>Grand Total</p>


                            <h3 style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", overflow: "auto", display: "flex", justifyContent: "space-between" }}>
                              {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.grandTotal/ 100}
                            </h3>
                          </div>

                        </div>



                      </div>
                      <div className="cart-actions__items-wrapper" style={{ textAlign: "right" }}>
                      <a href="/cart/checkout" className="btn btn--rounded btn--yellow" style={{ paddingLeft: "7rem", paddingRight: "7rem", background: "rgb(207, 18, 46" }}>
                        Checkout
                      </a>
                    </div>
                    </div>
                    
                  </div>
                </tbody>
              </table>
            )}

            {!cartItems && <p>Nothing in the cart</p>}
          </div>
          {configuredBundleData && configuredBundleData?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                style={{
                  marginTop: "10px",
                  background: "#fff",
                  border: "8px solid #f5f5f5",
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
                 
                    <div className="quantity-button">
                      <button
                        type="button"
                        onClick={() =>
                          changeConfigBundleQuantity(
                            item.data[0].attributes.quantity - 1,
                            item
                          )
                        }
                        className="quantity-button__btn"
                      >
                        -
                      </button>
                      <span>{item.data[0].attributes.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          changeConfigBundleQuantity(
                            item.data[0].attributes.quantity + 1,
                            item
                          )
                        }
                        className="quantity-button__btn"
                      >
                        +
                      </button>
                    </div>
                    <p style={{ padding: "10px" }}>
                      quantity = {item.data[0].attributes.quantity}{" "}
                    </p>
                    <p style={{ padding: "10px", fontWeight: "bold" }}>
                      Total  {CURRENCY_SYMBOLE} {(item.total/100) * (item.data[0].attributes.quantity)}
                     Total  {CURRENCY_SYMBOLE} {(item.total/100)*(item.data[0].attributes.quantity)}
                    </p>
                    <button
                      style={{
                        background: "black",
                        padding: "5px",
                        color: "white",
                        borderRadius: "5px",
                      }}
                      onClick={() => deleteConfigureBundle(item.groupKey)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ padding: "20px" }}>
                  {item?.data?.map((val: any) => {
                    return (
                      <div
                        style={{
                          margin: "auto",
                          width: "70%",
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
                            {val.attributes.quantity} X        {val.attributes.calculations.unitPrice/100}
                          </p>
                          <div
                            style={{
                              paddingTop: "20px",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            = {CURRENCY_SYMBOLE}{(val.attributes.quantity) * (val.attributes.calculations.unitPrice)/100}
                           = {CURRENCY_SYMBOLE}{(val.attributes.quantity)*(val.attributes.calculations.unitPrice)/100}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="cart-actions">
            <a href="/" className="cart__btn-back">
              <i className="icon-left"></i> Continue Shopping
            </a>
            {/* <input
              type="text"
              placeholder="Promo Code"
              className="cart__promo-code"
            /> */}


            <div className="cart-actions__items-wrapper">
              {/* <p className="cart-actions__total">
                Total cost{" "}
                <strong>
                  {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.priceToPay/100}
                </strong>
              </p>
              <a href="/cart/checkout" className="btn btn--rounded btn--yellow">
                Checkout
              </a> */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShoppingCart
