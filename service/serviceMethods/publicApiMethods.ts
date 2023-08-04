import {
  fetchCategoryTree,
  fetchCatalogSearchSuggestions,
  fetchCatalogSearchByCategory,
} from "../Apis/publicApis/commonApis";

import {
  fetchShoppingListItems
} from '../Apis/privateApis/privateApis';

export async function fetchCategoryTreeMethod() {
  const tempdata = await fetchCategoryTree();
  return tempdata?.data[0]?.attributes?.categoryNodesStorage;
}

export async function fetchCatalogSearchSuggestionsMethod(searchQuery: any) {
  var tempArr: any = [];
  const result = await fetchCatalogSearchSuggestions(searchQuery);
  console.log(result, "setSearchResults");
  await result?.data[0]?.attributes?.abstractProducts.forEach(
    async (element: any) => {
      await result?.included.forEach(async(item: any) => {
        if (element.abstractSku == item.id) {
          const tempObj = {
            abstractName: element.abstractName,
            abstractSku: element.abstractSku,
            price: element.price,
            image: element.images[0].externalUrlLarge,
            concreteId: item.attributes.attributeMap.product_concrete_ids[0],
          };
          await tempArr.push(tempObj);
        }
      });
    }
  );
  return tempArr;
}

export async function fetchCatalogSearchByCategoryMethod(
  nodeId: any,
  queryString: any,
  val: any
) {
  const tempdata = await fetchCatalogSearchByCategory(nodeId, queryString, val);
  var tempArr: any = [];
  await tempdata?.data[0]?.attributes?.abstractProducts.forEach(
    async (element: any) => {
      await tempdata?.included.forEach(async(item: any) => {
        if (element.abstractSku === item.id) {
          const tempObj = {
            abstractName: element.abstractName,
            abstractSku: element.abstractSku,
            description: item.attributes.description,
            price: element.price,
            image: element.images[0].externalUrlLarge,
            concreteId: item.attributes.attributeMap.product_concrete_ids[0],
          };
        await tempArr.push(tempObj);
        }
      });
    }
  );
  return {
    sortingOptions:
      tempdata?.data[0]?.attributes?.sort?.sortParamLocalizedNames,
    facetsValue: tempdata?.data[0]?.attributes?.valueFacets,
    productData: tempArr,
  };
}

export async function fetchShoppingListItemsMethod(shoppingListId:any) {
    const tempdata = await fetchShoppingListItems(shoppingListId);
    var tempArr: any = [];
    tempdata?.included?.map((item: any) => {
      tempArr.push({ sku: item?.attributes?.sku, wishId: item?.id });
    });
    return tempArr;
  }
