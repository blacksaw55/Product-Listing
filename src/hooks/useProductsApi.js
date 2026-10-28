import { categoriesUrl, productsUrl, productUrl } from '../api/products'
import { useFetch } from './useFetch'

export function useCategories() {
  return useFetch(categoriesUrl())
}

/** All products, or all products of one category when `category` is set. */
export function useProducts(category) {
  return useFetch(productsUrl(category))
}

export function useProduct(id) {
  return useFetch(productUrl(id))
}
