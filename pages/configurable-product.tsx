import Footer from 'components/footer'
import React, { useState, useEffect } from 'react'
import Layout from '../layouts/Main';
import { API_URL } from "../config"
import Link from 'next/link';
function ConfigurableProduct() {
    const [data, setData] = useState<any[]>([]);

    const getConfigurableBundles = async () => {
        try {
          const resp = await fetch(`${API_URL}/configurable-bundle-templates?include=configurable-bundle-template-image-sets`, {
            method: "GET"
          });
          if (!resp.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await resp.json();
          var newData: any[] = [];
          result.data.forEach((item: any) => {
            result.included.forEach((img: any) => {
              if (item.id === img.id) {
                newData.push({
                  name: item.attributes.name,
                  image: img.attributes.images[0].externalUrlLarge,
                  id: item.id
                });
              }
            });
          });
      
          setData(newData);
        } catch (error) {
          console.error('Error fetching configurable bundles:', error);
          setData([]);
        }
      };
      
    useEffect(() => {
        getConfigurableBundles()
    }, []);

    return (
        <>
            <Layout />
            <p style={{ textAlign: "center", fontSize: "2.125rem", letterSpacing: "-.05rem", fontWeight: "500", color: "black", padding: "25px" }}>
                Choose Bundle to configure
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {data?.length > 0 ?
                    data.map((item: any) => {
                        return (
                            <div style={{ width: "25%" }}>
                                <Link href={`/configurable-bundle-items/${item.id}`}>
                                    <div style={{ padding: "20px", textAlign: "center" }}>
                                        <img src={item.image} style={{ width: "100%" }} />
                                        <h1 style={{ fontSize: "18px", marginTop: "-50px" }}>{item.name}</h1>
                                    </div>
                                </Link>
                            </div>
                        )
                    }) : ""}
            </div>
            <Footer />
        </>
    )
}

export default ConfigurableProduct