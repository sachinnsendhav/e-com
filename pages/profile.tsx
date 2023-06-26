import React,{useState} from 'react'
import Layout from '../layouts/Main';
import Footer from 'components/footer';
import UserDetail from 'components/user/userDetails';
import Address from 'components/user/address';
import Orders from 'components/user/orders';
function profile() {
  const [showBlock, setShowBlock] = useState('userDetails');

  return (
    <Layout>
        <section className="product-single" style={{paddingTop:"50px"}}>
                  <div className="product-single__info">
                    <div className="product-single__info-btns">
                      <button type="button" onClick={() => setShowBlock('userDetails')} className={`btn btn--rounded ${showBlock === 'userDetails' ? 'btn--active' : ''}`}>User Details</button>
                      <button type="button" onClick={() => setShowBlock('address')} className={`btn btn--rounded ${showBlock === 'address' ? 'btn--active' : ''}`}>Address</button>
                      <button type="button" onClick={() => setShowBlock('order')} className={`btn btn--rounded ${showBlock === 'order' ? 'btn--active' : ''}`}>Order</button>
                    </div>

                    <UserDetail show={showBlock === 'userDetails'} />
                    <Address show={showBlock === 'address'} />
                    <Orders show={showBlock === 'order'} />
                  </div>
                </section>
        <Footer />
    </Layout>
    
  )
}

export default profile