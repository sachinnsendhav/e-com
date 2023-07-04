import Link from "next/link";
import { some } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavProduct } from "store/reducers/user";
import { RootState } from "store";
import { ProductTypeList } from "types";
import { API_URL, SHOPPING_LIST_ID } from "config";
import { useEffect, useState } from "react";

const ProductItem = ({
  images,
  id,
  name,
  description,
  price,
  concreteId,
  wishlistProdId,
}: ProductTypeList) => {
  const dispatch = useDispatch();
  const { favProducts } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wishlisted, setWishlisted] = useState<any>();
  const isFavourite = some(favProducts, (productId) => productId === id);
  const token = localStorage.getItem("token");
  var cartId = localStorage.getItem("cartId");
  var wishlistId = SHOPPING_LIST_ID;
  const toggleFav = async () => {
    wishlisted ? await handleAddtoWishlist() : await handleAddtoWishlist();
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

  console.log(wishlistId, "eyyyy");

  const handleAddtocart = async () => {
    if (token) {
      if (cartId) {
        const productCart = {
          data: {
            type: "items",
            attributes: {
              sku: concreteId,
              quantity: 1,
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
            console.log(response, "sdfnjksdfnsdjnfksjdnfksjn");
            if (response.errors) {
              localStorage.removeItem("cartId");
              cartId = null;
              alert(response.errors[0]?.detail);
              handleAddtocart();
            } else {
              alert("Added to cart");
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error adding to cart:", error);
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
      console.log(resp, "resp_+_+_+_+_+");
      const response = await resp.json();

      if (response) {
        setIsLoading(false);
        localStorage.setItem("cartId", response?.data[0].id);
        cartId = response?.data[0].id;
        await handleAddtocart();
        return response?.data[0].id;
        console.log(response?.data[0].id, "response_+_+_+_+_+");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
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
          console.error("Error adding to cart:", error);
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
          console.error("Error adding to cart:", error);
          setIsLoading(false);
        }
      }
    } else {
      if (confirm("Please Login")) {
        window.location.href = "/login";
      }
    }
  };

  const sentences = description.split(".");

  return (
    <div className="product-item">
      <div style={{display:"flex",flexDirection:'column'}}>
        <button
          type="button"
          onClick={() => toggleFav()}
          className={`btn-heart ${wishlisted ? "btn-heart--active" : ""}`}
        >
          <i className="icon-heart"></i>
        </button>
        <h3
          style={{
            fontFamily: "sans-serif",
            marginTop: "1rem",
            marginBottom: "1rem",
            fontSize: "1.3rem",
          }}
        >
          P {id}
        </h3>
        <p
          style={{
            fontFamily: "sans-serif",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          {name}
        </p>
        <p style={{ fontFamily: "sans-serif", marginBottom: "1rem" }}>
          ID: {concreteId}
        </p>
        <div className="product__image" style={{ background: "#fff" }}>
          <Link href={`/product/${name}?skuId=${id}`}>
            <a
              style={{
                borderBottom: "1px solid",
                width: "116%",
                position: "relative",
                left: "-28px",
              }}
            >
              <img src={images ? images : ""} alt="product" />
            </a>
          </Link>
        </div>
        
        <div className="product__description">
          <h3 style={{ fontFamily: "sans-serif" }}>Description: </h3>
          {sentences?.slice(0, 2).map((item, index) => (
            <li style={{ marginTop: "1rem" }} key={index}>
              {item}
            </li>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{ fontWeight: "bold", color: "rgb(207 18 46)", paddingTop: "10px" }}
        >
          &euro; {price}
        </span>
        <button
          style={{
            padding: "16px 32px",
            color: "rgb(207 18 46)",
            borderRadius: "33px",
            border: "1px solid rgb(207 18 46)",
            fontWeight:"900"
          }}
          onClick={() => handleAddtocart()}
        >
          {" "}
          {isLoading ? "Adding to Cart" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
