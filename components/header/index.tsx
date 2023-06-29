import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useOnClickOutside from 'use-onclickoutside';
import Logo from '../../assets/icons/logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RootState } from 'store';
import API_URL from 'config';

type HeaderType = {
  isErrorPage?: Boolean;
}

const Header = ({ isErrorPage }: HeaderType) => {
  const router = useRouter();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const arrayPaths = ['/'];

  const [onTop, setOnTop] = useState((!arrayPaths.includes(router.pathname) || isErrorPage) ? false : true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState()
  const [category, setCategory] = useState([])
  const [authStatus, setAuthStatus] = useState("false")
  const [authToken, setAuthToken] = useState("");
  const [searchResult, setSearchResult] = useState<any[]>([])
  useEffect(() => {
    setAuthStatus(localStorage.getItem("status"));
    setAuthToken(localStorage.getItem("token"))
  }, [])
  // useEffect(() => {
  //   if (authToken) {
  //     setAuthStatus("true")
  //   } else {
  //     setAuthStatus("false")
  //   }
  // }, [authToken])

  const navRef = useRef(null);
  const searchRef = useRef(null);

  const headerClass = () => {
    if (window.pageYOffset === 0) {
      setOnTop(true);
    } else {
      setOnTop(false);
    }
  }

  useEffect(() => {
    if (!arrayPaths.includes(router.pathname) || isErrorPage) {
      return;
    }

    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  }

  const closeSearch = () => {
    setSearchOpen(false);
  }

  // on click outside
  useOnClickOutside(navRef, closeMenu);
  useOnClickOutside(searchRef, closeSearch);


  const getCategory = async () => {
    const resp = await fetch(`${API_URL}/category-trees`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
    const result = await resp.json()
    setCategory(result?.data[0]?.attributes?.categoryNodesStorage)
  }
  useEffect(() => {
    getCategory();
  }, [])

  const checkTokenExpiry = async () => {
    if (authToken) {
      const data =
      {
        "data": {
          "type": "access-tokens",
          "attributes": {
            "username": "sonia@spryker.com",
            "password": "change123"
          }
        }
      }
      try {
        const resp = await fetch(
          `${API_URL}/access-tokens`,
          {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(data),
          },
        );
        const result = await resp.json();
        if (result?.data?.attributes?.accessToken) {
          localStorage.setItem("status", "true")
          localStorage.setItem("token", result?.data?.attributes?.accessToken)
        } else {
          localStorage.setItem("status", "false")
        }
      } catch (err) {
        console.log("errr", err)
        localStorage.setItem("status", "false")
        router.push('/login')
      }
    } else {
      localStorage.setItem("status", "false")
    }

  }
  useEffect(() => {
    checkTokenExpiry();
  }, [authToken])
  console.log("first, authStatus", authStatus)

  const getSearchResult = async (text: any) => {
    const resp = await fetch(`${API_URL}/catalog-search-suggestions?q=${text}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
    const result = await resp.json();
    console.log("search---- result", result)
    setSearchResult(result?.data[0]?.attributes?.abstractProducts)
  }

  useEffect(() => {
    getSearchResult(searchText)
  }, [searchText])
  console.log("searchResult----", searchResult)
  return (
    <header className={`site-header ${!onTop ? 'site-header--fixed' : ''}`}>
      <div className="container">
        <Link href="/">
          <a><h1 className="site-logo">
            {/* <Logo /> */}
            <img src="https://www.ricoh.com/-/Media/Ricoh/Common/cmn_g_header_footer/img/logo/logo.svg" />
          </h1></a>
        </Link>
        <nav ref={navRef} className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}>
          {category.map((item: any) => {
            return (
              <Link href={`/productList/${item?.url?.split('/')[2]}?nodeId=${item.nodeId}`}>
                <a>{item.name}</a>
              </Link>
            )
          })}
          <Link href={`/bundle`}>
                <a>Bundle Product</a>
              </Link>
          <button className="site-nav__btn"><p>Account</p></button>
        </nav>

        <div className="site-header__actions">
          <button ref={searchRef} className={`search-form-wrapper ${searchOpen ? 'search-form--active' : ''}`}>
            <form className={`search-form`}>
              <i className="icon-cancel" onClick={() => setSearchOpen(!searchOpen)}></i>
              <input type="text" name="search" onChange={(e: any) => { setSearchText(e.target.value) }} placeholder="Enter the product you are looking for" />
            </form>
            {searchText ? <Link href={`/search/${searchText}`}>
              <i onClick={() => setSearchOpen(!searchOpen)} className="icon-search"></i>
            </Link> :
              <i onClick={() => setSearchOpen(!searchOpen)} className="icon-search"></i>
            }

          </button>
          <Link href="/cart">
            <button className="btn-cart">
              <i className="icon-cart"></i>
              {cartItems.length > 0 &&
                <span className="btn-cart__count">{cartItems.length}</span>
              }
            </button>
          </Link>
          <Link href={authStatus === "true" ? "/profile" : "/login"}>
            <button className="site-header__btn-avatar"><i className="icon-avatar"></i></button>
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="site-header__btn-menu">
            <i className="btn-hamburger"><span></span></i>
          </button>
        </div>

      </div>
      {searchResult.length >
        0
        ?
        <div style={{ right: "0", marginRight: "170px", borderRadius: "25px", position: "absolute", width: "300px", height: "350px", overflowY: "scroll", backgroundColor: "white" }}>
          {
            searchResult.map((item: any) => {
              return (
                <Link href={`/product/${item.abstractName}?skuId=${item.abstractSku}`}>
                  <div style={{ display: "flex", padding: "5px", cursor: "pointer" }}>
                    <div style={{ paddingLeft: "10px" }}>
                      <img src={item.images[0].externalUrlLarge} style={{ width: "50px", height: "50px", objectFit: "contain", border: "1px solid #7f7f7f", borderRadius: "100%" }} />
                    </div>
                    <div style={{ paddingTop: "8px", paddingLeft: "5px" }}>
                      <p style={{ color: "black" }}>{item.abstractName}</p>
                      <p style={{ color: "black", fontWeight: "bold" }}>{item.price}</p>

                    </div>
                  </div>
                </Link>
              )
            })
          }
        </div>
        :
        null
      }
    </header>
  )
};


export default Header;
