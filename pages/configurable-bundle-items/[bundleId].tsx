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
    console.log(configurableBundleId,"configurableBundleId")
    // const configurableBundleId = props.route.params?.configurableBundleId;
  const [isLoading, setIsLoading] = useState(false);
  const [configuredBundleTemplateSlots, setConfiguredBundleTemplateSlots] =useState<any>([]);

    const allProductsWithSlots:any = [];
    useEffect(()=>{
    if (configuredBundleTemplateSlots?.included?.length > 0) {
      const slotIds =
        configuredBundleTemplateSlots?.data?.relationships[
          'configurable-bundle-template-slots'
        ]?.data;
      slotIds?.forEach((slot:any) => {
        configuredBundleTemplateSlots?.included.forEach((element:any) => {
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

      allProductsWithSlots?.forEach((products:any) => {
        products?.productSKUS?.map((item:any, index:number) => {
          configuredBundleTemplateSlots.included.forEach((includedItem:any) => {
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
      setFinalData(allProductsWithSlots);    }
},[configuredBundleTemplateSlots])

    useEffect(() => {
        const getConfiguredBundleSlotsByID = async (configurableBundleId:any) => {
          setIsLoading(true);
          const resp = await fetch(
            `${API_URL}/configurable-bundle-templates/${configurableBundleId}?include=configurable-bundle-template-slots%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
          {
            method: 'GET',
           })
           const response = await resp.json();
          console.log(response,"resp")
          setConfiguredBundleTemplateSlots(response);
          setIsLoading(false);
        };
        getConfiguredBundleSlotsByID(configurableBundleId);
      }, [configurableBundleId]);

      console.log(finalData,"allProductsWithSlots")

    return (
        <>
            <Layout />
            <div style={{ paddingInline: "50px" }}>
                <Link href="/configurable-product">
                    <button style={{ border: "1px solid black", marginTop: "10px", padding: "5px" }}>Back To Bundles</button>
                </Link>
                <div style={{ border: "1px solid #dedede", marginTop:"10px" }}>

                </div>
            </div>

            <Footer />
        </>
    )
}

export default ConfigurableBundleItems;