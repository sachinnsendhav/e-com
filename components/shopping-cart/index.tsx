import { useSelector } from "react-redux";
import CheckoutStatus from "../../components/checkout-status";
import Item from "./item";
import { RootState } from "store";
import { useEffect, useState } from "react";

const ShoppingCart = () => {
  // const { cartItems } = useSelector((state: RootState)  => state.cart);
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
  const [cartPrductAvableArr, setCartPrductAvableArr] = useState<any>([]);
  const [cartUpdated, setCartUpdated] = useState<number>(0);

  const priceTotal = () => {
    let totalPrice = 0;
    if (cartItems?.length > 0) {
      cartItems.map((item: any) => (totalPrice += item.price * item.count));
    }
    return totalPrice;
  };

  const handlecart = async() =>{
    try {
      const resp = await fetch(
        `https://glue.de.faas-suite-prod.cloud.spryker.toys/carts`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      if (resp.status === 401) {
        alert("Please Login")
        window.location.href = "/login";
        return;
      }
      console.log(resp,"resp_+_+_+_+_+")
      const response = await resp.json();
    
      if (response) {
        setCartUpdated(cartUpdated+1)
        setIsLoading(false);
        localStorage.setItem("cartId",response?.data[0].id)
        cartId = response?.data[0].id;
        return response?.data[0].id;
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsLoading(false);
    }}

  useEffect(() => {
    const handleGetCart = async () => {
      try {
        const resp = await fetch(
          `https://glue.de.faas-suite-prod.cloud.spryker.toys/carts/${cartId}?include=items`,
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
        } else  if (resp.status === 404) {
          alert("Cart not found: checking")
          await handlecart();
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
  }, [cartUpdated,cartId]);

  useEffect(() => {
    const setCartData = async () => {
      const tempData: any = [];
      const tempImgData: any = [];
      const tempAvalbData:any = [];
  
      await Promise.all(
        cartItems?.map(async (item: any, index: number) => {
          const result = await getProductDetails(item?.attributes?.sku);
          const {imgData, avalibility} = await getProductImage(item?.attributes?.sku);
  
          tempData[index] = result?.data;
          tempImgData[index] = imgData?.attributes?.imageSets[0]?.images[0]?.externalUrlSmall;
          tempAvalbData[index] = avalibility?.attributes
        })
      );
      setCartPrductAvableArr(tempAvalbData);
      setCartPrductImgArr(tempImgData);
      setCartPrductArr(tempData);
    };
  
    if (cartItems && cartItems.length > 0) {
      setCartData();
    }
  
  }, [cartItems]);
  
  const getProductDetails = async (productId: string) => {
    const resp = await fetch(
      `https://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/${productId}`,
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
      `https://glue.de.faas-suite-prod.cloud.spryker.toys//concrete-products/${productId}?include=concrete-product-image-sets%2cconcrete-product-availabilities`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const imgData = await img.json();
    return {imgData:imgData?.included[0], avalibility:imgData?.included[1]};
  };
  
  const setProductCount = async(count: number,pliId:string, id:string) => {
    const productCart = {
      data: {
        type: "items",
        attributes: {
          sku: id,
          quantity: count,
          salesUnit: {
            id: 0,
            amount: 0,
          },
          productOptions: [null],
        },
      },
    };
    setIsLoading(true);
    try {
      const resp = await fetch(
        `https://glue.de.faas-suite-prod.cloud.spryker.toys/carts/${cartId}/items/${pliId}`,
        {
          method: "PATCH",
          body: JSON.stringify(productCart),
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
      } else  if (resp.status === 404) {
        alert("Cart not found: checking")
        await handlecart();
        return;
      }
      const response = await resp.json();
      if (response) {
        setCartUpdated(cartUpdated+1)
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      
      setIsLoading(false);
    }
  }

  const removeProductFromCart = async (pliId:string) => {
    if(confirm("Do you want to remove this product")){
      setIsLoading(true);
    try {
      const resp = await fetch(
        `https://glue.de.faas-suite-prod.cloud.spryker.toys/carts/${cartId}/items/${pliId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.status === 401) {
        // Redirect to "/login" route
        alert("Please Login");
        setIsLoading(false);
        window.location.href = "/login";
        return;
      } else  if (resp.status === 404) {
        alert("Cart not found: checking")
        await handlecart();
        return;
      }
      if (resp.status == 204) {
        setCartUpdated(cartUpdated + 1);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    } 
  }
  };
  

  return (
    <section className="cart">
      {isLoading?<div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>Loading...</div>:
      <div className="container">
       {cartPrductArr && cartPrductArr && cartItems ?
        <div className="cart__intro">
          <h3 className="cart__title">Shopping Cart</h3>
          <CheckoutStatus step="cart" />
        </div>
        :<div></div>}
        <div className="cart-list">
          {cartItems && cartItems?.length > 0 && (
            <table>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left", color:"black" }}>Product</th>
                  <th> </th>
                  <th> </th>
                  <th style={{color:"black"}}>Quantity</th>
                  <th style={{color:"black"}}>Price</th>
                  <th></th>
                </tr>

                {cartItems.map((item:any,Index:number) => (
                  <Item
                    key={item.id}
                    pliId={item.id}
                    id={cartPrductArr[Index]?.id}
                    thumb={cartPrductImgArr[Index]}
                    avalibility={cartPrductAvableArr[Index]}
                    name={cartPrductArr[Index]?.attributes?.name}
                    color={item.color}
                    price={item.attributes?.calculations?.unitPrice}
                    size={item.size}
                    count={item?.attributes?.quantity}
                    setProductCount={setProductCount}
                    removeProductFromCart={removeProductFromCart}
                  />
                ))}
              </tbody>
            </table>
          )}

          {!cartItems && <p>Nothing in the cart</p>}
        </div>

        <div className="cart-actions">
          <a href="/" className="cart__btn-back">
            <i className="icon-left"></i> Continue Shopping
          </a>
          <input
            type="text"
            placeholder="Promo Code"
            className="cart__promo-code"
          />

          <div className="cart-actions__items-wrapper">
            <p className="cart-actions__total">
              Total cost <strong>&euro;  {cartData?.data?.attributes?.totals?.priceToPay}</strong>
            </p>
            <a href="/cart/checkout" className="btn btn--rounded btn--yellow">
              Checkout
            </a>
          </div>
        </div>
      </div>
}
    </section>
  );
};

export default ShoppingCart;
