import React, { useEffect, useState } from 'react'
//@ts-ignore
import img1 from '../assets/images/thank-you.jpg';
import { useRouter } from 'next/router';
import Link from 'next/link';

function ThankYouPage() {
    const router = useRouter();
    const [orderId, setOrderId] = useState<any>("");
    useEffect(() => {
        const id = router.query.orderId
        setOrderId(id)
    }, [])
    return (
        <section>
            <div style={{
                display: "flex",
                alignItems: "center"
            }}>
                <img src={img1.src} alt="Thank you" style={{ width: "60%", height: "500px", margin: "auto", objectFit: "cover" }} />
            </div>
            <div style={{ display: "flex",justifyContent: "center", textAlign: "center", width: "100%" }}>
                <h1 style={{ textAlign: "center", paddingTop: "20px", fontSize: "24px" }}>Thank You! Your order Successfull, your Order ID is </h1>
                <Link href={`/order-details/${orderId}`}>
                    <a style={{ textAlign: "center", paddingTop: "20px", fontSize: "24px", paddingLeft:"5px" }}> {orderId}</a></Link>
            </div>
            <div style={{ width: "60%", margin: "auto", paddingTop: '50px' }}>
                <a href="/" className="cart__btn-back">
                    <i className="icon-left"></i> Back
                </a>
            </div>
        </section>
    )
}

export default ThankYouPage