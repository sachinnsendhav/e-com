import Footer from 'components/footer'
import React from 'react'
import Layout from '../layouts/Main';

function ConfigurableProduct() {
    return (
        <>
           <Layout />
           <p style={{textAlign:"center",fontSize: "2.125rem",letterSpacing: "-.05rem",fontWeight:"500", color:"black",padding:"25px"}}>Choose Bundle to configure</p>
           <Footer />
        </>
    )
}

export default ConfigurableProduct