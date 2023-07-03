import Link from "next/link";
import { some } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavProduct } from "store/reducers/user";
import { RootState } from "store";
import { ProductTypeList } from "types";
import API_URL from "config";
import { useState } from "react";

const ProductItem = ({
  images,
  id,
  name,
  price,
  concreteId,
}: ProductTypeList) => {
  const dispatch = useDispatch();
  const { favProducts } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFavourite = some(favProducts, (productId) => productId === id);
  const token = localStorage.getItem("token");
  var cartId = localStorage.getItem("cartId");
  var wishlistId = '2bf4b763-4044-5eb0-aa27-7d07ae9b8a7c';
  const toggleFav = async () => {
    await handleAddtoWishlist();
    // dispatch(
    //   toggleFavProduct({
    //     id,
    //   })
    // );
  };
  console.log(token, concreteId, "token");

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
              localStorage.removeItem('cartId');
              cartId= null;
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
        const resp = await fetch(`${API_URL}/shopping-lists/${wishlistId}/shopping-list-items`, {
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
            alert(response.errors[0]?.detail);
          } else {
            alert("Added to Wishlist");
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        setIsLoading(false);
      }
    }else {
      if (confirm("Please Login")) {
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className="product-item">
      <div className="product__image">
        <button
          type="button"
          onClick={()=>toggleFav()}
          className={`btn-heart ${isFavourite ? "btn-heart--active" : ""}`}
        >
          <i className="icon-heart"></i>
        </button>

        <Link href={`/product/${name}?skuId=${id}`}>
          <a>
            <img src={images ? images : ""} alt="product" />
          </a>
        </Link>
      </div>
      <div className="product__description">
        <h3 style={{ fontFamily: "sans-serif" }}>{name}</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold", color: "black" }}>
            &euro; {price}
          </span>
          <button
            style={{
              padding: "8px",
              background: "green",
              color: "white",
              borderRadius: "5px",
            }}
            onClick={() => handleAddtocart()}
          >
            {" "}
            {isLoading ? "Adding to Cart" : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
