import React, { useState } from 'react'
import Layout from '../layouts/Main';
import Footer from 'components/footer';
import UserDetail from 'components/user/userDetails';
import Address from 'components/user/address';
import Orders from 'components/user/orders';
import Wishlist from 'components/user/wishlist';
import Link from 'next/link';
import ProfileSection from '../components/user/profileSection'
import profileIcon from '../assets/images/profile.png'
import addressesIcon from '../assets/images/addresses.png'
import orderIcon from '../assets/images/order-history.png'
import shoppingList from '../assets/images/list.png'

function profile() {
  const [showBlock, setShowBlock] = useState('profile');

  return (
    <Layout>
      <div>
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
          }}><Link href="/">Home</Link> / </span>Customer Account</p>
        </div>
        <div style={{ paddingInline: "100px" }}>
          <div style={{ display: "flex", marginTop:"1rem" }}>
            <ProfileSection showBlock={showBlock} setShowBlock={setShowBlock} />
            <div style={{width:"80%", margin:"1rem"}}>
              <UserDetail show={showBlock === 'profile'} />
              <Address show={showBlock === 'address'} />
              <Orders show={showBlock === 'order'} />
              <Wishlist show={showBlock === 'shoppingList'} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>

  )
}

export default profile






{/* <section className="product-single" style={{ paddingTop: "50px" }}>
<div className="product-single__info">
  <div className="product-single__info-btns">
    <button type="button" onClick={() => setShowBlock('userDetails')} className={`btn btn--rounded ${showBlock === 'userDetails' ? 'btn--active' : ''}`}>Profile</button>
    <button type="button" onClick={() => setShowBlock('address')} className={`btn btn--rounded ${showBlock === 'address' ? 'btn--active' : ''}`}>Addresses</button>
    <button type="button" onClick={() => setShowBlock('order')} className={`btn btn--rounded ${showBlock === 'order' ? 'btn--active' : ''}`}>Order History</button>
    <button type="button" onClick={() => setShowBlock('wishlist')} className={`btn btn--rounded ${showBlock === 'wishlist' ? 'btn--active' : ''}`}>Shopping Lists</button>
  </div>

  <UserDetail show={showBlock === 'userDetails'} />
  <Address show={showBlock === 'address'} />
  <Orders show={showBlock === 'order'} />
  <Wishlist show={showBlock === 'wishlist'} />
</div>
</section> */}