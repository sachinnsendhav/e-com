import { API_URL } from "config";
import React, { useState, useEffect } from "react"
import Loader from '../../loader'
import Modal from 'react-modal';
import { fetchCustomerBasicDetailsMethod, updateCustomerDetailsMethod, updateCustomerPasswordMethod } from '../../../service/serviceMethods/privateApiMethods';

type AddressType = {
  show: boolean;
}
const customStyles: any = {
  content: {
    top: '55%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#f0f0f0',
    width: "30%"
  },
};

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
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [firstName, setFirstName] = useState<any>('');
  const [lastName, setLastName] = useState<any>('');
  const [salutation, setSalutation] = useState<any>('');
  const [gender, setGender] = useState<any>('');
  const [email, setEmail] = useState<any>('');
  useEffect(() => {
    setAuthToken(localStorage.getItem("token"))
    setUserId(localStorage.getItem("userId"))
  }, [])
  useEffect(() => {
    setSalutation(userDetails?.salutation);
    setFirstName(userDetails?.firstName);
    setLastName(userDetails?.lastName);
    setEmail(userDetails?.email);
    setGender(userDetails?.gender);
  }, [userDetails])
  const getUserDetails = async () => {
    if (authToken) {
      setLoading(true)
      const response = await fetchCustomerBasicDetailsMethod()
        setUserDetails(response?.attributes)
        localStorage.setItem("userId", response?.id)
        localStorage.setItem("customerGroup", response?.attributes?.fkCustomerGroup)
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
      const result = await updateCustomerPasswordMethod(data,userId)
      console.log(result,"resres")
      if (result?.status == 204) {
        alert('Your password change successfully!')
      } else {
        alert(result?.error?.errors[0]?.detail)
      }
    } catch (err) {
      console.log("err", err)
    }

  }

  const updateProfile = async () => {
    const data = {
      data: {
        type: "customers",
        attributes: {
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          salutation: salutation,
          email: email,
          acceptedTerms: true
        }
      }
    }
    try {
      const response:any = await updateCustomerDetailsMethod(data,userId);
      getUserDetails()
      closeModal()
    } catch (err) {
      console.log("err", err)
    }
  }

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

    <div style={style}>
      {loading
        ? <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "20px" }}>
          <Loader />
        </div> :
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "50%", background: "#f2f2f2", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h1 style={{
                fontWeight: "500",
                fontSize: "1.5rem",
                lineHeight: "1.4",
                display: "block",
                color: "#333",
                marginBottom: "1rem"
              }}>Profile</h1>
              <button style={{
                width: "85px",
                fontWeight: "bold",
                color: "white",
                background: "rgb(207, 18, 46)",
                borderRadius: "1px"
              }} onClick={() => openModal()}>
                Update
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "10px" }}>
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
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Update Profile</h2>
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
              }}>Salutation</label>
              <select style={{
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
              }} value={salutation} onChange={(e) => setSalutation(e.target.value)}>
                <option value="Mr">Mr.</option>
                <option value="Ms">Ms.</option>
                <option value="Mrs">Mrs.</option>
                <option value="Dr">Dr.</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "4px" }}>
              <label style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                color: "#333",
              }}>First Name</label>
              <input type='text' placeholder='Enter first name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
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
              }}>Last Name</label>
              <input type='text' placeholder='Enter last name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
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
              }}>Gender</label>
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex" }}>
                  <input
                    type='radio'
                    name="gender"
                    value="Male"
                    onChange={(e) => setGender(e.target.value)}
                    checked={gender === "Male"}
                    style={{
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
                    }}
                  />
                  <label>Male</label>
                </div>
                <div style={{ display: "flex" }}>
                  <input
                    type='radio'
                    name="gender"
                    value="Female"
                    onChange={(e) => setGender(e.target.value)}
                    checked={gender === "Female"}
                    style={{
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
                    }}
                  />
                  <label>Female</label>
                </div>
                <div style={{ display: "flex" }}>
                  <input
                    type='radio'
                    name="gender"
                    value="Other"
                    onChange={(e) => setGender(e.target.value)}
                    checked={gender === "Other"}
                    style={{
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
                    }}
                  />
                  <label>Other</label>
                </div>
              </div>



            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "4px" }}>
              <label style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                color: "#333",
              }}>Email</label>
              <input
                type='text'
                placeholder='Enter Email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                style={{
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
              <button
                style={{
                  padding: "10px",
                  fontWeight: "bold",
                  color: "white",
                  background: "rgb(207, 18, 46)",
                  borderRadius: "1px"
                }}
                onClick={() => updateProfile()}
              >Submit</button>
            </div>
          </div>
        </div>

      </Modal>
    </div>
  )
}

export default UserDetails