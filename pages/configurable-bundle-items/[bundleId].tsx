import Footer from 'components/footer'
import React, { useState, useEffect } from 'react'
import Layout from '../../layouts/Main';
import { API_URL } from "../../config"
import Link from 'next/link';
import { useRouter } from 'next/router';

function ConfigurableBundleItems() {
    const router = useRouter();
    const configurableBundleId = router.query.bundleId;
    const [finalData, setFinalData] = useState<any>([]);
    const [showBlock, setShowBlock] = useState('');
    const [productData, setProductData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [configuredBundleTemplateSlots, setConfiguredBundleTemplateSlots] = useState<any>([]);

    const allProductsWithSlots: any = [];
    useEffect(() => {
        if (configuredBundleTemplateSlots?.included?.length > 0) {
            const slotIds =
                configuredBundleTemplateSlots?.data?.relationships[
                    'configurable-bundle-template-slots'
                ]?.data;
            slotIds?.forEach((slot: any) => {
                configuredBundleTemplateSlots?.included.forEach((element: any) => {
                    if (
                        element.type == 'configurable-bundle-template-slots' &&
                        slot.id === element.id
                    ) {
                        allProductsWithSlots.push({
                            slotID: slot.id,
                            productSKUS: element?.relationships['concrete-products']?.data,
                            slotName: element?.attributes?.name,
                        });
                    }
                });
            });

            allProductsWithSlots?.forEach((products: any) => {
                products?.productSKUS?.map((item: any, index: number) => {
                    configuredBundleTemplateSlots.included.forEach((includedItem: any) => {
                        if (
                            includedItem.type === 'concrete-product-image-sets' &&
                            item?.id === includedItem.id
                        ) {
                            const externalUrlLarge =
                                includedItem.attributes.imageSets[0]?.images[0]
                                    ?.externalUrlLarge;
                            item.image = externalUrlLarge;
                        }
                        if (
                            includedItem.type === 'concrete-product-prices' &&
                            item?.id === includedItem.id
                        ) {
                            const price = includedItem.attributes.price;
                            item.price = price;
                        }
                        if (
                            includedItem.type === 'concrete-products' &&
                            item?.id === includedItem.id
                        ) {
                            const name = includedItem.attributes.name;
                            item.name = name;
                        }
                    });
                });
            });
            setFinalData(allProductsWithSlots);
        }
    }, [configuredBundleTemplateSlots])

    useEffect(() => {
        const getConfiguredBundleSlotsByID = async (configurableBundleId: any) => {
            setIsLoading(true);
            const resp = await fetch(
                `${API_URL}/configurable-bundle-templates/${configurableBundleId}?include=configurable-bundle-template-slots%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
                {
                    method: 'GET',
                })
            const response = await resp.json();
            console.log(response, "resp")
            setConfiguredBundleTemplateSlots(response);
            setIsLoading(false);
        };
        getConfiguredBundleSlotsByID(configurableBundleId);
    }, [configurableBundleId]);
    useEffect(() => {
        setShowBlock(finalData[0]?.slotName)
    }, [finalData])
    console.log(productData, "productData")
    useEffect(() => {
        finalData.forEach((element: any) => {
            if (element.slotName === showBlock) {
                setProductData(element.productSKUS)
            }
        });
    }, [showBlock])
    return (
        <>
            <Layout />
            <div style={{ paddingInline: "100px" }}>
                <Link href="/configurable-product">
                    <button style={{ border: "1px solid black", marginTop: "10px", padding: "5px" }}>Back To Bundles</button>
                </Link>
                <div style={{ border: "1px solid #dedede", marginTop: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                        {finalData.map((val: any) => {
                            return (
                                <div style={{
                                    borderRight: "1px solid #dedede",
                                    borderBottom: "1px solid #dedede",
                                    background: `${showBlock === val.slotName ? '#dedede' : '#ffffff'}`,
                                    width: "100%",
                                    color: `${showBlock === val.slotName ? '#eeeee' : '#c6c6c6'}`,
                                    borderColor: "#dedede",
                                    padding: "1rem",
                                    fontWeight: 500,
                                    fontSize: ".8125rem",
                                    letterSpacing: ".1375rem",
                                    textTransform: "uppercase"
                                }} onClick={() => setShowBlock(val.slotName)}>{val.slotName}</div>
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
                    <div style={{ padding: "2rem" }}>
                        {productData.map((item: any) => {

                            return (
                                <div style={{ margin: "20px", marginInline: "100px", padding: "2rem", display: "flex", background: "#dedede" }}>
                                    <div style={{width:"150px"}}>
                                        <img src={item.image} style={{width:"100%",background:"#dedede", objectFit:"cover"}}/>
                                    </div>
                                    <div style={{padding:"50px", color:"black"}}>{item.name}</div>
                                    <div></div>
                                </div>
                            )

                        })}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default ConfigurableBundleItems;