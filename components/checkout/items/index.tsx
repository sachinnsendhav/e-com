import API_URL from 'config';
import { useEffect, useState } from 'react';

const CheckoutItems = () => {
  var token:any;
  var cartId:any;
  if (typeof window !== 'undefined') {
    // Code running in the browser
     token = localStorage.getItem("token");
     cartId = localStorage.getItem("cartId");
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [cartData, setCartData] = useState<any>();
  const [cartItems, setCartItems] = useState<any>();
  const [cartPrductArr, setCartPrductArr] = useState<any>([]);
  const [cartPrductImgArr, setCartPrductImgArr] = useState<any>([]);
  const [cartUpdated, setCartUpdated] = useState<number>(0);


  useEffect(() => {
    const handleGetCart = async () => {
      try {
        const resp = await fetch(
          `${API_URL}/carts/${cartId}?include=items`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (resp.status === 401) {
          // Redirect to "/login" route
          alert("Please Login")
          window.location.href = "/login";
          return;
        }
        const response = await resp.json();
        if (response) {
          
          setCartData(response);
          setCartItems(response?.included);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        
        setIsLoading(false);
      }
    };
    handleGetCart();
  }, [cartUpdated]);

  useEffect(() => {
    const setCartData = async () => {
      const tempData: any = [];
      const tempImgData: any = [];
  
      await Promise.all(
        cartItems?.map(async (item: any, index: number) => {
          const result = await getProductDetails(item?.attributes?.sku);
          const imgData = await getProductImage(item?.attributes?.sku);
  
          tempData[index] = result?.data;
          tempImgData[index] = imgData?.data[0]?.attributes?.imageSets[0]?.images[0]?.externalUrlSmall;
        })
      );
  
      setCartPrductImgArr(tempImgData);
      setCartPrductArr(tempData);
    };
  
    if (cartItems && cartItems.length > 0) {
      setCartData();
    }
  
  }, [cartItems]);
  
  const getProductDetails = async (productId: string) => {
    const resp = await fetch(
      `${API_URL}/concrete-products/${productId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const result = await resp.json();
    return result;
  };
  
  const getProductImage = async (productId: string) => {
    const img = await fetch(
      `${API_URL}/concrete-products/${productId}/concrete-product-image-sets`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const imgData = await img.json();
    return imgData;
  };
  

  return (
    <ul className="checkout-items">
       {cartPrductArr && cartPrductArr && cartItems &&
      cartItems?.map((item:any,Index:number) => (
        <li className="checkout-item">
          <div className="checkout-item__content">
            <div className="checkout-item__img">
              <img src={cartPrductImgArr[Index]} />
            </div>

            <div className="checkout-item__data">
              <h3>{cartPrductArr[Index]?.attributes?.name}</h3>
            </div>
          </div>
          <h3>&euro; {item.attributes?.calculations?.unitPrice*item?.attributes?.quantity}</h3>
        </li>
      ))}
    </ul>
  )
};

  
export default CheckoutItems