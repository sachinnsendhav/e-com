import Footer from 'components/footer'
import React, { useState, useEffect } from 'react'
import Layout from '../../layouts/Main';
import { API_URL } from "../../config"
import Link from 'next/link';
import { useRouter } from 'next/router';

function ConfigurableBundleItems() {
    const [data, setData] = useState<any[]>([]);
    const [slot, setSlot] = useState<any[]>([]);
    const router = useRouter();
    const bundleId = router.query.bundleId;
    console.log("routerrrrrrrrrrrrrrrr", bundleId)

    const getConfigurableBundlesItems = async (id: any) => {
        const resp = await fetch(`${API_URL}/configurable-bundle-templates/${id}?include=configurable-bundle-template-slots%2Cconcrete-products`, {
            method: "GET"
        });
        const result = await resp.json();
        console.log("configurable-product-items", result)
        result.included.forEach((item: any) => {
            if (item.type === "configurable-bundle-template-slots") {
                setSlot(slot => [...slot, item])
            }
        })
    }
    useEffect(() => {
        if (bundleId) {
            setSlot([])
            getConfigurableBundlesItems(bundleId)
        }
    }, [bundleId]);
    console.log("slots", slot)
    return (
        <>
            <Layout />
            <div style={{ paddingInline: "100px" }}>
                <Link href="/configurable-product">
                    <button style={{ border: "1px solid black", marginTop: "10px", padding: "5px" }}>Back To Bundles</button>
                </Link>
                <div style={{ border: "1px solid #dedede", marginTop: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                        {slot.map((val: any) => {
                            return (
                                <div style={{
                                    borderRight: "1px solid #dedede",
                                    borderBottom: "1px solid #dedede",
                                    width: "100%",
                                    color: "#c6c6c6",
                                    borderColor: "#dedede",
                                    padding: "1rem",
                                    fontWeight: 500,
                                    fontSize: ".8125rem",
                                    letterSpacing: ".1375rem",
                                    textTransform: "uppercase"
                                }}>{val.attributes.name}</div>
                            )
                        })}
                        <div style={{
                            borderBottom: "1px solid #dedede",
                            width: "100%",
                            color: "#c6c6c6",
                            borderColor: "#dedede",
                            padding: "1rem",
                            fontWeight: 500,
                            fontSize: ".8125rem",
                            letterSpacing: ".1375rem",
                            textTransform: "uppercase"
                        }}>summary</div>
                    </div>
                    <div style={{padding:"2rem"}}>
                        
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default ConfigurableBundleItems