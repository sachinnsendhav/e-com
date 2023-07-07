import React from 'react'

function index(data: any) {
  const newData = Array.from(Object.values(data));
  const imageData: any = newData.pop();
  const updatedArr: any[] = []
  console.log("newData-infotile--", newData)
  newData.forEach((element: any) => {
    imageData.forEach((img: any) => {
      if (element.image[0]?.sys?.id === img?.sys?.id) {
        updatedArr.push({
          image: `https:${img.fields.file.url}`,
          btnlink: element.btnlink,
          btntext: element.btntext,
          description: element.description,
          isLoggedIn: element.isLoggedIn,
          title: element.title
        })
      }
    });
  });
  return (
    <div style={{ backgroundColor: "#80001d", padding: "50px", paddingInline: "120px" }}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {
          updatedArr.map((item: any) => {
            return (
              <div style={{ width: "33.33%" }}>
                <div style={{ padding: "20px" }}>
                  <div style={{ paddingBottom: "50px" }}>
                    <img src={item.image} style={{ width: "100%", height: "100%", borderRadius: "25px" }} />
                    <p style={{
                      marginTop: "-50px",
                      padding: "5px",
                      paddingInline: "10px",
                      background: "#ec5028",
                      position: "absolute",
                      color: "white",
                      borderTopRightRadius: "5px",
                      borderBottomRightRadius: "5px",
                      lineHeight: "1.25rem",
                      textTransform: "uppercase"
                    }}>{item.btntext}</p>
                  </div>
                  <h3 style={{
                    lineHeight: "2.25rem",
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    color: "white"
                  }}>{item.description}</h3>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default index