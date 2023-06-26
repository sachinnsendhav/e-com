import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Layout from '../../layouts/Main';
import Footer from 'components/footer';
function orderDetailsPage() {
    const router = useRouter();
    const orderId = router.query.order;
    const [authToken, setAuthToken] = useState<any>()
    const [orderData, setOrderData] = useState<any[]>([]);
    useEffect(() => {
        setAuthToken(localStorage.getItem('token'))
    }, [])
    console.log("first", orderId, authToken)
    const getOrderData = async () => {
        if (authToken) {
            if (orderId) {
                try {
                    const resp = await fetch(`https://glue.de.faas-suite-prod.cloud.spryker.toys/orders/${orderId}`, {
                        method: "GET",
                        headers: {
                            authorization: `Bearer ${authToken}`
                        }
                    });
                    const result = await resp.json();
                    const orderDetail = result.data.attributes
                    orderDetail.id = orderId
                    setOrderData((orderData) => [...orderData, orderDetail])
                } catch {
                    setOrderData([])
                    // router.push("/proifle")
                }
            }

        }
    }
    console.log("orderData", orderData)
    useEffect(() => {
        getOrderData()
    }, [orderId, authToken])

    return (
        <Layout>
            <div>
                {orderData.length > 0
                    ?
                    <div>
                        <h1 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", paddingTop: "10px" }}>Oder Details</h1>
                        <div style={{ width: "80%", border: "1px solid #7f7f7f", margin: "auto", borderRadius: "5px", marginTop: "10px" }}>
                            <div style={{ padding: "10px", borderBottom: "1px solid #7f7f7f", display: "flex", justifyContent: "space-between" }}>
                                <div style={{ fontWeight: "bold" }}>Order Id : {orderId}</div><div style={{ fontWeight: "bold" }}> Total Item : {orderData[0]?.items.length}</div>
                            </div>
                            <div style={{ padding: "10px", display: "flex", justifyContent: "space-around" }}>
                                <div style={{ width: "50%", padding: "10px" }}>
                                    <h1>Items </h1>
                                    {orderData[0].items.map((item: any) => {
                                        return (
                                            <div style={{ display: "flex", border: "1px solid #7f7f7f", marginTop: "5px" }}>
                                                <div>
                                                    <img src={item.metadata.image} style={{ height: "100px", width: "100px", objectFit: "contain" }} />
                                                </div>
                                                <div style={{ padding: "10px" }}>
                                                    <p>{item.name}</p>
                                                    <p style={{ paddingTop: "5px" }}>Quantity : {item.quantity}</p>
                                                    <p style={{ paddingTop: "5px" }}>Price : {item.unitPrice}</p>
                                                    <p style={{ paddingTop: "5px" }}>Discount : {item.unitDiscountAmountAggregation}</p>

                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div style={{ width: "50%", padding: "10px" }}>
                                    <h1> Billing Address</h1>
                                    <div>
                                        <div style={{ display: "flex" }}>
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Address </p><p>{orderData[0].billingAddress.address1 + " " + orderData[0].billingAddress.address2} </p>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>City </p><p>{orderData[0].billingAddress.city} </p>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Country </p><p>{orderData[0].billingAddress.country} </p>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Company </p><p>{orderData[0].billingAddress.company} </p>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>iso2Code</p><p>{orderData[0].billingAddress.iso2Code} </p>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Zip code</p><p>{orderData[0].billingAddress.zipCode} </p>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Phone No.</p><p>{orderData[0].billingAddress.phone} </p>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Salutation</p><p>{orderData[0].billingAddress.salutation} </p>
                                        </div>
                                    </div>
                                </div>

                                {/* <h1 style={{ paddingTop: "10px" }}> Payment Details</h1> */}
                                <div>

                                </div>
                            </div>
                            <div style={{ padding: "10px", borderTop: "1px solid #7f7f7f", display: "flex", justifyContent: "space-between" }}>
                                <div style={{ fontWeight: "bold" }}>Item Status : {orderData[0].itemStates[0]}</div><div style={{ fontWeight: "bold" }}> Total Amount : {orderData[0]?.totals.grandTotal}</div>
                            </div>
                        </div>
                    </div>
                    :
                    <div>Loading....</div>
                }
            </div>
            <Footer />
        </Layout>
    )
}

export default orderDetailsPage