import Layout from '../../layouts/Main';
import CheckoutStatus from '../../components/checkout-status';
import CheckoutItems from '../../components/checkout/items';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const CheckoutPage = () => {
  const router = useRouter()
  const [data, setData] = useState([]);
  const [shipments, setShipments] = useState<array[]>([]);
  const [shipmentMethods, setShipmentMethods] = useState<array[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<array[]>([]);
  const [addresses, setAddresses] = useState<array[]>([]);

  const getCheckoutDetails = async () => {
    try {
      const authToken = localStorage.getItem('token')
      const data: any = {
        "data": {
          "attributes": {
            "idCart": "b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc",
            "shipmentMethods": []
          },
          "type": "checkout-data"
        }
      }

      const resp = await fetch(`https://glue.de.faas-suite-prod.cloud.spryker.toys/checkout-data?include=shipments%2Cshipment-methods%2Caddresses%2Cpayment-methods%2Citems`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
      })
      const reslut = await resp.json();
      setData(reslut?.included)
      console.log("ckeckout---data", reslut)
    } catch {
      console.log("errrrrrr")
      router.push("/login")
    }
  }
  useEffect(() => {
    getCheckoutDetails()
  }, [])

  useEffect(() => {
    setShipmentMethods([])
    setPaymentMethods([])
    setShipments([])
    setAddresses([])
    if (data.length > 0) {
      data.forEach((element: any) => {
        if (element.type === "shipment-methods") {
          setShipmentMethods((shipmentMethods) => [...shipmentMethods, element])
        } else if (element.type === "payment-methods") {
          setPaymentMethods((paymentMethods) => [...paymentMethods, element])
        } else if (element.type === "shipments") {
          setShipments((shipments) => [...shipments, element])
        } else if (element.type === "addresses") {
          setAddresses((addresses) => [...addresses, element])
        }
      });
    }
  }, [data])

  console.log("data", data)
  console.log("shipmentMethods", shipmentMethods)
  console.log("paymentMethods", paymentMethods)
  console.log("shipments", shipments)
  console.log("addresses", addresses)
  return (
    <Layout>
      <section className="cart">
        <div className="container">
          <div className="cart__intro">
            <h3 className="cart__title">Shipping and Payment</h3>
            <CheckoutStatus step="checkout" />
          </div>

          <div className="checkout-content">
            <div className="checkout__col-6">

              <div className="block">
                <h3 className="block__title">Address information</h3>
                <form className="form">
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select className="form__input form__input--sm">
                          <option>Select Address</option>
                          {addresses.map((val: any) => {
                            return (
                              <option value="Argentina">{val.attributes.address1}</option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="block">
                <h3 className="block__title">Payment method</h3>

                <form className="form">
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select className="form__input form__input--sm">
                          <option>Select Payment Method</option>
                          {paymentMethods.map((val: any) => {
                            return (
                              <option value="Argentina">{val.attributes.paymentMethodName}</option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
                {/* <ul className="round-options round-options--three">
                  <li className="round-item">
                    <img src="/images/logos/paypal.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/visa.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/mastercard.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/maestro.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/discover.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/ideal-logo.svg" alt="Paypal" />
                  </li>
                </ul> */}
              </div>

              <div className="block">
                <h3 className="block__title">Shipment method</h3>
                <form className="form">
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select className="form__input form__input--sm">
                          <option>Select Shipment Method</option>
                          {shipmentMethods.map((val: any) => {
                            return (
                              <option value="Argentina">{val.attributes.name}</option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
                {/* <ul className="round-options round-options--two">
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/inpost.svg" alt="Paypal" />
                    <p>$20.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dpd.svg" alt="Paypal" />
                    <p>$12.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dhl.svg" alt="Paypal" />
                    <p>$15.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/maestro.png" alt="Paypal" />
                    <p>$10.00</p>
                  </li>
                </ul> */}
              </div>
            </div>

            <div className="checkout__col-6">
              <div className="block">
                <h3 className="block__title">Your cart</h3>
                <CheckoutItems />

                <div className="checkout-total">
                  <p>Total cost</p>
                  <h3>100</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-actions cart-actions--checkout">
            <a href="/cart" className="cart__btn-back"><i className="icon-left"></i> Back</a>
            <div className="cart-actions__items-wrapper">
              <button type="button" className="btn btn--rounded btn--border">Continue shopping</button>
              <button type="button" className="btn btn--rounded btn--yellow">Proceed to payment</button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
};


export default CheckoutPage