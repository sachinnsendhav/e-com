import { fetchCategoryTree, fetchCatalogSearchSuggestions } from '../Apis/publicApis/commonApis';

export async function fetchCategoryTreeMethod() {
  const tempdata = await fetchCategoryTree();
  return tempdata?.data[0]?.attributes?.categoryNodesStorage;
};

export async function fetchCatalogSearchSuggestionsMethod(searchQuery:any) {
    var tempArr:any=[];
    const result = await fetchCatalogSearchSuggestions(searchQuery);
    console.log(result,"setSearchResults")
    await result?.data[0]?.attributes?.abstractProducts.forEach(async(element: any) => {
        await result?.included.forEach((item: any) => {
          if (element.abstractSku == item.id) {
             const tempObj =  {
                abstractName: element.abstractName,
                abstractSku: element.abstractSku,
                price: element.price,
                image: element.images[0].externalUrlLarge,
                concreteId: item.attributes.attributeMap.product_concrete_ids[0],
              }
              tempArr.push(tempObj);
          }
        });
      });
    return tempArr
};