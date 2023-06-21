import React, { useEffect, useState } from "react"

type AddressType = {
  show: boolean;
}

const Orders = ({ show }: AddressType) => {
  const style = {
    display: show ? 'flex' : 'none',
  }
  const [authToken, setAuthToken] = useState()
  const [order, setOrder] = useState([]);
  const [orderData, setOrderData] = useState([]);
  useEffect(() => {
    setAuthToken(localStorage.getItem('token'))
  }, [])
  const getOrder = async () => {
    if (authToken) {
      const resp = await fetch('https://glue.de.faas-suite-prod.cloud.spryker.toys/customers/DE--21/orders', {
        method: "GET",
        headers: {
          authorization: `Bearer ${authToken}`
        }
      })
      const result = await resp.json()
      setOrder(result.data)
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
    setOrderData((orderData) => [...orderData, result.data.attributes])
  }
  useEffect(() => {
    if (order.length > 0) {
      order.forEach((element: any) => {
        getOrderData(element.id)
      });
    }
  }, [order])
  console.log("final order data", orderData)
  return (
    <section style={style}>
      Orders
    </section>
  )
}

export default Orders