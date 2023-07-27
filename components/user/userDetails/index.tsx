import { API_URL } from "config";
import React, { useState, useEffect } from "react"
import Loader from '../../loader'
type AddressType = {
  show: boolean;
}

const UserDetails = ({ show }: AddressType) => {
  const style = {
    display: show ? 'block' : 'none',
  }
  const [authToken, setAuthToken] = useState<any>("");
  const [userId, setUserId] = useState<any>("");
  const [userDetails, setUserDetails] = useState<any>();
  const [loading, setLoading] = useState<any>(false)
  const [oldPassword, setOldPassword] = useState<any>("")
  const [newPassword, setNewPassword] = useState<any>("")
  const [confirmPassword, setConfirmPassword] = useState<any>("")

  useEffect(() => {
    setAuthToken(localStorage.getItem("token"))
    setUserId(localStorage.getItem("userId"))
  }, [])

  const getUserDetails = async () => {
    if (authToken) {
      setLoading(true)
      try {
        const resp = await fetch(`${API_URL}/customers`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${authToken}`
            }
          }
        );
        const result = await resp.json();
        setUserDetails(result.data[0].attributes)
        console.log(result, "result")
        localStorage.setItem("userId", result?.data[0]?.id)
        localStorage.setItem("customerGroup", result?.data[0]?.attributes?.fkCustomerGroup)
      } catch {
        localStorage.setItem("status", "false")
      }
      setLoading(false)
    }
  }
  useEffect(() => {
    getUserDetails();
  }, [authToken])

  const changePassword = async () => {
    const data: any = {
      data: {
        type: "customer-password",
        attributes: {
          password: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword
        }
      }
    }
    try {
      const resp = await fetch(`${API_URL}/customer-password/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${authToken}`
          },
          body: JSON.stringify(data)
        }
      );
      const result = await resp.json();
      console.log("result", result)
      if (result?.status === 204) {
        alert('Your password change successfully!')
      } else {
        alert(result?.errors[0]?.detail)
      }
    } catch (err) {
      console.log("err", err)
    }

  }
  return (

    <div style={style}>
      {loading
        ? <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "20px" }}>
          <Loader />
        </div> :
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "50%", background: "#f2f2f2", padding: "1rem" }}>
            <h1 style={{
              fontWeight: "500",
              fontSize: "1.5rem",
              lineHeight: "1.4",
              display: "block",
              color: "#333",
              marginBottom: "1rem"
            }}>Profile</h1>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  color: "#333",
                }}>
                  SALUTATION
                </p>
                <div style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#f0f0f0",
                  font: "400 0.9375rem/2.875rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {userDetails?.salutation}.
                </div>
              </div>
              <div>
                <p style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  color: "#333",
                }}>
                  FIRST NAME
                </p>
                <div style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2.875rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}> {userDetails?.firstName} </div>
              </div>

              <div>
                <p style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  color: "#333",
                }}>
                  LAST NAME
                </p>
                <div style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2.875rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>{userDetails?.lastName}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", paddingTop: "20px" }}>
              <p style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                color: "#333",
              }}>Email</p>
              <div style={{
                display: "block",
                borderRadius: "2px",
                border: "0.0625rem solid #dce0e5",
                color: "#333",
                background: "#ffffff",
                font: "400 0.9375rem/2.875rem 'Circular', sans-serif",
                padding: "0 2.8125rem 0 1.25rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>{userDetails?.email}</div>
            </div>
          </div>
          <div style={{ width: "50%", background: "#f2f2f2", marginInline: "1rem", padding: "1rem" }}>
            <h1 style={{
              fontWeight: "500",
              fontSize: "1.5rem",
              lineHeight: "1.4",
              display: "block",
              color: "#333",
              marginBottom: "1rem"
            }}>Change Password</h1>
            <div style={{ display: "flex", flexDirection: "column", paddingTop: "10px" }}>
              <p style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                color: "#333",
              }}>OLD PASSWORD*</p>
              <input
                onChange={(e) => setOldPassword(e.target.value)}
                style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2.875rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                placeholder="Enter old password" type="text" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", paddingTop: "20px" }}>
              <p style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                color: "#333",
              }}>NEW PASSWORD*</p>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2.875rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                placeholder="Enter new password" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", paddingTop: "30px" }}>
              <p style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                color: "#333",
              }}>CONFIRM PASSWORD*</p>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  display: "block",
                  borderRadius: "2px",
                  border: "0.0625rem solid #dce0e5",
                  color: "#333",
                  background: "#ffffff",
                  font: "400 0.9375rem/2.875rem 'Circular', sans-serif",
                  padding: "0 2.8125rem 0 1.25rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                placeholder="Enter confirm password" type="text" />
            </div>
            <button
              onClick={() => changePassword()}
              style={{
                width: "75px",
                marginTop: "20px",
                padding: "10px",
                fontWeight: "bold",
                color: "white",
                background: "rgb(207, 18, 46)",
                borderRadius: "1px"
              }}
            >
              Submit
            </button>
          </div>
        </div>}
    </div>
  )
}

export default UserDetails