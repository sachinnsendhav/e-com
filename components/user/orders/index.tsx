import React, { useEffect, useState } from "react"

type AddressType = {
  show: boolean;
}

const Orders = ({ show }: AddressType) => {
  const style = {
    display: show ? 'flex' : 'none',
  }
  const [authToken, setAuthToken] = useState<any>()
  const [order, setOrder] = useState([]);
  const [orderData, setOrderData] = useState<any[]>([]);
  useEffect(() => {
    setAuthToken(localStorage.getItem('token'))
  }, [])
  const getOrder = async () => {

    if (authToken) {
      try {
        const resp = await fetch('https://glue.de.faas-suite-prod.cloud.spryker.toys/customers/DE--21/orders', {
          method: "GET",
          headers: {
            authorization: `Bearer ${authToken}`
          }
        })
        const result = await resp.json()
        setOrder(result.data)
      } catch {
        setOrder([])
        localStorage.setItem("status", "false")
      }

    }
  }

  useEffect(() => {
    getOrder()
  }, [authToken])
  const getOrderData = async (id: any) => {
    const resp = await fetch(`https://glue.de.faas-suite-prod.cloud.spryker.toys/orders/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });
    const result = await resp.json();
    const orderDetail = result.data.attributes
    orderDetail.id = id
    setOrderData((orderData) => [...orderData, orderDetail])
  }
  useEffect(() => {
    setOrderData([])
    if (order?.length > 0) {
      order?.forEach((element: any) => {
        getOrderData(element.id)
      });
    }
  }, [order])
  console.log("final order data", orderData)
  return (
    <section style={style}>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        marginRight: "-15px"
      }}>
        {orderData.length > 0 ? orderData.map((item: any) => {
          return (
            <div style={{
              marginRight: "63px",
              marginBottom: "85px",
              width: "calc(33.3333333333% - 63px)",
              border: "1px solid #7f7f7f",
              borderRadius: "10px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-around", padding: "10px" }}>
                <p>Order Id :</p>
                <p>{item.id}</p>
              </div>
              <div style={{ height: "250px", borderTop: "1px solid #7f7f7f", borderBottom: '1px solid #7f7f7f', padding: "10px", overflowX:"scroll" }}>
                {item.items.map((val: any) => {
                  return (
                    <div style={{ display: "flex", justifyContent: "space-around", margin: "5px", borderBottom: "1px solid #7f7f7f" }}>
                      <div>
                        <img style={{width:"100px", height:"100px", objectFit:"contain"}} src={val.metadata.image} />
                      </div>
                      <div>
                        <p>{val.name}</p>
                        <p>{val.unitPrice}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-around", padding: "10px" }}>
                <p>Total Amount :</p>
                <p>{item.totals.grandTotal}</p>
              </div>
            </div>
          )
        }) : null}
      </div>
    </section>
  )
}

export default Orders