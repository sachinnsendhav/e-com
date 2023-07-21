import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Layout from '../../layouts/Main';
import Footer from 'components/footer';
import { API_URL } from 'config';
import Modal from 'react-modal';

const customStyles: any = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
function orderDetailsPage() {
    const router = useRouter();
    const orderId: any = router.query.order;
    const [authToken, setAuthToken] = useState<any>()
    const [orderData, setOrderData] = useState<any[]>([]);
    const [productData, setProductData] = useState<any[]>([]);
    // const [configurableProduct, setConfigurableProduct] = useState<any[]>([]);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [materialName, setMaterialName] = useState<any>("")
    const [quantity, setQuantity] = useState<any>("")
    const [batchNumber, setBatchNumber] = useState<any>("")
    const [concentration, setConcentration] = useState<any>("")
    const [storage, setStorage] = useState<any>("");
    const [postOrderStatus, setPostOrderStatus] = useState<any>(false);

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
                    // setConfigurableProduct(modifiedArray)
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

    const getTextArticle = async (id: any) => {
        const resp = await fetch(`${API_URL}/TestArticle?q=${id}`, {
            method: "GET",
            headers: {
                "content-type": 'application/json'
            }
        });
        const result = await resp.json()
        if (result?.error) {
            console.log("sdfds")
            setPostOrderStatus(false)
        } else {
            setBatchNumber(result?.batch_number)
            setQuantity(result?.quantity);
            setConcentration(result?.concentration);
            setMaterialName(result?.material_name);
            setStorage(result?.storage)
            setPostOrderStatus(true)
            console.log('text-article-----', result)

        }

    }

    const addTextArticle = async (orderId: any) => {
        const str: string = orderId;
        const id = parseInt((str as string).split("--")[1]);
        const data: any = {
            id: id,
            material_name: materialName,
            quantity: quantity,
            batch_number: batchNumber,
            concentration: concentration,
            storage: storage,
            order_id: id,
            date: "01-01-0001"
        }
        const resp = await fetch(`${API_URL}/TestArticle`, {
            method: "POST",
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await resp.json();
        alert(result.success_message)
        closeModal()
        console.log("result--", result)
    }

    const updatePostOrderForm = async (orderId: any) => {
        const str: string = orderId;
        const id = parseInt((str as string).split("--")[1]);
        const data: any = {
            id: id,
            material_name: materialName,
            quantity: quantity,
            batch_number: batchNumber,
            concentration: concentration,
            storage: storage,
            order_id: id,
            date: "01-01-0001"
        }
        const resp = await fetch(`${API_URL}/TestArticle`, {
            method: "PATCH",
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await resp.json();
        alert(result.success_message)
        closeModal()
        console.log("result--", result)
    }
    useEffect(() => {
        if (orderId) {
            const str: string = orderId;
            const id = parseInt((str as string).split("--")[1]);
            getTextArticle(id);
        }
    }, [orderId])


    //for madal implementation
    let subtitle: any;

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <Layout>
  <div>
    {orderData.length > 0 ? (
      <div>
        <h1 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", paddingTop: "10px" }}>Order Details</h1>
        <div style={{ width: "80%", border: "1px solid #7f7f7f", margin: "auto", borderRadius: "5px", marginTop: "10px" }}>
          <div style={{ padding: "10px", borderBottom: "1px solid #7f7f7f", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: "bold" }}>Order Id: {orderId}</div>
            <div style={{ fontWeight: "bold" }}>
              Total Item: {orderData[0]?.items.length}
              <button style={{ padding: "5px", background: "#333", borderRadius: "5px", color: "white", marginLeft: "10px" }} onClick={() => openModal()}>Post Order Form</button>
            </div>
          </div>
          <div style={{ padding: "10px" }}>
            <div style={{ width: "100%", padding: "10px" }}>
              <h1></h1>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    {/* <th>Product</th>
                    <th>Name</th>
                    <th>Quantity</th> */}
                    <th>Discount</th>
                    <th>Tax</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((item: any) => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.metadata.image} style={{ height: "130px", width: "130px", objectFit: "contain" }} alt="product" />
                      </td>
                    <td style={{ padding: "0 80px" }}>{item.name}</td>
                    <td style={{ padding: "0 80px" }}>{item.quantity}</td>
                    <td style={{ padding: "0 80px" }}>{item.unitDiscountAmountAggregation}</td>
                    <td style={{ padding: "0 80px" }}>{item.taxRate}</td>
                    <td style={{ padding: "0 80px" }}>{item.unitPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ width: "100%", padding: "10px" }}>
              <h1></h1>
              <div style={{ display: "flex", justifyContent: "flex-end", margin: "0 30px 0 0" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <p style={{ fontWeight: "bold" }}>Discount Total:</p>
                    <p>&euro;{orderData[0].totals.discountTotal}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <p style={{ fontWeight: "bold" }}>Expense Total:</p>
                    <p>&euro;{orderData[0].totals.expenseTotal}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <p style={{ fontWeight: "bold" }}>Tax Total:</p>
                    <p>&euro;{orderData[0].totals.taxTotal}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <p style={{ fontWeight: "bold" }}>Sub total:</p>
                    <p>&euro;{orderData[0].totals.subtotal}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <p style={{ fontWeight: "bold" }}>Grand Total:</p>
                    <p>&euro;{orderData[0].totals.grandTotal}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr style={{ margin: "20px 0" }} />
          <div style={{ padding: "10px" }}>
            <h1 style={{ margin: '0 0 15px 5px' }} >Billing Address</h1>
            <div>
              <div style={{ display: "flex" }}>
                <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Address</p>
                <p>{orderData[0].billingAddress.address1 + " " + orderData[0].billingAddress.address2}</p>
              </div>
              <div style={{ display: "flex" }}>
                <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>City</p>
                <p>{orderData[0].billingAddress.city}</p>
              </div>
              <div style={{ display: "flex" }}>
                <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Country</p>
                <p>{orderData[0].billingAddress.country}</p>
              </div>
              <div style={{ display: "flex" }}>
                <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Company</p>
                <p>{orderData[0].billingAddress.company}</p>
              </div>
              <div style={{ display: "flex" }}>
                <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>iso2Code</p>
                <p>{orderData[0].billingAddress.iso2Code}</p>
              </div>
              <div style={{ display: "flex" }}>
                <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Zip code</p>
                <p>{orderData[0].billingAddress.zipCode}</p>
              </div>
              <div style={{ display: "flex" }}>
                <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Phone No.</p>
                <p>{orderData[0].billingAddress.phone}</p>
              </div>
            </div>
          </div>
          {/* <div style={{ padding: "10px", display: "flex", justifyContent: "space-between" }}> */}
            {/* <div style={{ fontWeight: "bold" }}> */}
              {/* Item Status : {orderData[0].itemStates[0]} */}
            {/* </div> */}
            {/* <div style={{ fontWeight: "bold" }}>Total Amount: &euro; {orderData[0]?.totals.grandTotal}</div> */}
          {/* </div> */}
        </div>
      </div>
    ) : (
      <div>Loading....</div>
    )}
    <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Post Order Form</h2>
                        <button onClick={closeModal} style={{ background: "black", borderRadius: "5px", color: "white", paddingInline: "10px" }}>X</button>
                    </div>
                    <div style={{ paddingTop: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", padding: "5px" }}>
                            <label style={{ color: "black" }}>Material Name</label>
                            <input type='text' placeholder='Enter material name' value={materialName} onChange={(e) => setMaterialName(e.target.value)} style={{ width: "300px", border: "1px solid #7f7f7f", height: "30px", borderRadius: "5px", padding: "5px" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", padding: "5px" }}>
                            <label style={{ color: "black" }}>Quantity</label>
                            <input type='text' placeholder='Enter quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ width: "300px", border: "1px solid #7f7f7f", height: "30px", borderRadius: "5px", padding: "5px" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", padding: "5px" }}>
                            <label style={{ color: "black" }}>Batch Number</label>
                            <input type='text' placeholder='Enter batch number' value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} style={{ width: "300px", border: "1px solid #7f7f7f", height: "30px", borderRadius: "5px", padding: "5px" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", padding: "5px" }}>
                            <label style={{ color: "black" }}>Concentration</label>
                            <input type='text' placeholder='Enter concentration' value={concentration} onChange={(e) => setConcentration(e.target.value)} style={{ width: "300px", border: "1px solid #7f7f7f", height: "30px", borderRadius: "5px", padding: "5px" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", padding: "5px" }}>
                            <label style={{ color: "black" }}>Storage</label>
                            <input type='text' placeholder='Enter storage' value={storage} onChange={(e) => setStorage(e.target.value)} style={{ width: "300px", border: "1px solid #7f7f7f", height: "30px", borderRadius: "5px", padding: "5px" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                            <button style={{ width: "75px", borderRadius: "5px", color: "white", background: "#333333", padding: "5px" }} onClick={() =>postOrderStatus? updatePostOrderForm(orderId): addTextArticle(orderId)}>Submit</button>
                        </div>
                    </div>
                </Modal>
            </div>
            <Footer />
        </Layout>

    )
}

export default orderDetailsPage