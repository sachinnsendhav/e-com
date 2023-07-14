import Layout from "../../layouts/Main";
import CheckoutStatus from "../../components/checkout-status";
import CheckoutItems from "../../components/checkout/items/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API_URL } from "config";

const CheckoutPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [cartData, setCartData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [shipments, setShipments] = useState<array[]>([]);
  const [shipmentMethods, setShipmentMethods] = useState<array[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<array[]>([]);
  const [addresses, setAddresses] = useState<array[]>([]);
  const [items, setItems] = useState<array[]>([]);

  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [selectedPayment, setSelectedPayment] = useState<any>();
  const [selectedShipment, setSelectedShipment] = useState<any>();

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
          setShipmentMethods((shipmentMethods) => [
            ...shipmentMethods,
            element,
          ]);
        } else if (element.type === "payment-methods") {
          setPaymentMethods((paymentMethods) => [...paymentMethods, element]);
        } else if (element.type === "shipments") {
          setShipments((shipments) => [...shipments, element]);
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
            salutation: "sonia",
            firstName: "string",
            lastName: "string",
          },
          idCart: cartId,
          billingAddress: selectedAddress,
          payments: [
            {
              ...selectedPayment,
            },
          ],
          shipments: [
            {
              shippingAddress: selectedAddress,
              items: items,
              idShipmentMethod: 1,
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
    paymentMethods?.map((item: any, index: number) => {
      if (item.id == id) {
        setSelectedPayment({
          paymentMethodName: item?.attributes?.paymentMethodName,
          paymentProviderName: item?.attributes?.paymentProviderName,
          paymentSelection: item?.attributes?.priority || 1,
        });
      }
    });
  };
  const handleAddressSeclection = async (id: any) => {
    addresses?.map((item: any, index: number) => {
      if (item.id == id) {
        setSelectedAddress({
          ...item?.attributes,
          id: item.id,
        });
      }
    });
  };
  const handleShipmentSeclection = async (id: any) => {
    setSelectedShipment(id);
  };
  return (
    <Layout>
      <section className="cart" style={{ background:'#FFFBED', color:'black', padding:"80px"}}>
        <div className="container">
          <div className="cart__intro">
            <h3 className="cart__title">Shipping and Payment</h3>
            <CheckoutStatus step="checkout" />
          </div>
          <div className="checkout-content">
            <div className="checkout__col-8" style={{width:"60%"}}>
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
                    <h3 className="block__title">Address information</h3>
                    <form className="form">
                      <div className="form__input-row form__input-row--two">
                          <div className="select-wrapper select-form" style={{width:'100%'}}>
                            <select
                              className="form__input form__input--sm"
                              onChange={(e) =>
                                handleAddressSeclection(e.target.value)
                              }
                            >
                              <option>Select Address</option>
                              {addresses.map((val: any) => {
                                return (
                                  <option value={val.id}>
                                    {val.attributes.address1},{" "}
                                    {val.attributes.address2},{" "}
                                    {val.attributes.city},{" "}
                                    {val.attributes.company}, Country :{" "}
                                    {val.attributes.country}, Country Code :{" "}
                                    {val.attributes.iso2Code}, Phone:{" "}
                                    {val.attributes.phone}, ZIPCODE :
                                    {val.attributes.zipCode}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                      </div>
                    </form>
                    <h3 className="block__title">Payment method</h3>

                    <form className="form">
                      <div className="form__input-row form__input-row--two">
                          <div className="select-wrapper select-form" style={{width:'100%'}}>
                            <select
                              className="form__input form__input--sm"
                              onChange={(e) =>
                                handlePaymentSeclection(e.target.value)
                              }
                            >
                              <option>Select Payment Method</option>
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

                    <h3 className="block__title">Shipment method</h3>
                    <form className="form">
                      <div className="form__input-row form__input-row--two">
                          <div className="select-wrapper select-form" style={{width:'100%'}}>
                            <select
                              className="form__input form__input--sm"
                              onChange={(e) =>
                                handleShipmentSeclection(e.target.value)
                              }
                            >
                              <option>Select Shipment Method</option>
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
              )}
                <div className="checkout-total">
                  <div>
                    <p style={{ paddingBottom: "12px" }}>Sub Total cost</p>
                    <p style={{ paddingBottom: "12px" }}>Tax</p>
                    <p style={{ paddingBottom: "12px" , color:"green"}}>Discount Total cost</p>
                    <hr></hr>

                    <p style={{ paddingBottom: "12px" , color:"#800000"}}>Total cost</p>
                  </div>
                  <div>
                    <h3 style={{ paddingBottom: "12px" }}>
                      {" "}
                      &euro; {cartData?.data?.attributes?.totals?.subtotal}
                    </h3>
                    <h3 style={{ paddingBottom: "12px" }}>
                      + &euro; {cartData?.data?.attributes?.totals?.taxTotal}
                    </h3>
                    <h3 style={{ paddingBottom: "12px", color: "green" }}>
                      - &euro;{" "}
                      {cartData?.data?.attributes?.totals?.discountTotal}
                    </h3>
                    <hr></hr>
                    <h3 style={{ paddingBottom: "12px",color:"#800000" }}>
                      {" "}
                      = &euro; {cartData?.data?.attributes?.totals?.priceToPay}
                    </h3>
                  </div>
                  
                </div>
                
              </div>
              <div className="cart-actions__items-wrapper">
              <button
                type="button"
                style={{width:'100%'}}
                className="btn btn--rounded btn--yellow"
                onClick={(e) => orderConfirm()}
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
