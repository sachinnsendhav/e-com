import { fetchCategoryTree } from '../Apis/publicApis/commonApis';

export async function fetchCategoryTreeMethod() {
  const data = await fetchCategoryTree();
  //console.log(data,"data");
};