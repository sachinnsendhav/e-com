import Logo from '../../assets/icons/logo';

const Footer = () => {
  return (
    <>
      {/* <footer className="site-footer">
        <div className="container">
          <div className="site-footer__top">
            <div className="site-footer__description">
              <h6><Logo /> <span>E</span>-Shop</h6>
              <p>House My Brand designs clothing for the young, the old & everyone in between – but most
                importantly, for the fashionable</p>
              <ul className="site-footer__social-networks">
                <li><a href="#"><i className="icon-facebook"></i></a></li>
                <li><a href="#"><i className="icon-twitter"></i></a></li>
                <li><a href="#"><i className="icon-linkedin"></i></a></li>
                <li><a href="#"><i className="icon-instagram"></i></a></li>
                <li><a href="#"><i className="icon-youtube-play"></i></a></li>
              </ul>
            </div>

            <div className="site-footer__links">
              <ul>
                <li>Shopping online</li>
                <li><a href="#">Order Status</a></li>
                <li><a href="#">Shipping and Delivery</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Payment options</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
              <ul>
                <li>Information</li>
                <li><a href="#">Gift Cards</a></li>
                <li><a href="#">Find a store</a></li>
                <li><a href="#">Newsletter</a></li>
                <li><a href="#">Bacome a member</a></li>
                <li><a href="#">Site feedback</a></li>
              </ul>
              <ul>
                <li>Contact</li>
                <li><a href="#">store@uikit.com</a></li>
                <li><a href="#">Hotline: +1 131 138 138</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="container">
            <p>DESIGN BY ICEO.CO - © 2019. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer> */}
      <div style={{
        borderTop: "2px solid #cf122e",
        padding: "2rem",
        background: "#333333",
        marginTop:"1rem",
        width:"100%"
      }}>
        <div style={{ width: "80%",margin: "auto" }}>
          <div style={{ display: "flex", margin:"auto", textAlign:"center",fontWeight: "500" }}>
            <ul style={{display:"flex", fontSize:"14px"}}>
              <li style={{padding:"5px", color:"white"}}>Contact</li>
              <li style={{padding:"5px", color:"white"}}>Privacy</li>
              <li style={{padding:"5px", color:"white"}}>Accessibility</li>
              <li style={{padding:"5px", color:"white"}}>Sitemap</li>
              <li style={{padding:"5px", color:"white"}}>Terms of Use and Condition</li>
            </ul>
            <ul style={{display:"flex", fontSize:"14px", textAlign:"center"}}>
              <li style={{padding:"5px", color:"white"}}>Careers</li>
              <li style={{padding:"5px", color:"white"}}>Locations</li>
              <li style={{padding:"5px", color:"white"}}>Access ricoh.com (global)</li>
              <li style={{padding:"5px", color:"white"}}>Cookie Settings</li>
            </ul>
          </div>
        </div>
        <div style={{textAlign:"center", padding:"2.5rem"}}>
          <p style={{color:"white", fontSize:"14px", fontWeight: "500"}}>© 2023 Ricoh USA, Inc. All Rights Reserved.</p>
        </div>
      </div>
    </>

  )
};


export default Footer