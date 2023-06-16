import { useState, useEffect } from 'react';
import productsColors from './../../../utils/data/products-colors';
import productsSizes from './../../../utils/data/products-sizes';
import CheckboxColor from './../../products-filter/form-builder/checkbox-color';
import { useDispatch, useSelector } from 'react-redux';
import { some } from 'lodash';
import { addProduct } from 'store/reducers/cart';
import { toggleFavProduct } from 'store/reducers/user';
import { ProductType, ProductStoreType } from 'types';
import { RootState } from 'store';


const Content = ( product:any) => {
  console.log(product,"product")
  const dispatch = useDispatch();
  
  const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmcm9udGVuZCIsImp0aSI6IjhlNjVlNDRiZjJiZmVmYWQ5OTUzZDI2OTM1N2QwOTE4MzRmNzliMmI1NDRhYjQ1MzE5MTE0NDE0ZWFkZjk5ZTZiNTUxY2UyY2ZjYzkyMDc4IiwiaWF0IjoxNjg2ODk5ODE1LjgxMzQ4NzEsIm5iZiI6MTY4Njg5OTgxNS44MTM0ODksImV4cCI6MTY4NjkyODM3Mywic3ViIjoie1wiaWRfY29tcGFueV91c2VyXCI6XCJlYmY0YjU1YS1jYWIwLTVlZDAtOGZiNy01MjVhM2VlZWRlYWNcIixcImlkX2FnZW50XCI6bnVsbCxcImN1c3RvbWVyX3JlZmVyZW5jZVwiOlwiREUtLTIxXCIsXCJpZF9jdXN0b21lclwiOjIxLFwicGVybWlzc2lvbnNcIjp7XCJwZXJtaXNzaW9uc1wiOlt7XCJpZF9wZXJtaXNzaW9uXCI6MSxcImNvbmZpZ3VyYXRpb25fc2lnbmF0dXJlXCI6XCJbXVwiLFwiaWRfY29tcGFueV9yb2xlXCI6bnVsbCxcImNvbmZpZ3VyYXRpb25cIjp7XCJpZF9xdW90ZV9jb2xsZWN0aW9uXCI6WzQ5LDUwLDUxLDUyLDUzLDYwNjksNjI3MCw2NTA4LDY1NDQsNjY2NCw2ODMyLDY4MzMsNjgzNSw2ODYzLDc2NDcsNzY0OSw3NjUwLDc2NTEsNzY1Miw3NjUzLDc2NTQsNzY1NSw3NjU2LDc2NTcsNzY1OCw3NjU5LDc2NjAsNzY2MSw3NjYyLDc2NjMsNzY4Myw3Njg0LDc2ODUsNzY4OCw3Njg5LDc2OTAsNzY5MSw3NjkyLDc2OTMsNzcxNiw3NzE3LDc3MTksNzcyMCw3NzIxLDc3MjIsNzcyMyw3NzMwLDc3NDQsNzc0NSw3NzQ2LDc3NDgsNzc0OSw3NzUwLDc3NTQsNzc2MCw3NzczLDc3NzUsNzc3Niw4MDU0LDgwNzcsODA4OSw4MDkwLDgwOTEsODA5Miw4MDkzLDgwOTQsODA5NSw4MDk2LDgwOTcsODExNSw4MTE5LDgxMjIsODE0MCw4MTQxLDgxNDIsODE0Myw4MTQ0LDgxNDUsODE0Niw4MTQ3LDgxNDgsODE0OSw4MTcxLDgxNzksODE4MCw4MTgxLDgxODIsODE4Myw4MTg4LDgxOTIsODIwNiw4MjA3LDgyMDgsODIwOSw4MjEwLDgyMTIsODIxNCw4MjE1LDgyMTYsODIxNyw4MjE5LDgyMjIsODIyMyw4MjI0LDgyMjUsODIyNiw4MjI3LDgyMjgsODIyOSw4MjMwLDgyMzIsODIzMyw4MjM0LDgyMzUsODIzNyw4MjM4LDgyMzksODI0MCw4MjQxLDgyNjEsODI2Miw4NDE4LDg4NTAsODg2NCw5MDE1LDkwMTYsOTAxNyw5MDE4LDkwMTksOTAyNSw5MDI4LDkwMzQsOTAzOCw5MDQzLDkwNDQsOTA0Niw5MDU3LDkwNjQsOTA3MCw5MDg3LDkwODgsOTA4OSw5MDkwLDkxODksOTE5MCw5MTkxLDkyNDcsOTI1MCw5MjYwLDkyNzgsOTI4MSw5MjkyLDkyOTMsOTI5NCw5Mjk1LDkyOTYsOTI5Nyw5Mjk4LDkyOTksOTMwMCw5MzAxLDkzMjEsOTMyMiw5MzIzLDkzMjQsOTMyNSw5MzI2LDkzMjcsOTMyOCw5MzI5LDkzMzAsOTMzMSw5MzMyLDkzMzMsOTMzNCw5MzM1LDkzMzYsOTMzNyw5MzM4LDkzMzksOTM0MCw5MzQxLDkzNDIsOTM0NCw5MzQ1LDkzNDYsOTM0Nyw5MzQ5LDkzNTAsOTM1MSw5MzUyLDkzNTMsOTM1NCw5Mzc1LDkzNzYsOTM3Nyw5NDE2LDk0MTcsOTQzOSw5NDQyLDk0NDMsOTQ2NCw5NDY1LDk0NjYsOTQ2Nyw5NDY4LDk0NjksOTQ3MCw5NDcxLDk0NzIsOTQ3Myw5NDkxLDk1MjIsOTUyMyw5NTI0LDk1NDYsOTU0Nyw5NTQ4LDk1NDksOTU3NCw5NTc4LDk1NzksOTc0MCw5NzQxLDk3NDIsOTc0Myw5NzQ0LDk3NDYsOTc0Nyw5NzQ4LDk4MzUsOTg1Niw5ODU3LDk5OTcsOTk5OCw5OTk5LDEwMDM5LDEwMjQzLDEwMzQ5LDEwMzUyLDEwMzkxLDEwNDExLDEwNDE3LDEwOTU3LDEwOTc3LDExMDQzLDExMzkyLDExNzQ2LDExNzcxLDExNzkyLDEyMzI5LDEyMzMxLDEyMzMyLDEyNTYyLDEyNTYzLDEyNTY0LDEyOTIxLDEyOTIyLDEyOTIzLDEzMjc5LDEzMjgwLDEzMjgxLDEzMjg5LDEzMzAyLDEzNDI0LDEzNDMxLDEzNjQ3LDEzODY4LDEzODcyLDE0MDA3LDE0MDQ2LDE0MDUxLDE0MzkxLDE0NDAzLDE0NDA0LDE0NDM2LDE0NDQ1LDE0NDQ2LDE0NDY1LDE0NTg4LDE1MDYyLDE1MDYzLDE2NTgwLDE2NjA5LDE3NjkzLDE4ODM4LDE5MjUzLDIyNDU1LDIyNTUyLDI1MDc2LDI2MDg5LDI2MDkwLDI2MDkxLDI2MDkyLDI2MDkzLDI2MDk0LDI2MTM1LDI2MTM3LDI2MjM1LDI2MjQzLDI2MjQ1LDI4MjgyLDI4NDkwLDI5MDYzLDI5MTQyLDI5NzM0LDI5NzUwLDMwMDI2LDMwNjQ2LDMxNjgxLDMyNzEwLDMzMjEwLDMzMjExLDMzMzc1LDM0NjI2LDM2MzQzLDM2MzcwLDM4MjY3LDQyMTMwLDQyNTEzLDQzMDQzLDQ3ODEyLDQ3ODM4LDQ3ODM5LDQ3OTg0LDUwNzQ1LDUzMzg4LDU3Mzg3LDY3OTY2LDY4MzM1LDY4NTEyLDY4NzEwLDY4NzExLDY5NTAyXX0sXCJrZXlcIjpcIlJlYWRTaGFyZWRDYXJ0UGVybWlzc2lvblBsdWdpblwiLFwiaXNfaW5mcmFzdHJ1Y3R1cmFsXCI6bnVsbH0se1wiaWRfcGVybWlzc2lvblwiOjIsXCJjb25maWd1cmF0aW9uX3NpZ25hdHVyZVwiOlwiW11cIixcImlkX2NvbXBhbnlfcm9sZVwiOm51bGwsXCJjb25maWd1cmF0aW9uXCI6e1wiaWRfcXVvdGVfY29sbGVjdGlvblwiOls0OSw1MCw1MSw1Miw1Myw2MDY5LDYyNzAsNjUwOCw2NTQ0LDY2NjQsNjgzMiw2ODMzLDY4MzUsNjg2Myw3NjQ3LDc2NDksNzY1MCw3NjUxLDc2NTIsNzY1Myw3NjU0LDc2NTUsNzY1Niw3NjU3LDc2NTgsNzY1OSw3NjYwLDc2NjEsNzY2Miw3NjYzLDc2ODMsNzY4NCw3Njg1LDc2ODgsNzY4OSw3NjkwLDc2OTEsNzY5Miw3NjkzLDc3MTYsNzcxNyw3NzE5LDc3MjAsNzcyMSw3NzIyLDc3MjMsNzczMCw3NzQ0LDc3NDUsNzc0Niw3NzQ4LDc3NDksNzc1MCw3NzU0LDc3NjAsNzc3Myw3Nzc1LDc3NzYsODA1NCw4MDc3LDgwODksODA5MCw4MDkxLDgwOTIsODA5Myw4MDk0LDgwOTUsODA5Niw4MDk3LDgxMTUsODExOSw4MTIyLDgxNDAsODE0MSw4MTQyLDgxNDMsODE0NCw4MTQ1LDgxNDYsODE0Nyw4MTQ4LDgxNDksODE3MSw4MTc5LDgxODAsODE4MSw4MTgyLDgxODMsODE4OCw4MTkyLDgyMDYsODIwNyw4MjA4LDgyMDksODIxMCw4MjEyLDgyMTQsODIxNSw4MjE2LDgyMTcsODIxOSw4MjIyLDgyMjMsODIyNCw4MjI1LDgyMjYsODIyNyw4MjI4LDgyMjksODIzMCw4MjMyLDgyMzMsODIzNCw4MjM1LDgyMzcsODIzOCw4MjM5LDgyNDAsODI0MSw4MjYxLDgyNjIsODQxOCw4ODUwLDg4NjQsOTAxNSw5MDE2LDkwMTcsOTAxOCw5MDE5LDkwMjUsOTAyOCw5MDM0LDkwMzgsOTA0Myw5MDQ0LDkwNDYsOTA1Nyw5MDY0LDkwNzAsOTA4Nyw5MDg4LDkwODksOTA5MCw5MTg5LDkxOTAsOTE5MSw5MjQ3LDkyNTAsOTI2MCw5Mjc4LDkyODEsOTI5Miw5MjkzLDkyOTQsOTI5NSw5Mjk2LDkyOTcsOTI5OCw5Mjk5LDkzMDAsOTMwMSw5MzIxLDkzMjIsOTMyMyw5MzI0LDkzMjUsOTMyNiw5MzI3LDkzMjgsOTMyOSw5MzMwLDkzMzEsOTMzMiw5MzMzLDkzMzQsOTMzNSw5MzM2LDkzMzcsOTMzOCw5MzM5LDkzNDAsOTM0MSw5MzQyLDkzNDQsOTM0NSw5MzQ2LDkzNDcsOTM0OSw5MzUwLDkzNTEsOTM1Miw5MzUzLDkzNTQsOTM3NSw5Mzc2LDkzNzcsOTQxNiw5NDE3LDk0MzksOTQ0Miw5NDQzLDk0NjQsOTQ2NSw5NDY2LDk0NjcsOTQ2OCw5NDY5LDk0NzAsOTQ3MSw5NDcyLDk0NzMsOTQ5MSw5NTIyLDk1MjMsOTUyNCw5NTQ2LDk1NDcsOTU0OCw5NTQ5LDk1NzQsOTU3OCw5NTc5LDk3NDAsOTc0MSw5NzQyLDk3NDMsOTc0NCw5NzQ2LDk3NDcsOTc0OCw5ODM1LDk4NTYsOTg1Nyw5OTk3LDk5OTgsOTk5OSwxMDAzOSwxMDI0MywxMDM0OSwxMDM1MiwxMDM5MSwxMDQxMSwxMDQxNywxMDk1NywxMDk3NywxMTA0MywxMTM5MiwxMTc0NiwxMTc3MSwxMTc5MiwxMjMyOSwxMjMzMSwxMjMzMiwxMjU2MiwxMjU2MywxMjU2NCwxMjkyMSwxMjkyMiwxMjkyMywxMzI3OSwxMzI4MCwxMzI4MSwxMzI4OSwxMzMwMiwxMzQyNCwxMzQzMSwxMzY0NywxMzg2OCwxMzg3MiwxNDAwNywxNDA0NiwxNDA1MSwxNDM5MSwxNDQwMywxNDQwNCwxNDQzNiwxNDQ0NSwxNDQ0NiwxNDQ2NSwxNDU4OCwxNTA2MiwxNTA2MywxNjU4MCwxNjYwOSwxNzY5MywxODgzOCwxOTI1MywyMjQ1NSwyMjU1MiwyNTA3NiwyNjA4OSwyNjA5MCwyNjA5MSwyNjA5MiwyNjA5MywyNjA5NCwyNjEzNSwyNjEzNywyNjIzNSwyNjI0MywyNjI0NSwyODI4MiwyODQ5MCwyOTA2MywyOTE0MiwyOTczNCwyOTc1MCwzMDAyNiwzMDY0NiwzMTY4MSwzMjcxMCwzMzIxMCwzMzIxMSwzMzM3NSwzNDYyNiwzNjM0MywzNjM3MCwzODI2Nyw0MjEzMCw0MjUxMyw0MzA0Myw0NzgxMiw0NzgzOCw0NzgzOSw0Nzk4NCw1MDc0NSw1MzM4OCw1NzM4Nyw2Nzk2Niw2ODMzNSw2ODUxMiw2ODcxMCw2ODcxMSw2OTUwMl19LFwia2V5XCI6XCJXcml0ZVNoYXJlZENhcnRQZXJtaXNzaW9uUGx1Z2luXCIsXCJpc19pbmZyYXN0cnVjdHVyYWxcIjpudWxsfSx7XCJpZF9wZXJtaXNzaW9uXCI6bnVsbCxcImNvbmZpZ3VyYXRpb25fc2lnbmF0dXJlXCI6W10sXCJpZF9jb21wYW55X3JvbGVcIjpudWxsLFwiY29uZmlndXJhdGlvblwiOntcImlkX3Nob3BwaW5nX2xpc3RfY29sbGVjdGlvblwiOntcIjBcIjoxLFwiMlwiOjIsXCIzXCI6M319LFwia2V5XCI6XCJSZWFkU2hvcHBpbmdMaXN0UGVybWlzc2lvblBsdWdpblwiLFwiaXNfaW5mcmFzdHJ1Y3R1cmFsXCI6bnVsbH0se1wiaWRfcGVybWlzc2lvblwiOm51bGwsXCJjb25maWd1cmF0aW9uX3NpZ25hdHVyZVwiOltdLFwiaWRfY29tcGFueV9yb2xlXCI6bnVsbCxcImNvbmZpZ3VyYXRpb25cIjp7XCJpZF9zaG9wcGluZ19saXN0X2NvbGxlY3Rpb25cIjp7XCIwXCI6MSxcIjJcIjoyLFwiM1wiOjN9fSxcImtleVwiOlwiV3JpdGVTaG9wcGluZ0xpc3RQZXJtaXNzaW9uUGx1Z2luXCIsXCJpc19pbmZyYXN0cnVjdHVyYWxcIjpudWxsfV19fSIsInNjb3BlcyI6WyJjdXN0b21lciJdfQ.KJCPP47M2H-SBBIsCIPX2Vh8EUoIhC7J0zS1nq6PRYrjjLYIeuv5WiisMgLLP08A9yW9BXKUJRXXTFDgiAmutLlDRG2x6CfmdD-S3kWjEMoMhDWkxznsANFvO54OFucEDSJ36U6v2xmCtEuoAci2Eu1yXjFebviwKmr5-t6nojlzUN7r736xkcv9438ZvqI7-TS3Ida69NxgngygkxfWaE5vCMbeNWYZWctIHAklqyDLYWiRTNyuINrmfGeRaUkh1tgcsB_Vlb75F-i_WWNki-WeF06GNTfzlzvmuAqVESWufhY9w-h_gRyJ4PXMc2VttuucuwFC5gmXcs9Jx9nrkA";
  const [count, setCount] = useState<number>(1);
  const [color, setColor] = useState<string>('');
  const [itemSize, setItemSize] = useState<string>('');

  const [variationData, setVariationData] = useState<any>();
  const [variationIdData, setVariationIdData] = useState<any>();
  const [productData, setProductData] = useState<any>();
  const [price, setPrice] = useState(null);
  const [priceSymbole, setPriceSymbole] = useState(null);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

        setProductData(product?.product);
        setVariationIdData(
          product?.product?.attributeMap
            ?.product_concrete_ids,
        );
  }, [product]);

  useEffect(() => {
    if(productData){
      const getPrice = async() => {
        const resp = await fetch(
          `https://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/${productData?.sku}/abstract-product-prices`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        );
        const response = await resp.json();
        console.log(response,"RESPPrice_________");
        if (resp.status == 200) {
          setPrice(response?.data[0]?.attributes?.price)
          setPriceSymbole(response?.data[0]?.attributes?.prices[0]?.currency?.symbol)
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
      getPrice();
    }
  }, [productData]);
  

  console.log(product?.product,"variationData")

useEffect(() => {
  var tempVar:any = [];
  const handlerfunction = async () => {
    if (productData) {
  console.log(productData,"productData")

      Object.keys(
        productData?.attributeMap?.attribute_variant_map,
      )?.map((item, index) => {
        tempVar.push({
          id: index,
          title: Object.keys(
            productData?.attributeMap?.attribute_variant_map[
              item
            ],
          ).map(item1 => {
            return productData?.attributeMap
              ?.attribute_variant_map[item][item1];
          }),
        });
      });
      setVariationData(tempVar);
    }
  };
  handlerfunction();
}, [productData]);
const AddtoCartHandler = async () => {
  if (variationData && variationData[1]) {
    if (selectedId) {
      var productSkuId = '';
      await variationIdData?.map((item:any, index:Number) => {
        if (index == selectedId) {
          productSkuId = item;
        }
      });
    } else {
      return alert('select Varint');
    }
  } else {
    productSkuId = variationIdData[0];
  }
  if (productSkuId) {
    const productCart = {
      data: {
        type: 'items',
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
    const resp = await fetch(
      `https://glue.de.faas-suite-prod.cloud.spryker.toys/carts/${cartId}/items`,
      {
        method: 'POST',
        body:JSON.stringify(productCart),
        headers: {
          Accept: 'application/json',
          Authorization : `Bearer ${token}`
        },
      },
    );
    const response = await resp.json();
    console.log(response,"RESP_________");
    if (response) {
      setIsLoading(false);
      alert('added to cart');
    } else {
      console.log('response:---------- ', response);
      setIsLoading(false);
    }
  }
};

  const onColorSet = (e: string) => setColor(e);
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => setItemSize(e.target.value);

  const { favProducts } = useSelector((state: RootState) => state.user);
  const isFavourite = some(favProducts, productId => productId === product.id);

  const toggleFav = () => {
    dispatch(toggleFavProduct(
      { 
        id: product.id,
      }
    ))
  }

  const addToCart = () => {
    const productToSave: ProductStoreType = { 
      id: product.id,
      name: product.name,
      thumb: product.images ? product.images[0] : '',
      price: product.currentPrice,
      count: count,
      color: color,
      size: itemSize
    }

    const productStore = {
      count,
      product: productToSave
    }

    dispatch(addProduct(productStore));
  }

  return (
    <section className="product-content">
      <div className="product-content__intro">
        <h5 className="product__id">Product ID:<br></br>{productData?.sku}</h5>
        <span className="product-on-sale">Sale</span>
        <h2 className="product__name">{productData?.name}</h2>

        <div className="product__prices">
          <h4>{priceSymbole} {price}</h4>
          {product.discount &&
            <span>${ product.price }</span>
          }
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
        <div className="product-filter-item">
          <h5>Variants : </h5>
          <div className="checkbox-color-wrapper">
            <div className="select-wrapper">
              <select onChange={(e)=> setSelectedId(e.target.value)}>
                <option>Choose any product</option>
                {variationData?.map((item:any) => (
                  <option value={item.id}>{item.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="product-filter-item">
          <h5>Quantity:</h5>
          <div className="quantity-buttons">
            <div className="quantity-button">
              <button type="button" onClick={() => setCount(count - 1)} className="quantity-button__btn">
                -
              </button>
              <span>{count}</span>
              <button type="button" onClick={() => setCount(count + 1)} className="quantity-button__btn">
                +
              </button>
            </div>
            
            <button type="submit" onClick={() => AddtoCartHandler()} className="btn btn--rounded btn--yellow">Add to cart</button>
            <button type="button" onClick={toggleFav} className={`btn-heart ${isFavourite ? 'btn-heart--active' : ''}`}><i className="icon-heart"></i></button>
          </div>
        </div>
      </div>
    </section>
  );
};
  
export default Content;
    