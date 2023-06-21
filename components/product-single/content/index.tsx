import { useState, useEffect } from "react";
import productsColors from "./../../../utils/data/products-colors";
import productsSizes from "./../../../utils/data/products-sizes";
import CheckboxColor from "./../../products-filter/form-builder/checkbox-color";
import { useDispatch, useSelector } from "react-redux";
import { some } from "lodash";
import { addProduct } from "store/reducers/cart";
import { toggleFavProduct } from "store/reducers/user";
import { ProductType, ProductStoreType } from "types";
import { RootState } from "store";

const Content = (product: any) => {
  const dispatch = useDispatch();

  var cartId:any;
  var token:any;
  if (typeof window !== 'undefined') {
    // Code running in the browser
    cartId = localStorage.getItem("cartId")
     token = localStorage.getItem("token");
  }
  const [count, setCount] = useState<number>(1);
  const [color, setColor] = useState<string>("");
  const [itemSize, setItemSize] = useState<string>("");

  const [variationData, setVariationData] = useState<any>();
  const [variationIdData, setVariationIdData] = useState<any>();
  const [variationKey, setVariationKey] = useState<any>();
  const [productData, setProductData] = useState<any>();
  const [price, setPrice] = useState(null);
  const [priceSymbole, setPriceSymbole] = useState(null);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProductData(product?.product);
    setVariationIdData(product?.product?.attributeMap?.product_concrete_ids);
  }, [product]);

  useEffect(()=>{
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
        setIsLoading(false);
        localStorage.setItem("cartId",response?.data[0].id)
       console.log(response?.data[0].id,"response_+_+_+_+_+")
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsLoading(false);
    }}
    handlecart();
  },[])

  useEffect(() => {
    if (productData) {
      const getPrice = async () => {
        const resp = await fetch(
          `https://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/${productData?.sku}/abstract-product-prices`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );
        const response = await resp.json();
        if (resp.status == 200) {
          setPrice(response?.data[0]?.attributes?.price);
          setPriceSymbole(
            response?.data[0]?.attributes?.prices[0]?.currency?.symbol
          );
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      };
      getPrice();
    }
  }, [productData]);


  useEffect(() => {
    var tempVar: any = [];
    const handlerfunction = async () => {
      if (productData) {

        Object.keys(productData?.attributeMap?.attribute_variant_map)?.map(
          (item, index) => {
            tempVar.push({
              id: index,
              title: Object.keys(
                productData?.attributeMap?.attribute_variant_map[item]
              ).map((item1) => {
                return productData?.attributeMap?.attribute_variant_map[item][
                  item1
                ];
              }),
            });
          }
        );
        setVariationData(tempVar);
        Object.keys(productData?.attributeMap?.super_attributes)?.map((item1:any,index:number)=>{
          if(index == 0){
            setVariationKey(item1)
          }
        })
      }
    };
    handlerfunction();
  }, [productData]);
  const AddtoCartHandler = async () => {
    if (variationData && variationData[1]) {
      if (selectedId) {
        var productSkuId = "";
        await variationIdData?.map((item: any, index: Number) => {
          if (index == selectedId) {
            productSkuId = item;
          }
        });
      } else {
        return alert("select Varint");
      }
    } else {
      productSkuId = variationIdData[0];
    }
    if (productSkuId) {
      const productCart = {
        data: {
          type: "items",
          attributes: {
            sku: productSkuId,
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
          `https://glue.de.faas-suite-prod.cloud.spryker.toys/carts/${cartId}/items`,
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
          alert("Please Login")
          window.location.href = "/login";
          return;
        }
      
        const response = await resp.json();
      
        if (response) {
          setIsLoading(false);
          alert("Added to cart");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        setIsLoading(false);
      }
      
    }
  };
  const onColorSet = (e: string) => setColor(e);
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setItemSize(e.target.value);

  const { favProducts } = useSelector((state: RootState) => state.user);
  const isFavourite = some(
    favProducts,
    (productId) => productId === product.id
  );

  const toggleFav = () => {
    dispatch(
      toggleFavProduct({
        id: product.id,
      })
    );
  };

  const addToCart = () => {
    const productToSave: ProductStoreType = {
      id: product.id,
      name: product.name,
      thumb: product.images ? product.images[0] : "",
      price: product.currentPrice,
      count: count,
      color: color,
      size: itemSize,
    };

    const productStore = {
      count,
      product: productToSave,
    };

    dispatch(addProduct(productStore));
  };

  return (
    <section className="product-content">
      <div className="product-content__intro">
        <h5 className="product__id">
          Product ID:<br></br>
          {productData?.sku}
        </h5>
        <span className="product-on-sale">Sale</span>
        <h2 className="product__name">{productData?.name}</h2>

        <div className="product__prices">
          <h4>
            {priceSymbole} {price}
          </h4>
          {product.discount && <span>${product.price}</span>}
        </div>
      </div>

      <div className="product-content__filters">
        {/* <div className="product-filter-item">
          <h5>Color:</h5>
          <div className="checkbox-color-wrapper">
            {productsColors.map(type => (
              <CheckboxColor 
                key={type.id} 
                type={'radio'} 
                name="product-color" 
                color={type.color}
                valueName={type.label}
                onChange={onColorSet} 
              />
            ))}
          </div>
        </div> */}
{productData && 
<div style={{display:"flex",marginBottom:"2rem"}}>
        <div style={{display:"flex",flexDirection:"column"}}>
          {Object.keys(productData?.attributes)?.map(
            (item, index) => {
              return <span key={index}>{item}</span>;
            }
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column"}}>
          {Object.keys(productData?.attributes)?.map(
            (item, index) => {
              return (
                <span key={index}>
                  : {productData?.attributes[item]}
                </span>
              );
            }
          )}
        </div>
        </div>}
        {variationData && variationData[1] && (
          <div className="product-filter-item">
            <h5>Variants : </h5>
            <div className="checkbox-color-wrapper">
              <div className="select-wrapper">
                <select onChange={(e) => setSelectedId(e.target.value)}>
                  <option>Choose {variationKey? variationKey:"any option"}</option>
                  {variationData?.map((item: any) => (
                    <option value={item.id}>{item.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        <div className="product-filter-item">
          <h5>Quantity:</h5>
          <div className="quantity-buttons">
            <div className="quantity-button">
              <button
                type="button"
                onClick={() => setCount(count - 1)}
                className="quantity-button__btn"
              >
                -
              </button>
              <span>{count}</span>
              <button
                type="button"
                onClick={() => setCount(count + 1)}
                className="quantity-button__btn"
              >
                +
              </button>
            </div>

            <button
              type="submit"
              onClick={() => AddtoCartHandler()}
              className="btn btn--rounded btn--yellow"
            >{isLoading? "Adding to cart...":
                  "Add to cart"}
            </button>
            <button
              type="button"
              onClick={toggleFav}
              className={`btn-heart ${isFavourite ? "btn-heart--active" : ""}`}
            >
              <i className="icon-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
