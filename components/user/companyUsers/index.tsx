//@ts-ignore
import { API_URL } from "config";
import React, { useEffect, useState } from "react";
//@ts-ignore
import { CURRENCY_SYMBOLE } from "config";
//@ts-ignore
import eyeIcon from "../../../assets/images/eye.png";
import deleteIcon from "../../../assets/images/delete.png";
import editIcon from "../../../assets/images/edit.png";
import Loader from "../../loader";
import EditUser from './editUser';

type AddressType = {
  show: boolean;
};

const ComponentUsers = ({ show }: AddressType) => {
  const style = {
    display: show ? "block" : "none",
  };
  var authToken: any = "";
  var customerId: any = "";
  const [customerData, setCustomerData] = useState([]);
  const [editUserData, setEditUserData] = useState(false);
  const [compData, setCompData] = useState(false);
  const [editProfileData, setEditProfileData] = useState(false);
  const [loading, setLoading] = useState(false);
  if (typeof window !== "undefined") {
    // Code running in the browser
    authToken = localStorage?.getItem("token");
    customerId = localStorage?.getItem("userId");
  }
  const [isToggled, setIsToggled] = useState(true);

  const handleToggle = () => {
    console.log("hey");
    setIsToggled(!isToggled);
  };

  const getOrder = async () => {
    setLoading(true);
    if (authToken) {
      try {
        const resp = await fetch(
          `${API_URL}/company-users?include=company-business-units%2Ccustomers%2Ccompany-roles`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          }
        );
        const result = await resp.json();
        console.log(result, "resres");
        var tempIncludeCustomer: any = [];
        var tempIncludeCompany: any = [];
        var tempIncludeRoles: any = [];
        await result?.included?.map(async (item: any) => {
          if (item?.type == "customers") {
            await tempIncludeCustomer.push(item);
          } else if (item?.type == "company-business-units") {
            await tempIncludeCompany.push(item);
          } else if (item?.type == "company-roles") {
            await tempIncludeRoles.push(item);
          }
        });
        var tempUserArr: any = [];
        await result?.data?.map(async (item: any) => {
          await tempIncludeCustomer?.map(async (customer: any) => {
            await tempIncludeCompany?.map(async (company: any) => {
              await tempIncludeRoles?.map((roles: any) => {
                if (
                  item?.relationships?.["company-business-units"]?.data[0]
                    ?.id == company?.id &&
                  item?.relationships?.["customers"]?.data[0]?.id ==
                    customer?.id &&
                  item?.relationships?.["company-roles"]?.data[0]?.id ==
                    roles?.id
                ) {
                  var userData = {
                    id: item?.id,
                    enable: item?.attributes?.isActive,
                    firstName: customer?.attributes?.firstName,
                    lastName: customer?.attributes?.lastName,
                    salutation: customer?.attributes?.salutation,
                    email: customer?.attributes?.email,
                    reference: customer.id,
                    companyName: company?.attributes?.name,
                    companyEmail: company?.attributes?.email,
                    companyId: company?.id,
                    roles: roles?.attributes?.name,
                  };
                  tempUserArr.push(userData);
                }
              });
            });
          });
        });
        console.log(tempUserArr, "tempUserArr");
        setCustomerData(tempUserArr);
        setCompData(tempIncludeCompany);
      } catch {
        setCustomerData([]);
        localStorage.setItem("status", "false");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getOrder();
  }, [authToken]);

  const DeleteCustomerHander= (item:any) => {
    console.log(item,"delte")

  }
  const EnableHandler= (item:any) => {
    console.log(item,"toggle")

  }
  const EditCustomerHandler= (item:any) => {
    console.log(item,"edit")
    if(item){
        setEditProfileData(item);
        setEditUserData(true);
    }
  }

  return (
    <div style={style}>
        {!editUserData ? 
      loading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingTop: "20px",
          }}
        >
          <Loader />
        </div>
      ) : customerData?.length > 0 ? (
        <>
          <h1
            style={{
              fontWeight: "500",
              fontSize: "1.5rem",
              lineHeight: "1.4",
              color: "#333",
              paddingBottom: "10px",
            }}
          >
           Company Users
          </h1>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderSpacing: "0",
              border: "none",
            }}
          >
            <thead
              style={{
                backgroundColor: "#f0f0f0",
                textTransform: "uppercase",
                border: "none",
              }}
            >
              <tr>
                <th
                  style={{ padding: "15px", color: "#333", fontWeight: "700" }}
                >
                  Name
                </th>
                <th
                  style={{ color: "#333", fontWeight: "700", padding: "15px" }}
                >
                  BUSINESS UNIT
                </th>
                <th
                  style={{ color: "#333", fontWeight: "700", padding: "15px" }}
                >
                  ROLES
                </th>
                <th
                  style={{ color: "#333", fontWeight: "700", padding: "15px" }}
                >
                  ENABLE
                </th>
                <th
                  style={{ color: "#333", fontWeight: "700", padding: "15px" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.875rem" }}>
              {customerData?.length > 0
                ? customerData?.map((item: any) => {
                    return (
                      <tr style={{ borderBottom: "1px solid #B2B2B2" }}>
                        <td
                          style={{
                            color: "#4c4c4c",
                            padding: "1rem 0.9375rem",
                            textAlign: "center",
                          }}
                        >
                          {item?.salutation} {item?.firstName} {item?.lastName}
                        </td>
                        <td
                          style={{
                            color: "#4c4c4c",
                            padding: "1rem 0.9375rem",
                            textAlign: "center",
                          }}
                        >
                          {item?.companyName}
                        </td>
                        <td
                          style={{
                            color: "#4c4c4c",
                            padding: "1rem 0.9375rem",
                            textAlign: "center",
                          }}
                        >
                          {item?.roles}
                        </td>
                        <td
                          style={{
                            color: "#4c4c4c",
                            padding: "1rem 0.9375rem",
                            textAlign: "center",
                          }}
                        >
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={item?.enable}
                              onChange={() => EnableHandler(item)}
                            />
                            <span className="slider round"></span>
                          </label>
                        </td>
                        <td style={{display:"flex",justifyContent:"space-between", width:"50px", marginLeft:"30px"}}>
                          <div>
                            <img
                              src={editIcon.src}
                              style={{ height: "20px", width: "20px" }}
                              onClick={()=>EditCustomerHandler(item)}
                            />
                          </div>
                          {customerId != item?.reference ?
                          <div>
                            <img
                              src={deleteIcon.src}
                              style={{ height: "20px", width: "20px" }}
                              onClick={()=>DeleteCustomerHander(item)}

                            />
                          </div>:""}
                        </td>
                      </tr>
                    );
                  })
                : ""}
            </tbody>
          </table>
        </>
      ) : (
        <></>
      ):

    <EditUser data={editProfileData} company={compData} setEditUserData={setEditUserData}/>}
    </div>
  );
};

export default ComponentUsers;
