import {API_URL} from "config";
import Link from "next/link";
import React, { useEffect, useState } from "react"
import { CURRENCY_SYMBOLE } from 'config';

type AddressType = {
  show: boolean;
}

const Orders = ({ show }: AddressType) => {
  const style = {
    display: show ? 'flex' : 'none',
  }
  const [authToken, setAuthToken] = useState<any>()
  const [order, setOrder] = useState([]);
  useEffect(() => {
    setAuthToken(localStorage.getItem('token'))
  }, [])
  const getOrder = async () => {

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
  }
  useEffect(() => {
    getOrder()
  }, [authToken])

  return (
    <section style={style}>
      
      <div className="cart-list" style={{width:"60%", margin:"auto"}}>
        <table>
          <tbody >
            <tr style={{border:"1px solid black" }}>
              <th style={{  color: "black",paddingTop:"20px" }}>Order Id</th>
              {/* <th style={{ color: "black",paddingTop:"20px" }}> Status</th> */}
              <th style={{ color: "black",paddingTop:"20px" }}>Create Date</th>
              <th style={{ color: "black",paddingTop:"20px" }}>Amount</th>
              <th style={{ color: "black",paddingTop:"20px" }}>Details</th>
            </tr>
            {order?.length > 0 ? order.map((item: any) => {
              return (
                <tr style={{border:"1px solid black"}}>
                  <td>{item.id}</td>
                  {/* <td>{item?.attributes?.itemStates[0]}</td> */}
                  <td>{item.attributes.createdAt.split(' ')[0]}</td>
                  <td> {CURRENCY_SYMBOLE} {item.attributes.totals.grandTotal}</td>
                  <td > <Link href={`/order-details/${item.id}`}><a style={{border:"1px solid black", borderRadius:"5px", padding:"5px"}}>Show</a></Link></td>
                </tr>)
            }) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Orders