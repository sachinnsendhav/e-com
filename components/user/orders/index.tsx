import { API_URL } from "config";
import Link from "next/link";
import React, { useEffect, useState } from "react"
import { CURRENCY_SYMBOLE } from 'config';
//@ts-ignore
import eyeIcon from '../../../assets/images/eye.png'
import Loader from '../../loader'

type AddressType = {
  show: boolean;
}

const Orders = ({ show }: AddressType) => {
  const style = {
    display: show ? 'block' : 'none',
  }
  const [authToken, setAuthToken] = useState<any>()
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAuthToken(localStorage.getItem('token'))
    const reOrder = async () => {
      try {
        const resp = await fetch(
          `${API_URL}/re-order?id=1`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",

            },
          }
        );
        alert("It has been reordered succesfully");
      } catch (error) {
      }
    };
    alert("Notification : your cartridge(sku id) needs a replacement . It has been sent for a reorder.");
   // reOrder();
  }, [])
  const getOrder = async () => {
    setLoading(true)
    if (authToken) {
      try {
        const resp = await fetch(`${API_URL}/customers/DE--21/orders`, {
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
    setLoading(false)
  }

  useEffect(() => {
    getOrder()
  }, [authToken])

  return (
    <div style={style}>
      {loading
        ? <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "20px" }}>
          <Loader />
        </div> :
        order?.length > 0 ?
          <>
            <h1 style={{
              fontWeight: "500",
              fontSize: "1.5rem",
              lineHeight: "1.4",
              color: "#333",
              paddingBottom: "10px"
            }}>Order History</h1>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              borderSpacing: "0",
              border: "none"
            }}>
              <thead style={{
                backgroundColor: "#f0f0f0",
                textTransform: "uppercase",
                border: "none"
              }}>
                <tr>
                  <th style={{ padding: "15px", color: "#333", fontWeight: "700" }}>REFERENCE</th>
                  <th style={{ color: "#333", fontWeight: "700", padding: "15px" }}>Date</th>
                  <th style={{ color: "#333", fontWeight: "700", padding: "15px" }}>Total</th>
                  <th style={{ color: "#333", fontWeight: "700", padding: "15px" }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.875rem" }} >
                {order?.length > 0 ? order.map((item: any) => {
                  return (
                    <tr style={{ borderBottom: "1px solid #B2B2B2" }}>
                      <td style={{ color: "#4c4c4c", padding: "1rem 0.9375rem", textAlign: "center" }}>{item.id}</td>
                      <td style={{ color: "#4c4c4c", padding: "1rem 0.9375rem", textAlign: "center" }}>{item.attributes.createdAt.split(' ')[0]}</td>
                      <td style={{ color: "#4c4c4c", padding: "1rem 0.9375rem", textAlign: "center" }}> {CURRENCY_SYMBOLE} {item.attributes.totals.grandTotal}</td>
                      <td style={{ color: "#4c4c4c", padding: "1rem 0.9375rem", textAlign: "center" }}>
                        <Link href={`/order-details/${item.id}`}>
                          <img src={eyeIcon.src} style={{ width: "25px", height: "25px" }} />
                        </Link></td>
                    </tr>
                  )
                }) : ""}

              </tbody>
            </table>
          </>
          : <></>}
    </div>
  )
}

export default Orders