import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Layout from '../../layouts/Main';
import Footer from 'components/footer';
import { API_URL } from 'config';
function orderDetailsPage() {
    const router = useRouter();
    const orderId = router.query.order;
    const [authToken, setAuthToken] = useState<any>()
    const [orderData, setOrderData] = useState<any[]>([]);
    const [productData, setProductData] = useState<any[]>([]);
    const [configurableProduct, setConfigurableProduct] = useState<any[]>([]);
    useEffect(() => {
        setAuthToken(localStorage.getItem('token'))
    }, [])
    const getOrderData = async () => {
        if (authToken) {
            if (orderId) {
                try {
                    const resp = await fetch(`${API_URL}/orders/${orderId}`, {
                        method: "GET",
                        headers: {
                            authorization: `Bearer ${authToken}`
                        }
                    });
                    const result = await resp.json();
                    const products = result.data.attributes.items.filter((item: any) => item.salesOrderConfiguredBundle === null);
                    const configureProducts = result.data.attributes.items.filter((item: any) => item.salesOrderConfiguredBundle !== null);
                    console.log("products", products);
                    const skuSet = new Set();
                    const uniqueArray: any = [];
                    products.forEach((item: any) => {
                        const { sku } = item;
                        if (!skuSet.has(sku)) {
                            skuSet.add(sku);
                            uniqueArray.push(item);
                        } else {
                            const existingItem = uniqueArray.find((item: any) => item.sku === sku);
                            if (existingItem) {
                                existingItem.quantity += item.quantity;
                            }
                        }
                    });
                    setProductData(uniqueArray);

                    const modifiedArray: any[] = [];
                    const tempMap: any = {};
                    configureProducts.forEach((item: any) => {
                        const { configurableBundleTemplateUuid, salesOrderConfiguredBundle: { idSalesOrderConfiguredBundle } } = item;
                        const key = `${configurableBundleTemplateUuid}_${idSalesOrderConfiguredBundle}`;
                        if (!tempMap[key]) {
                            const newObj = {
                                name: item.salesOrderConfiguredBundle.name,
                                idSalesOrderConfiguredBundle,
                                configurableBundleTemplateUuid,
                                data: [item]
                            };
                            modifiedArray.push(newObj);
                            tempMap[key] = newObj;
                        } else {
                            tempMap[key].data.push(item);
                        }
                    });
                    setConfigurableProduct(modifiedArray)
                    const orderDetail = result.data.attributes
                    orderDetail.id = orderId
                    setOrderData((orderData) => [...orderData, orderDetail])
                } catch {
                    router.push("/login")
                }
            }
        }
    }
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
                                    {productData.map((item: any) => {
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
                                    {configurableProduct?.length && configurableProduct?.map((item: any, index: number) => {
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
                                                </div>
                                                <div style={{ padding: "5px" }}>
                                                    {item?.data?.map((val: any) => {
                                                        return (
                                                            <div
                                                                style={{
                                                                    margin: "auto",
                                                                    width: "100%",
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
                                                                                src={val?.metadata?.image}
                                                                                style={{
                                                                                    width: "100%",
                                                                                    background: "#dedede",
                                                                                    objectFit: "cover",
                                                                                }}
                                                                            />
                                                                        </div>

                                                                        <div style={{ padding: "20px", color: "black" }}>
                                                                            {val.name}
                                                                            <p style={{ color: "black", fontWeight: "bold" }}>
                                                                                {" "}
                                                                                SKU : {val.sku}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            paddingTop: "20px",
                                                                            color: "black",
                                                                            fontWeight: "bold",
                                                                        }}
                                                                    >
                                                                        &euro;{(val.quantity) * (val.sumNetPrice)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
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
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Phone No.</p>
                                            <p>{orderData[0].billingAddress.phone} </p>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Salutation</p><p>{orderData[0].billingAddress.salutation} </p>
                                        </div>
                                    </div>

                                    <h1 style={{ paddingTop: "10px" }}>Payment Details</h1>
                                    <div style={{ display: "flex" }}>
                                        <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Discount Total</p>
                                        <p style={{ fontWeight: "bold" }}>&euro;{orderData[0].totals.discountTotal} </p>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Expense Total</p>
                                        <p style={{ fontWeight: "bold" }}>&euro;{orderData[0].totals.expenseTotal} </p>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Tax Total</p>
                                        <p style={{ fontWeight: "bold" }}>&euro;{orderData[0].totals.taxTotal} </p>
                                    </div>

                                    <div style={{ display: "flex" }}>
                                        <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Sub total</p>
                                        <p style={{ fontWeight: "bold" }}>&euro;{orderData[0].totals.subtotal} </p>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Grand Total</p>
                                        <p style={{ fontWeight: "bold" }}>&euro;{orderData[0].totals.grandTotal} </p>
                                    </div>
                                </div>

                                {/* <h1 style={{ paddingTop: "10px" }}> Payment Details</h1> */}
                                <div>

                                </div>
                            </div>
                            <div style={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
                                <div style={{ fontWeight: "bold" }}>
                                    {/* Item Status : {orderData[0].itemStates[0]} */}
                                </div>
                                <div style={{ fontWeight: "bold" }}> Total Amount : &euro; {orderData[0]?.totals.grandTotal}</div>
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