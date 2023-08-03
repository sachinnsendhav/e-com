import Link from "next/link";
import { API_URL, SHOPPING_LIST_ID } from "config";
import { useEffect, useState } from "react";
import { CURRENCY_SYMBOLE } from '../../config';
const ProductItem = ({
  images,
  id,
  name,
  description,
  price,
  concreteId,
  wishlistProdId
}: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wishlisted, setWishlisted] = useState<any>();
  const [offerPrice, setofferPrice] = useState<any>();
  
  const token = localStorage.getItem("token");
  var cartId = localStorage.getItem("cartId");
  var wishlistId = SHOPPING_LIST_ID;
  const [selectedMerchantOffer, setSelectedMerchantOffer] = useState<any>();
  const toggleFav = async () => {
    if (wishlisted) {
      // Item is already wishlisted, do nothing
    } else {
      // Item is not wishlisted, add it to the wishlist
      await handleAddtoWishlist();
    }
  };

  useEffect(() => {
    const matchingItem = wishlistProdId?.find(
      (item: any) => item.sku === concreteId
    );
    if (matchingItem) {
      setWishlisted(matchingItem.wishId);
    } else {
      setWishlisted(null);
    }
  }, [wishlistProdId]);


  const handleAddtocart = async () => {
    //console.log(selectedMerchantOffer,"selectedMerchantOffer");
    if (token) {
      if (cartId) {
        var productCart = {
          data: {
            type: "items",
            attributes: {
              sku: String(concreteId),
              productOfferReference: null,
              merchantReference:null,
              quantity: 1,
              salesUnit: {
                id: 0,
                amount: 0,
              },
              productOptions: [null],
            },
          },
        };
   
        await selectedMerchantOffer
          ? (productCart = {
              data: {
                type: "items",
                attributes: {
                  sku: String(concreteId),
                  productOfferReference: selectedMerchantOffer?.id,
                  merchantReference: selectedMerchantOffer?.attributes?.merchantReference,
                  quantity: 1,
                  salesUnit: {
                    id: 0,
                    amount: 0,
                  },
                  productOptions: [null],
                },
              },
            })
          : "";
          //console.log(productCart,"test")
        setIsLoading(true);
        try {
          const resp = await fetch(`${API_URL}/carts/${cartId}/items`, {
            method: "POST",
            body: JSON.stringify(productCart),
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (resp.status === 401) {
            // Redirect to login page
            alert("Please Login");
            window.location.href = "/login";
            return;
          }

          const response = await resp.json();

          if (response) {
            if (response.errors) {
              localStorage.removeItem("cartId");
              cartId = null;
              alert(response.errors[0]?.detail);
             // handleAddtocart();
            } else {
              alert("Added to cart");
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        await handlecart();
      }
    } else {
      if (confirm("Please Login")) {
        window.location.href = "/login";
      }
    }
  };


  const createCart = async () => {
    const data = {
      data: {
        type: "carts",
        attributes: {
          priceMode: "NET_MODE",
          currency: "USD",
          store: "US",
          name: "cart",
        },
      },
    };
    try {
      const resp = await fetch(`${API_URL}/carts`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 401) {
        alert("Please Login");
        window.location.href = "/login";
        return;
      }
      const response = await resp.json();

      if (response) {
        setIsLoading(false);
        localStorage.setItem("cartId", response?.data?.id);
        cartId = response?.data?.id;
        return response?.data?.id;
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handlecart = async () => {
    try {
      const resp = await fetch(`${API_URL}/carts`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 401) {
        alert("Please Login");
        window.location.href = "/login";
        return;
      }
      const response = await resp.json();

      if (response) {
        setIsLoading(false);
        if (response?.data.length>0) {
          localStorage.setItem("cartId", response?.data[0].id);
          cartId = response?.data[0].id;
          await handleAddtocart();
          return response?.data[0].id;
        } else {
           await createCart();
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleAddtoWishlist = async () => {
    if (token) {
      if (!wishlisted) {
        const productCart = {
          data: {
            type: "shopping-list-items",
            attributes: {
              productOfferReference: null,
              quantity: 1,
              sku: concreteId,
            },
          },
        };
        setIsLoading(true);
        try {
          const resp = await fetch(
            `${API_URL}/shopping-lists/${wishlistId}/shopping-list-items`,
            {
              method: "POST",
              body: JSON.stringify(productCart),
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (resp.status === 401) {
            // Redirect to login page
            alert("Please Login");
            window.location.href = "/login";
            return;
          }

          const response = await resp.json();

          if (response) {
            if (response.errors) {
              alert(response.errors[0]?.detail);
            } else {
              setWishlisted(response?.data?.id);
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        try {
          const resp = await fetch(
            `${API_URL}/shopping-lists/${wishlistId}/shopping-list-items/${wishlisted}`,
            {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (resp.status === 401) {
            // Redirect to login page
            alert("Please Login");
            window.location.href = "/login";
            return;
          }
          if (resp.status === 204) {
            setWishlisted(null);
          }
          const response = await resp.json();

          if (response) {
            if (response.errors) {
              alert(response.errors[0]?.detail);
            }

            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      }
    } else {
      if (confirm("Please Login")) {
        window.location.href = "/login";
      }
    }
  };
  // var offerPrice: any;
  useEffect(() => {
    const handleMerchant = async (skuId: any) => {
      try {
        const resp = await fetch(
          `${API_URL}/concrete-products/${skuId}/product-offers?include=product-offer-prices`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",

            },
          }
        );
        const response = await resp.json();
        var groupId = localStorage.getItem("customerGroup");
        if (response.data?.length && response.data.length > 0) {
          var groupOffer = response.data.find((offer: any) => {
            return offer.attributes?.fkCustomerGroup == groupId;
          })
         
          if (groupOffer) {
            if (response.included?.length && response.included.length > 0) {
              var offerfilteredPrice: any = response.included.find((inc: any) => inc.id === groupOffer.id);
              setSelectedMerchantOffer(groupOffer);
              setofferPrice(offerfilteredPrice.attributes.price / 100);


            }
          }
        }

      } catch (error) {
        //console.log(error, "error offer")

      }
    };

    // Call the handleMerchant function here
    if (token) {
      handleMerchant(id);
    }
  }, []);
  const temp = description?.split('&')[1]
  const sentences = temp?.split(/\.|<B>/)
    .map((sentence: any) => sentence.replace(/-/g, ' ').replace(/<br\/?>/g, '').replace(/<\/?b>/g, ''));
  //console.log(sentences, "descccc");

  const btnName = token ? "Add To Cart" : "Login to Add to Cart";
  // alert(btnName);

  return (
    <div className="product-item">
      <div style={{ display: "flex", flexDirection: 'column' }}>
        <button
          type="button"
          onClick={() => toggleFav()}
          className={`btn-heart ${wishlisted ? "btn-heart--active" : ""}`}
        >
          <i className="icon-heart"></i>
        </button>
        <div style={{ height: "100px", marginBottom: "3rem" }}>
          <h3
            style={{
              fontFamily: "sans-serif",
              marginTop: "1rem",
              marginBottom: "1rem",
              fontSize: "18px",
            }}
          >
            {name}
          </h3>
          <p
            style={{
              fontFamily: "sans-serif",
              marginTop: "1rem",
              marginBottom: "1rem",
              fontSize: ".875rem"
            }}
          >
            Model : MX-COPIER
          </p>
          <p style={{ fontSize: ".875rem", marginBottom: "1rem" }} className="pid">
            ID: {concreteId}
          </p>
        </div>
        <div className="product__image" style={{ background: "#fff" }} >
          <Link href={`/product/${name}?skuId=${id}`} >
            <a
              className="product__link"
              style={{

                width: "121%",
                position: "relative",
                left: "-28px",
              }}
            >
              <img src={images ? images : ""} alt="product" />
            </a>
          </Link>
        </div>

        <div className="product__description">
          {/* <h3 style={{ fontFamily: "sans-serif" }}>Description: </h3> */}
          {sentences?.slice(0, 4).map((item: any, index: number) => (
            <ul>
              {item ?
                <li style={{ marginTop: "1rem", fontSize: ".875rem" }} key={index}>
                  {item}
                </li> : ""}
            </ul>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }} className="product-price">
        <span
          style={{ fontWeight: "bold", color: "rgb(207 18 46)" }}
        >
          {token ?
            <>{CURRENCY_SYMBOLE}{(offerPrice ? offerPrice : price / 100).toFixed(2)} </> : ""}
        </span>
        <button
          className="add-to-cart"

          style={btnName == "Add To Cart" ? {
            padding: "16px 32px",
            color: "rgb(207 18 46)",
            borderRadius: "33px",
            border: "1px solid rgb(207 18 46)",
            fontWeight: "900",
          } : {
            padding: "16px 32px",
            color: "rgb(207 18 46)",
            borderRadius: "33px",
            border: "1px solid rgb(207 18 46)",
            fontWeight: "900",
            marginRight: "40px"
          }}

          // style={{
          //   padding: "16px 32px",
          //   color: "rgb(207 18 46)",
          //   borderRadius: "33px",
          //   border: "1px solid rgb(207 18 46)",
          //   fontWeight: "900",

          // }}
          onClick={() => handleAddtocart()}
        >
          {" "}
          {isLoading ? "Adding to Cart" : token ?
            "Add To Cart" : "Login to Add to Cart"}
        </button>
      </div>
    </div >

  );
};

export default ProductItem;
