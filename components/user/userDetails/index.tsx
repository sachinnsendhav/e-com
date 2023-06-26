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
  useEffect(() => {
    setAuthToken(localStorage.getItem("token"))
  }, [])
  const getUserDetails = async () => {
    if (authToken) {
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
    }
  }
  useEffect(() => {
    getUserDetails();
  }, [authToken])
  return (
    <section style={style}>
      <div style={{ margin: "auto", width: "80%" }}>
        <h1 style={{ fontSize: "18px", paddingBottom: "10px" }}>
          User Details
        </h1>
        <div style={{ display: "flex" }}>
          <p style={{ paddingBottom: "5px", fontWeight: "bold", width: "100px" }}>Name : </p><p>{userDetails?.firstName + " " + userDetails?.lastName}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p style={{ paddingBottom: "5px", fontWeight: "bold", width: "100px" }}>Email : </p><p>{userDetails?.email}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p style={{ paddingBottom: "5px", fontWeight: "bold", width: "100px" }}>Gender : </p><p>{userDetails?.gender}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p style={{ paddingBottom: "5px", fontWeight: "bold", width: "100px" }}>Salutation : </p>{userDetails?.salutation}<p></p>
        </div>
      </div>
    </section>
  )
}

export default UserDetails