import React, { useState, useEffect } from "react"

type AddressType = {
  show: boolean;
}

const UserDetails = ({ show }: AddressType) => {
  const style = {
    display: show ? 'flex' : 'none',
  }
  const [authToken, setAuthToken] = useState("");
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setAuthToken(localStorage.getItem("token"))
  }, [])
  const getUserDetails = async () => {
    if (authToken) {
      setLoading(true)
      try {
        const resp = await fetch(`https://glue.de.faas-suite-prod.cloud.spryker.toys/customers`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${authToken}`
            }
          }
        );
        const result = await resp.json();
        setUserDetails(result.data[0].attributes)
      } catch {
        localStorage.setItem("status", "false")
      }
      setLoading(false)
    }
  }
  useEffect(() => {
    getUserDetails();
  }, [authToken])
  return (
    <section style={style}>

      <div style={{ margin: "auto", width: "60%", padding: "20px", borderRadius: "25px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#7f7f7f", textAlign: "center", paddingBottom: "10px" }}>
          User Details
        </h1>
        {loading ? <>Loading...</> : <>
          <div style={{ display: "flex" }}>
            <p style={{ paddingTop: "15px", fontWeight: "bold", width: "100px" }}>Name  </p><p style={{ height: "40px", width: "250px", backgroundColor: "white", border: "1px solid #7f7f7f", borderRadius: "10px", padding: "10px" }}>{userDetails?.firstName + " " + userDetails?.lastName}</p>
          </div>
          <div style={{ display: "flex", paddingTop: "10px" }}>
            <p style={{ paddingTop: "15px", fontWeight: "bold", width: "100px" }}>Email </p><p style={{ height: "40px", width: "250px", backgroundColor: "white", border: "1px solid #7f7f7f", borderRadius: "10px", padding: "10px" }}>{userDetails?.email}</p>
          </div>
          <div style={{ display: "flex", paddingTop: "10px" }}>
            <p style={{ paddingTop: "15px", fontWeight: "bold", width: "100px" }}>Gender </p><p style={{ height: "40px", width: "250px", backgroundColor: "white", border: "1px solid #7f7f7f", borderRadius: "10px", padding: "10px" }}>{userDetails?.gender}</p>
          </div>
          <div style={{ display: "flex", paddingTop: "10px" }}>
            <p style={{ paddingTop: "15px", fontWeight: "bold", width: "100px" }}>Salutation </p><p style={{ height: "40px", width: "250px", backgroundColor: "white", border: "1px solid #7f7f7f", borderRadius: "10px", padding: "10px" }}>{userDetails?.salutation}</p>
          </div></>}
      </div>
    </section>
  )
}

export default UserDetails