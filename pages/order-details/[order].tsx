import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Layout from '../../layouts/Main';
import Footer from 'components/footer';
import { API_URL, CURRENCY_SYMBOLE } from 'config';
import Modal from 'react-modal';
// import ProfileSection from '../../components/user/profileSection'
import Loader from '../../components/loader'

const customStyles: any = {
  content: {
    top: '60%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#f0f0f0',
    width: "30%"
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAuthToken(localStorage.getItem('token'))
  }, [])
  const getOrderData = async () => {
    setLoading(true)
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
    setLoading(false)
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
    subtitle.style.color = 'rgb(207, 18, 46)';
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Layout>
      <div>
        <div style={{ paddingInline: "100px" }}>
          <div style={{ display: "flex", marginTop: "1rem" }}>
            {/* <ProfileSection showBlock={showBlock} setShowBlock={setShowBlock} /> */}
            <div style={{ width: "100%", margin: "auto" }}>
              {loading ? <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "20px" }}>
                <Loader />
              </div> :
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <h1 style={{
                      fontWeight: "500",
                      fontSize: "1.5rem",
                      lineHeight: "1.4",
                      display: "block",
                      color: "#333",
                    }}>Order Details</h1>
                    <button onClick={() => openModal()} style={{ padding: "10px", fontWeight: "bold", color: "white", background: "rgb(207, 18, 46)", borderRadius: "1px" }}> Post Order Form</button>
                  </div>
                  <div style={{ width: "100%", background: "#f0f0f0", padding: "1rem" }}>
                    <p style={{
                      fontSize: "1rem",
                      fontWeight: "400",
                      color: "#4c4c4c"
                    }}>Order Id : <span style={{ fontWeight: "700" }}>{orderId}</span></p>
                    <p style={{
                      fontSize: "1rem",
                      fontWeight: "400",
                      color: "#4c4c4c",
                      paddingTop: "10px"
                    }}>Date : <span style={{ fontWeight: "700" }}>{orderData[0]?.createdAt.split(' ')[0]}</span></p>
                  </div>
                  <div style={{ display: "flex", paddingTop: "1.5rem" }}>
                    <div style={{
                      width: "70%",
                      margin: "0.25rem",
                      marginLeft: "0rem"
                    }}>
                      {productData.map((item: any) => {
                        return (
                          <div style={{
                            width: "100%",
                            border: "0.125rem solid #f0f0f0",
                            borderRadius: "2px",
                            display: "flex",
                            marginBottom:".5rem"
                          }}>
                            <div style={{
                              width: "30%",
                              background: "#f0f0f0",
                              display: "flex",
                              justifyContent: "center",
                              padding: "1rem"
                            }}>
                              <img src={item.metadata.image} style={{ width: "100%", height: "150px", objectFit: "contain" }} alt="product" />
                            </div>
                            <div style={{ width: "65%", padding: "1rem" }}>
                              <p style={{
                                fontSize: "1rem",
                                fontWeight: "500",
                                color: "#4c4c4c"
                              }}>{item.name}</p>
                              <p style={{
                                fontSize: "1rem",
                                fontWeight: "400",
                                color: "#4c4c4c",
                                paddingTop: "10px"
                              }}><span style={{ fontWeight: "500" }}>Sku. : </span>{item.sku}</p>
                              <p style={{
                                fontSize: "1rem",
                                fontWeight: "400",
                                color: "#4c4c4c",
                                paddingTop: "10px"
                              }}><span style={{ fontWeight: "500" }}>Quantity :</span> {item.quantity}</p>
                              <p style={{
                                fontSize: "1rem",
                                fontWeight: "400",
                                color: "#4c4c4c",
                                paddingTop: "10px"
                              }}><span style={{ fontWeight: "500" }}>Price : </span>{CURRENCY_SYMBOLE}{item.unitPrice}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ width: "35%", margin: "0.25rem" }}>
                      <div style={{ background: "#f0f0f0", padding: "1rem", marginBottom: "1rem" }}>
                        <p style={{
                          fontWeight: "500",
                          fontSize: "1.125rem",
                          lineHeight: "1.4",
                          display: "block",
                          color: "#333",
                          paddingBottom: "0.625rem"
                        }}> Delivery Address</p>
                        <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px" }}>{orderData[0]?.billingAddress?.salutation} <span style={{ fontWeight: "bold", color: "#333" }}>{orderData[0]?.billingAddress?.firstName} {orderData[0]?.billingAddress?.lastName}</span> </p>
                        <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px" }}>{orderData[0]?.billingAddress?.company}</p>
                        <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px" }}>{`${orderData[0]?.billingAddress?.address1}, ${orderData[0]?.billingAddress?.address2}`}</p>
                        <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px" }}>{orderData[0]?.billingAddress?.zipCode}, {orderData[0]?.billingAddress?.city}, {orderData[0]?.billingAddress?.company}</p>
                        <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px" }}>{orderData[0]?.billingAddress?.phone}</p>
                      </div>
                      {orderData[0]?.shipments.length > 0 ?
                        <div style={{ background: "#f0f0f0", padding: "1rem", marginBottom: "1rem" }}>
                          <p style={{
                            fontWeight: "500",
                            fontSize: "1.125rem",
                            lineHeight: "1.4",
                            display: "block",
                            color: "#333",
                            paddingBottom: "0.625rem"
                          }}>Delivery method</p>
                          <p style={{ textTransform: "uppercase", fontSize: "15px" }}>{orderData[0]?.shipments[0]?.carrierName}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px" }}>
                            <p style={{ color: "#8f8f8f", fontSize: "15px", }}>{orderData[0]?.shipments[0]?.shipmentMethodName}</p>
                            <p style={{ color: "#8f8f8f", fontSize: "15px", }}>{CURRENCY_SYMBOLE}{orderData[0]?.shipments[0]?.defaultNetPrice}</p>
                          </div>
                        </div> : null}
                      <div style={{ background: "#f0f0f0", padding: "1rem", marginBottom: "1rem" }}>
                        <p style={{
                          fontWeight: "500",
                          fontSize: "1.125rem",
                          lineHeight: "1.4",
                          display: "block",
                          color: "#333",
                          paddingBottom: "0.625rem"
                        }}>Delivery method</p>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", }}>Subtotal:</p>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", }}>{CURRENCY_SYMBOLE}{orderData[0]?.totals?.subtotal}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", }}>Discount Total:</p>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", }}>{CURRENCY_SYMBOLE}{orderData[0]?.totals?.discountTotal}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", }}>Expense Total:</p>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", }}>{CURRENCY_SYMBOLE}{orderData[0]?.totals?.expenseTotal}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", }}>Tax Total:</p>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", }}>{CURRENCY_SYMBOLE}{orderData[0]?.totals?.taxTotal}</p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderTop: "1px solid #b2b2b2" }}>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", fontWeight: "700" }}>Grand Total:</p>
                          <p style={{ color: "#8f8f8f", fontSize: "15px", fontWeight: "700" }}>{CURRENCY_SYMBOLE}{orderData[0]?.totals?.grandTotal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>}
            </div>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Post Order Form</h2>
              <button onClick={closeModal} style={{ background: "black", borderRadius: "1px", color: "white", paddingInline: "10px" }}>X</button>
            </div>
            <div style={{ paddingTop: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", padding: "4px" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  color: "#333",
                }}>Material Name</label>
                <input type='text' placeholder='Enter material name' value={materialName} onChange={(e) => setMaterialName(e.target.value)} style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2rem 'Circular', sans-serif",
                  padding: "0 0.15rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", padding: "4px" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  color: "#333",
                }}>Quantity</label>
                <input type='text' placeholder='Enter quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", padding: "4px" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  color: "#333",
                }}>Batch Number</label>
                <input type='text' placeholder='Enter batch number' value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", padding: "4px" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  color: "#333",
                }}>Concentration</label>
                <input type='text' placeholder='Enter concentration' value={concentration} onChange={(e) => setConcentration(e.target.value)} style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", padding: "4px" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  color: "#333",
                }}>Storage</label>
                <input type='text' placeholder='Enter storage' value={storage} onChange={(e) => setStorage(e.target.value)} style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <button style={{ padding: "10px", fontWeight: "bold", color: "white", background: "rgb(207, 18, 46)", borderRadius: "1px" }} onClick={() => postOrderStatus ? updatePostOrderForm(orderId) : addTextArticle(orderId)}>Submit</button>
              </div>
            </div>
          </div>

        </Modal>
      </div>
      <Footer />
    </Layout>

  )
}

export default orderDetailsPage