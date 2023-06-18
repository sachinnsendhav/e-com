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
    localStorage.setItem("cartId", "b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc");
     cartId = localStorage.getItem("cartId");
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [cartData, setCartData] = useState<any>();
  const [cartItems, setCartItems] = useState<any>();
  const [cartPrductArr, setCartPrductArr] = useState<any>([]);
  const [cartPrductImgArr, setCartPrductImgArr] = useState<any>([]);

  const priceTotal = () => {
    let totalPrice = 0;
    if (cartItems?.length > 0) {
      cartItems.map((item: any) => (totalPrice += item.price * item.count));
    }
    return totalPrice;
  };

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
  }, []);

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
      `https://glue.de.faas-suite-prod.cloud.spryker.toys//concrete-products/${productId}/concrete-product-image-sets`,
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
  
  
  console.log(cartData, "hello");

  return (
    <section className="cart">
       {cartPrductArr && cartPrductArr && cartItems ?
      <div className="container">
        <div className="cart__intro">
          <h3 className="cart__title">Shopping Cart</h3>
          <CheckoutStatus step="cart" />
        </div>

        <div className="cart-list">
          {cartItems?.length > 0 && (
            <table>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left" }}>Product</th>
                  <th> </th>
                  <th> </th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th></th>
                </tr>

                {cartItems.map((item:any,Index:number) => (
                  <Item
                    key={item.id}
                    id={cartPrductArr[Index]?.id}
                    thumb={cartPrductImgArr[Index]}
                    name={cartPrductArr[Index]?.attributes?.name}
                    color={item.color}
                    price={item.attributes?.calculations?.unitPrice}
                    size={item.size}
                    count={item?.attributes?.quantity}
                  />
                ))}
              </tbody>
            </table>
          )}

          {cartItems?.length === 0 && <p>Nothing in the cart</p>}
        </div>

        <div className="cart-actions">
          <a href="/products" className="cart__btn-back">
            <i className="icon-left"></i> Continue Shopping
          </a>
          <input
            type="text"
            placeholder="Promo Code"
            className="cart__promo-code"
          />

          <div className="cart-actions__items-wrapper">
            <p className="cart-actions__total">
              Total cost <strong>{cartData?.data?.attributes?.totals?.priceToPay}</strong>
            </p>
            <a href="/cart/checkout" className="btn btn--rounded btn--yellow">
              Checkout
            </a>
          </div>
        </div>
      </div>:
      <div>Loading....</div>}
    </section>
  );
};

export default ShoppingCart;
