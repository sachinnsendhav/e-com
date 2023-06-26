import Layout from '../layouts/Main';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'

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
  // console.log("authStatus", authStatus, "token->", authToken)
  console.log("loading--->>", loading)
  useEffect(() => {
    setAuthStatus(localStorage.getItem("status"));
    setAuthToken(localStorage.getItem("token"))
  }, [])

  const onSubmit = async (data: LoginMail) => {
    var formdata = new FormData();
    formdata.append('grant_type', "password");
    formdata.append('username', data.email);
    formdata.append('password', data.password);
    formdata.append('client_id', "");
    const resp = await fetch(
      `https://glue.de.faas-suite-prod.cloud.spryker.toys/token`,
      {
        method: 'POST',
        body: formdata,
      },
    );
    const result = await resp.json();
    localStorage.setItem("token", result?.access_token)
    localStorage.setItem("status", "true")
    window.location.reload()
    if (result) {
      router.push('/profile');
    }
  };
  const checkTokenExpiry = async () => {


    if (authToken) {
      setLoading(true)
      const data =
      {
        "data": {
          "type": "access-tokens",
          "attributes": {
            "username": "sonia@spryker.com",
            "password": "change123"
          }
        }
      }
      try {
        const resp = await fetch(
          `https://glue.de.faas-suite-prod.cloud.spryker.toys/access-tokens`,
          {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(data),
          },
        );
        const result = await resp.json();

        localStorage.setItem("status", "true")
        localStorage.setItem("token", result?.data?.attributes?.accessToken)
        if (result?.data?.attributes?.accessToken) {
          router.push('/profile');
        }
      } catch (err) {
        console.log("errr", err)
        localStorage.setItem("status", "false")
      }
      setLoading(false)
    } else {
      localStorage.setItem("status", "false")
    }

  }


  useEffect(() => {
    checkTokenExpiry();
  }, [authToken, authStatus])



  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/">
              <a><i className="icon-left"></i> Back to Home</a>
            </Link>
          </div>
          {
            authStatus === "true" ?
              ""
              :
              <div className="form-block">
                <h2 className="form-block__title">Log in</h2>

                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form__input-row">
                    <input
                      className="form__input"
                      placeholder="sonia@spryker.com"
                      type="text"
                      name="email"
                      value={"sonia@spryker.com"}//just for development testing please remove it after development
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

                  <div className="form__input-row">
                    <input
                      className="form__input"
                      type="password"
                      placeholder="changer123"
                      value={"change123"}  //just for development testing please remove it after development
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
                          name="keepSigned"
                          id="check-signed-in"
                          ref={register({ required: false })}
                        />
                        <span className="checkbox__check"></span>
                        <p>Keep me signed in</p>
                      </label>
                    </div>
                    <a href="/forgot-password" className="form__info__forgot-password">Forgot password?</a>
                  </div>

                  {/* <div className="form__btns">
    <button type="button" className="btn-social fb-btn"><i className="icon-facebook"></i>Facebook</button>
    <button type="button" className="btn-social google-btn"><img src="/images/icons/gmail.svg" alt="gmail" /> Gmail</button>
  </div> */}

                  <button type="submit" className="btn btn--rounded btn--yellow btn-submit">Sign in</button>

                  <p className="form__signup-link">Not a member yet? <a href="/register">Sign up</a></p>
                </form>
              </div>}


        </div>
      </section>
    </Layout>
  )
}

export default LoginPage
