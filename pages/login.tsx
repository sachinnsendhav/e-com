import Layout from '../layouts/Main';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { API_URL } from 'config';

type LoginMail = {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit, errors } = useForm();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState("false")
  const [authToken, setAuthToken] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAuthStatus(localStorage.getItem("status"));
    setAuthToken(localStorage.getItem("token"))
  }, [])

  const onSubmit = async (data: LoginMail) => {
    var formdata = new FormData();
    formdata.append('grant_type', "password");
    formdata.append('username', data.email);
    formdata.append('password', data.password);
    // formdata.append('client_id', "");
    formdata.append('client_id', "frontend");
    formdata.append('client_secret', "ODZJ57z0dlLj1UStVaQ26j2oMaLlokJOQyOwuCBXT5e4ppnA");
    const resp = await fetch(
      `${API_URL}/token`,
      {
        method: 'POST',
        body: formdata
      },
    );
    const result = await resp.json();
    localStorage.setItem("token", result?.access_token)
    await HandleUserDetails(result?.access_token)
    localStorage.setItem("status", "true")
    if (result) {
      router.push('/profile');
    }
  };

  const HandleUserDetails = async(userToken:any)=>{
    try {
      const resp = await fetch(`${API_URL}/customers`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${userToken}`
          }
        }
      );
      const result = await resp.json();
      localStorage.setItem("userId",result?.data[0]?.id)
      localStorage.setItem("customerGroup",result?.data[0]?.attributes?.fkCustomerGroup)
    } catch {
      localStorage.setItem("status", "false")
    }
  }
  const checkTokenExpiry = async () => {


    // if (authToken) {
    //   setLoading(true)
    //   const data =
    //   {
    //     "data": {
    //       "type": "access-tokens",
    //       "attributes": {
    //         "username": "sonia@spryker.com",
    //         "password": "change123"
    //       }
    //     }
    //   }
    //   try {
    //     const resp = await fetch(
    //       `${API_URL}/access-tokens`,
    //       {
    //         method: 'POST',
    //         headers: {
    //           "Authorization": `Bearer ${authToken}`
    //         },
    //         body: JSON.stringify(data),
    //       },
    //     );
    //     const result = await resp.json();

    //     localStorage.setItem("status", "true")
    //     localStorage.setItem("token", result?.data?.attributes?.accessToken)
    //     if (result?.data?.attributes?.accessToken) {
    //       router.push('/profile');
    //     }
    //   } catch (err) {
    //     localStorage.setItem("status", "false")
    //   }
    //   setLoading(false)
    // } else {
    //   localStorage.setItem("status", "false")
    // }

  }


  useEffect(() => {
    checkTokenExpiry();
  }, [authToken, authStatus])



  return (
    <Layout>
      <section className="form-page">
        <div className="container" style={{ paddingLeft: '0', paddingRight: '0', maxWidth: '#100%' }}>
          <div style={{ background: "#f0f0f0", padding: "0.625rem 0 0.75rem" }}>

            <p style={{

              paddingInline: "100px",

              display: "inline-block",

              font: "0.8125rem/1rem 'Circular', sans-serif",

              margin: "0.5rem",

              color: "black"

            }}><span style={{

              transition: "color 250ms ease-in-out",

              cursor: "pointer",

              color: "#8f8f8f",

              fontSize: "13px",

            }}><Link href="/">Home</Link> / </span>Login</p>

          </div>



          <div className="form-block">
            <h2 className="form-block__title" style={{ fontSize: '2rem',paddingTop:"3rem", marginLeft: '-35px', textAlign: "left", fontWeight: '500', lineHeight: '1.2', color: "#333", marginBottom: "1.5rem", display: "block", fontFamily: "Circular, sans-serif" }}>Access your account</h2>

            <div style={{ background: "#f0f0f0", paddingTop:"0.01rem", paddingBottom:"1.01rem" ,  paddingLeft:"1.9rem" , paddingRight:"1.9rem", margin: "1rem" }}>
              <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form__input-row">
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: '700', marginBottom: "0.4rem", textTransform: "uppercase", color: "#333" }} htmlFor="email">Email  <span style={{ color: "rgb(207, 18, 46)" }}>*</span></label>
                  <input
                    className="form__input"
                    style={{ borderRadius: "0px",  padding:"0.875rem 1.25rem 0.8125rem", boxSizing:"border-box"}}
                    placeholder="Email"
                    id='email'
                    type="text"
                    name="email"
                    // value={"sonia@spryker.com"} //just for development testing please remove it after development
                    ref={register({
                      required: true,
                      pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                  />

                  {errors.email && errors.email.type === 'required' &&
                    <p className="message message--error">This field is required</p>
                  }

                  {errors.email && errors.email.type === 'pattern' &&
                    <p className="message message--error">Please write a valid email</p>
                  }
                </div>
               
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: '700', marginBottom: "0.4rem", textTransform: "uppercase", color: "#333" }} htmlFor="password">Password  <span style={{ color: "rgb(207, 18, 46)" }}>*</span></label>
                <div className="form__input-row">
                  <input
                 
                    className="form__input"
                    // type="password"
                    style={{ borderRadius: "0px",  padding:"0.875rem 1.25rem 0.8125rem", boxSizing:"border-box"}}
                    id='password'
                    placeholder="Password"
                    // value={"change123"} //just for development testing please remove it after development
                    name="password"
                    
                    ref={register({ required: true })}
                  />
                   
                  {errors.password && errors.password.type === 'required' &&
                    <p className="message message--error">This field is required</p>
                  }
                </div>
              

                <div className="form__info">
                  <div className="checkbox-wrapper">
                    <label htmlFor="check-signed-in" className={`checkbox checkbox--sm`}>
                      <input
                        type="checkbox"
                        style={{marginRight:"0.875rem", width:"1.25rem" , height:"1.25rem", lineHeight:"1.25rem"
                }}
                        name="keepSigned"
                        id="check-signed-in"
                        ref={register({ required: false })}
                      />
                      {/* <span className="checkbox__check"></span> //removed because 2 checkboxes were showing */}
                      
                      
  <p style={{ display: "block", verticalAlign: "middle", textTransform: "none", fontSize: "0.875rem", fontWeight: "400", margin: "0", userSelect: "none", flex: "1", fontFamily: "'Circular', sans-serif" }}>Remember Me</p>


                    </label>

                  </div>

                </div>
                
  <p style={{ display: "block", verticalAlign: "middle", textTransform: "none", fontSize: "0.875rem", fontWeight: "400", margin: "0", userSelect: "none", flex: "1", fontFamily: "'Circular', sans-serif" , color:'#8f8f8f' }}> &nbsp; *Required fields</p>


                {/* <div className="form__btns">
          <button type="button" className="btn-social fb-btn"><i className="icon-facebook"></i>Facebook</button>
          <button type="button" className="btn-social google-btn"><img src="/images/icons/gmail.svg" alt="gmail" /> Gmail</button>
        </div> */}
                      
                <button type="submit" style={{ width: "18%", background: "rgb(207, 18, 46)", borderRadius: "1px" }} className="btn btn--rounded btn--yellow btn-submit">Login</button>
                <a style={{ margin: "15px", fontFamily: "'Circular', sans-serif", color: "#b2b2b2", fontSize: "0.9rem" }} href="/forgot-password" className="form__info__forgot-password">Forgot Password</a>

              </form>
            </div>

          </div>


        </div>
      </section>
    </Layout>
  )
}

export default LoginPage
