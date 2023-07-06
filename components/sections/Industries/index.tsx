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
          description: element.description,
          isLoggedIn: element.isLoggedIn,
          title: element.title
        })
      }
    });
  });
  console.log("industries-updatedArr", updatedArr)
  return (
    <div style={{ backgroundColor: "#333", padding: "50px", paddingInline: "120px", color: "white" }}>
      <div style={{ display: "flex", flexWrap: "wrap", }}>
        {
          updatedArr.map((item: any) => {
            return (
              <div style={{ width: "50%", padding: "25px" }}>
                <div style={{
                  height: "350px", borderRadius: "10px",
                  overflow: "hidden",
                  opacity: 1,
                  zIndex: 1

                }}>
                  <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "25px" }} />
                  <div style={{
                    marginTop: "-90px",
                    backgroundColor: "#ffffff",
                    position:"relative",
                    padding:"25px",
                    width:"100%"
                  }}>
                    <h3 style={{ textAlign: "center", color: "#333" }}>{item.title}</h3>
                    <p style={{textAlign:"center", marginBottom: "0.5rem", color: "#333", fontSize: "16px", lineHeight: "1.5" }}>{item.description}</p>
                  </div>
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