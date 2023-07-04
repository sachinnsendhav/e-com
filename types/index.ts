export type VotesType = {
  count: number;
  value: number;
}

export type PunctuationType = {
  countOpinions: number;
  punctuation: number;
  votes: VotesType[]
}

export type ReviewType = {
  name: string;
  avatar: string;
  description: string;
  punctuation: number;
}

export type ProductType = {
  id: string;
  name: string;
  thumb: string;
  price: string;
  count: number;
  color: string;
  size: string;
  images: string[];
  discount?: string;
  currentPrice: number;
  punctuation: PunctuationType;
  reviews: ReviewType[];
}

export type ProductTypeList = {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string;
  concreteId: string;
  wishlistProdId: any;
}

export type ProductStoreType = {
  id: string;
  pliId:string;
  name: string;
  thumb: string;
  avalibility:any;
  price: number;
  count: number;
  color: string;
  size: string;
  setProductCount:any
  removeProductFromCart:any
}

export type GtagEventType = {
  action: string;
  category: string; 
  label: string;
  value: string
}