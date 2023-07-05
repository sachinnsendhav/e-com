import React from 'react'

function index(data: any) {
  const newData = Array.from(Object.values(data));
  // const lastIndex = newData?.length - 1;
  // const imageData = newData[lastIndex];
  // console.log("imageData",imageData);
  const imageData: any = newData.pop();
  console.log("imageData", imageData);
  console.log("updatedData", newData);
  const updatedArr: any[] = []
  newData.forEach((element: any) => {
    imageData.forEach((img: any) => {
      if (element.image[0]?.sys?.id === img?.sys?.id) {
        updatedArr.push({
          image:`https:${img.fields.file.url}`,
          btnlink: element.btnlink,
          btntext: element.btntext,
          description: element.description,
          isLoggedIn: element.isLoggedIn,
          title: element.title
        })
      }
    });
  });
  console.log("updatedArr", updatedArr)
  return (
    <div>hi</div>
  )
}

export default index