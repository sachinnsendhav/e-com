import React from 'react'

function index(data:any) {
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
    <div style={{backgroundColor:"#333", padding:"50px", paddingInline:"120px",color:"white"}}>
      hello
    </div>
  )
}

export default index