import React from 'react'
import img1 from '../assets/images/thank-you.jpg';
import { useRouter } from 'next/router';

function ThankYouPage() {
    const router = useRouter();
    const orderId = router.query.orderId
    return (
        <section>
            <div style={{
                display: "flex",
                alignItems: "center"
            }}>
                <img src={img1.src} alt="Thank you" style={{ width: "60%", height: "500px", margin: "auto", objectFit: "cover" }} />
            </div>
            <h1 style={{ textAlign: "center", paddingTop: "20px", fontSize: "24px" }}>Thank You! Your order Successfull, your Order ID is :- {orderId}</h1>
          <div style={{width:"60%", margin:"auto",paddingTop:'50px'}}>
          <a href="/cart" className="cart__btn-back">
                <i className="icon-left"></i> Back
            </a>
          </div>
         
        </section>

    )
}

export default ThankYouPage