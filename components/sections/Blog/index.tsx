import React from 'react'
function index(data: any) {
  const newData = Array.from(Object.values(data));
  const imageData: any = newData.pop();
  const updatedArr: any[] = []
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
    <div style={{
      backgroundColor: "#ece6d8",
      paddingInline: "120px",
      padding: "50px"
    }}>
      {updatedArr.map((val: any) => {
        return (
          <div style={{ boxShadow: "0 0 0 0 #0000, 0 0 0 0 #0000, 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)", borderRadius: "10px", display: "flex", justifyContent: "space-between", margin: "40px" }}>
            <div style={{ backgroundColor: "#ffffff", width: "100%", borderBottomLeftRadius: "10px", borderTopLeftRadius: "10px", padding: "1.5rem" }}>
              <p style={{
                lineHeight: "2.25rem",
                fontWeight: "700",
                fontSize: "1.5rem",
                marginBottom: "0.5rem",
                color: "black"
              }}>{val.title}</p>
              <p style={{ marginBottom: "0.5rem", color: "#333333", fontSize: "16px", lineHeight: "1.5" }}>{val.description}</p>
              <div style={{ margin: "1rem" }}>
                <button style={{
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  fontWeight: "700",
                  color: "#ffffff",
                  backgroundColor: "#cf122e",
                  borderRadius: "25px"
                }}>{val.btntext}</button>
              </div>
            </div>
            <div style={{ height: "400px", width: "100%", borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>
              <img src={val.image} style={{ width: "100%", objectFit: "cover", height: "100%", borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }} />
            </div>
          </div>
        )
      })}


    </div>
  )
}

export default index