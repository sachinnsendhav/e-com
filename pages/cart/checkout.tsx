import Layout from "../../layouts/Main";
import CheckoutStatus from "../../components/checkout-status";
import CheckoutItems from "../../components/checkout/items/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API_URL, CURRENCY_SYMBOLE } from "config";

const CheckoutPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [cartData, setCartData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [shipments, setShipments] = useState<any>([]);
  const [shipmentMethods, setShipmentMethods] = useState<any>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [selectedPayment, setSelectedPayment] = useState<any>();
  // const [selectedShipment, setSelectedShipment] = useState<any>();

  var token: any;
  var cartId: any;
  if (typeof window !== "undefined") {
    // Code running in the browser
    token = localStorage.getItem("token");
    cartId = localStorage.getItem("cartId");
  }
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
          var tempArr: any = [];
          setCartData(response);
          await response?.included?.map((item: any) => {
            tempArr.push(item.id);
          });
          setItems(tempArr);
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

  const getCheckoutDetails = async () => {
    const authToken = localStorage.getItem("token");
    const data: any = {
      data: {
        attributes: {
          idCart: cartId,
          shipmentMethods: [],
        },
        type: "checkout-data",
      },
    };
    const resp = await fetch(
      `${API_URL}/checkout-data?include=shipments%2Cshipment-methods%2Caddresses%2Cpayment-methods%2Citems`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (resp.status === 401) {
      // Redirect to "/login" route
      alert("Please Login");
      window.location.href = "/login";
      return;
    }
    if (resp.status === 422) {
      const response = await resp.json();
      // Redirect to "/login" route
      alert(response?.errors[0]?.detail);
      // window.location.href = "/login";
      return;
    }
    const reslut = await resp.json();
    setData(reslut?.included);
  };
  useEffect(() => {
    getCheckoutDetails();
  }, []);

  useEffect(() => {
    setShipmentMethods([]);
    setPaymentMethods([]);
    setShipments([]);
    setAddresses([]);
    if (data?.length > 0) {
      data.forEach((element: any) => {
        if (element.type === "shipment-methods") {
          setShipmentMethods((shipmentMethods: any) => [
            ...shipmentMethods,
            element,
          ]);
        } else if (element.type === "payment-methods") {
          setPaymentMethods((paymentMethods) => [...paymentMethods, element]);
        } else if (element.type === "shipments") {
          setShipments((shipments: any) => [...shipments, element]);
        } else if (element.type === "addresses") {
          setAddresses((addresses) => [...addresses, element]);
        }
      });
    }
  }, [data]);

  const orderConfirm = async () => {
    const orderData = {
      data: {
        type: "checkout",
        attributes: {
          customer: {
            email: "sonia@spryker.com",
            salutation: "Ms",
            firstName: "sonia",
            lastName: " Wagner",
          },
          idCart: cartId,
          billingAddress: selectedAddress,
          payments: [
            {
              ...selectedPayment,
            },
          ],
          // shipment: {
          //   idShipmentMethod: 1,
          // },
          shipments: [
            {
              shippingAddress: selectedAddress,
              items: items,
              idShipmentMethod: 7,
              requestedDeliveryDate: "2023-06-23",
            },
          ],
        },
      },
    };
    try {
      const resp = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        body: JSON.stringify(orderData),
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
      if (resp.status === 422) {
        const response = await resp.json();
        // Redirect to "/login" route
        alert(response?.errors[0]?.detail);
        // window.location.href = "/login";
        return;
      }
      const response = await resp.json();
      localStorage.removeItem("cartId");
      router.push(
        `/thank-you?orderId=${response.data.attributes.orderReference}`
      );
      // if (response) {
      //   var tempArr:any = [];
      //   setCartData(response);
      //   await response?.included?.map((item:any)=>{
      //     tempArr.push(item.id)
      //   })
      //   setItems(tempArr)
      //   setIsLoading(false);
      // } else {
      //   setIsLoading(false);
      // }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handlePaymentSeclection = async (id: any) => {
    paymentMethods?.map((item: any) => {
      if (item.id == id) {
        setSelectedPayment({
          paymentMethodName: item?.attributes?.paymentMethodName,
          paymentProviderName: item?.attributes?.paymentProviderName,
          paymentSelection: (item?.attributes?.priority)?.toString() || "1",
        });
      }
    });
  };
  const handleAddressSeclection = async (id: any) => {
    addresses?.map((item: any) => {
      if (item.id == id) {
        setSelectedAddress({
          ...item?.attributes,
          id: item.id,
        });
      }
    });
  };
  const handleShipmentSeclection = async (e: any) => {
    // setSelectedShipment(id);
    console.log(e)
  };
  console.log(isLoading)
  return (
    <Layout>
      <section
        className="cart"
        style={{ color: "black", padding: "80px" }}
      >
        <div className="container">
          <div className="cart__intro">
            <h3 className="cart__title">Shipping and Payment</h3>
            <CheckoutStatus step="checkout" />
          </div>
          <div className="checkout-content">
            <div className="checkout__col-8" style={{ width: "60%" }}>
              <div className="block">
                <h3 className="block__title">Your cart</h3>
                <CheckoutItems />
              </div>
            </div>
            <div className="checkout__col-4">
              <div className="block">
                {data &&
                  shipmentMethods &&
                  paymentMethods &&
                  shipments &&
                  addresses && (
                    <div className="block">
                      <div style={{ background: "#f0f0f0", padding: "1rem 1.25rem", height: "114px", width: "18rem", marginBottom: "0.5rem" }}>
                        <h3 className="block__title" style={{ fontWeight: "500", fontSize: "0.875rem", lineHeight: "1.4", display: "block", color: "#333", fontFamily: "'Circular', sans-serif" }}>Address information</h3>
                        <hr style={{ borderTop: "1px solid #ccc", margin: "0.9375rem -1.05rem" }} />
                        <form className="form">
                          <div className="form__input-row form__input-row--two">
                            <div
                              className="select-wrapper select-form"
                              style={{ width: "100%", right: "0px" }}
                            >
                              <select
                                className="form__input form__input--sm" style={{ marginTop: "-12px", marginLeft: "-25px", fontSize: '0.75rem', color: "#8f8f8f", fontWeight: "400", fontFamily: "'Circular', sans-serif" }}
                                onChange={(e) => handleAddressSeclection(e.target.value)}
                              >
                                <option style={{ color: "#8f8f8f", fontSize: '0.75rem' }}>Select Address</option>
                                {addresses.map((val: any) => {
                                  return (
                                    <option value={val.id}>
                                      {val.attributes.address1}, {val.attributes.address2}, {val.attributes.city}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div style={{ background: "#f0f0f0", padding: "1rem 1.25rem", height: "114px", width: "18rem", marginBottom: "0.5rem" }}>
                        <h3 className="block__title" style={{ fontWeight: "500", fontSize: "0.875rem", lineHeight: "1.4", display: "block", color: "#333", fontFamily: "'Circular', sans-serif" }}>Payment method</h3>
                        <hr style={{ borderTop: "1px solid #ccc", margin: "0.9375rem -1.05rem" }} />
                        <form className="form">
                          <div className="form__input-row form__input-row--two">
                            <div
                              className="select-wrapper select-form"
                              style={{ width: "100%" }}
                            >
                              <select
                                className="form__input form__input--sm" style={{ marginTop: "-12px", marginLeft: "-25px", fontSize: '0.75rem', color: "#8f8f8f", fontWeight: "400", fontFamily: "'Circular', sans-serif" }}
                                onChange={(e) =>
                                  handlePaymentSeclection(e.target.value)
                                }
                              >
                                <option style={{ color: "#8f8f8f", fontSize: '0.75rem' }}>Select Payment Method</option>
                                {paymentMethods.map((val: any) => {
                                  return (
                                    <option value={val.id}>
                                      {val.attributes.paymentMethodName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div style={{ background: "#f0f0f0", padding: "1rem 1.25rem", height: "114px", width: "18rem", marginBottom: "0.5rem" }}>
                        <h3 className="block__title" style={{ fontWeight: "500", fontSize: "0.875rem", lineHeight: "1.4", display: "block", color: "#333", fontFamily: "'Circular', sans-serif" }}>Shipment method</h3>
                        <hr style={{ borderTop: "1px solid #ccc", margin: "0.2rem -1rem" }} />
                        <form className="form">
                          <div className="form__input-row form__input-row--two">
                            <div
                              className="select-wrapper select-form"
                              style={{ width: "100%" }}
                            >
                              <select
                                className="form__input form__input--sm" style={{ marginTop: "-12px", marginLeft: "-25px", fontSize: '0.75rem', color: "#8f8f8f", fontWeight: "400", fontFamily: "'Circular', sans-serif" }}
                                onChange={(e) =>
                                  handleShipmentSeclection(e.target.value)
                                }
                              >
                                <option style={{ color: "#8f8f8f", fontSize: '0.75rem' }}>Select Shipment Method</option>
                                {shipmentMethods.map((val: any) => {
                                  return (
                                    <option value={val.id}>
                                      {val.attributes.name} &#91;
                                      {val.attributes.currencyIsoCode}-
                                      {val.attributes.price} &#93;
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                {/* <div style={{ background: "#f0f0f0", padding: "1rem 1.25rem", height: "364px", width: "17rem", marginBottom: "0.5rem" }}>
                  <div className="checkout-total" style={{ background: "#f0f0f0", display: "flex", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ padding: "1rem 1.25rem", margin: "0" }}>Sub Total cost</p>
                      <hr style={{ borderTop: "1px solid #ccc", margin: "0.9375rem -1.05rem" }} />
                      <p style={{ padding: "1rem 1.25rem", margin: "0" }}>Tax</p>
                      <hr style={{ borderTop: "1px solid #ccc", margin: "0.9375rem -1.05rem" }} />
                      <p style={{ padding: "1rem 1.25rem", margin: "0", color: "green" }}>Discount Total cost</p>
                      <hr style={{ borderTop: "1px solid #ccc", margin: "0.9375rem -1.05rem" }} />
                      <p style={{ padding: "1rem 1.25rem", margin: "0", color: "#800000" }}>Total cost</p>
                    </div>

                    <div style={{ flex: 1, textAlign: "right" }}>
                      <h3 style={{ padding: "1rem 1.25rem", margin: "0" }}>
                        {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.subtotal}
                      </h3>
                      <hr style={{ borderTop: "1px solid #ccc", margin: "0.9375rem -1.05rem" }} />
                      <h3 style={{ padding: "1rem 1.25rem", margin: "0" }}>

                        + {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.taxTotal}
                      </h3>
                      <hr style={{ borderTop: "1px solid #ccc", margin: "0.9375rem -1.05rem" }} />
                      <h3 style={{ color: "green", padding: "1rem 1.25rem", margin: "0" }}>
                        - {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.discountTotal}
                      </h3>
                      <hr style={{ borderTop: "1px solid #ccc", margin: "0.9375rem -1.05rem" }} />
                      <h3 style={{ color: "#800000", padding: "1rem 1.25rem", margin: "0" }}>
                        = {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.priceToPay}
                      </h3>
                    </div>
                  </div>
                </div> */}

                {/* new */}
                <div style={{ background: "#f0f0f0", display: "flex", flexDirection: "column", padding: "1rem", height: "269px", width: "18rem", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ flex: 1, marginRight: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                      <p style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", fontWeight: "300", whiteSpace: "nowrap", display: "flex", justifyContent: "space-between", fontFamily: "'Circular', sans-serif" }}>Sub Total cost</p>


                      <h3 style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", display: "flex", justifyContent: "space-between" }}>
                        {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.subtotal}
                      </h3>
                    </div>
                  </div>
                  <hr style={{ borderTop: "1px solid #ccc", margin: "0.2rem -1rem" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ flex: 1, marginRight: "0.5rem", fontSize: "0.875rem", fontWeight: "300", display: "flex", justifyContent: "space-between" }}>
                      <p style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", fontWeight: "300", display: "flex", justifyContent: "space-between", fontFamily: "'Circular', sans-serif" }}>Tax</p>
                      <h3 style={{ padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", display: "flex", justifyContent: "space-between" }}>

                        + {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.taxTotal}
                      </h3>
                    </div>

                  </div>
                  <hr style={{ borderTop: "1px solid #ccc", margin: "0.2rem -1rem" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ flex: 1, marginRight: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                      <p style={{ padding: "1rem 1.25rem", margin: "0", color: "green", fontSize: "0.875rem", fontWeight: "300", display: "flex", fontFamily: "'Circular', sans-serif", justifyContent: "space-between" }}>Discount Total</p>


                      <h3 style={{ color: "green", padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", overflow: "auto", display: "flex", justifyContent: "space-between" }}>
                        - {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.discountTotal}
                      </h3>
                    </div>

                  </div>
                  <hr style={{ borderTop: "1px solid #ccc", margin: "0.2rem -1rem" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ flex: 1, marginRight: "0.5rem", fontSize: "0.875rem", fontWeight: "300", display: "flex", justifyContent: "space-between" }}>
                      <p style={{ padding: "1rem 1.25rem", margin: "0", color: "#800000", fontFamily: "'Circular', sans-serif" }}>Total cost</p>


                      <h3 style={{ color: "#800000", padding: "1rem 1.25rem", margin: "0", fontSize: "0.875rem", }}>
                        = {CURRENCY_SYMBOLE} {cartData?.data?.attributes?.totals?.priceToPay}
                      </h3>
                    </div>
                  </div>
                  <hr style={{ borderTop: "1px solid #ccc", margin: "0.9375rem -1.05rem" }} />
                </div>

                {/*  */}

              </div>



              <div className="cart-actions__items-wrapper">
                <button
                  type="button"
                  style={{ width: "107%", background: "rgb(207, 18, 46" }}
                  className="btn btn--rounded btn--yellow"
                  onClick={() => orderConfirm()}
                >
                  Proceed to payment
                </button>
              </div>
            </div>
          </div>

          {/* <div className="cart-actions cart-actions--checkout">
            <a href="/cart" className="cart__btn-back">
              <i className="icon-left"></i> Back
            </a>
            <div className="cart-actions__items-wrapper">
              <button
                type="button"
                className="btn btn--rounded btn--yellow"
                onClick={(e) => orderConfirm()}
              >
                Proceed to payment
              </button>
            </div>
          </div> */}
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
