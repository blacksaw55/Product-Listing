import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { ErrorMessage } from '../components/ErrorMessage'
import { StarRating } from '../components/StarRating'
import { useProduct } from '../hooks/useProductsApi'
import { formatCategory, formatPrice } from '../utils/format'

export function ProductDetailPage() {
  const { id = '' } = useParams()
  const product = useProduct(id)
  const navigate = useNavigate()
  const location = useLocation()

  // Start at the top of the page when a product opens.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  /**
   * Coming from the listing: go one step back in history. The listing URL there still
   * holds the filters and page, so they are restored exactly.
   * Opened directly (shared link, new tab): there is no listing behind us, so go to "/".
   */
  function goBack() {
    if (location.state?.fromListing) navigate(-1)
    else navigate('/')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <button
        type="button"
        onClick={goBack}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span aria-hidden="true">←</span> Back to products
      </button>

      {product.status === 'loading' && <DetailSkeleton />}

      {product.status === 'error' &&
        (product.notFound ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <title>Product not found | ShopLite</title>
            <h1 className="text-xl font-semibold">Product not found</h1>
            <p className="mt-1 text-slate-600">There is no product with id “{id}”.</p>
            <Link to="/" className="mt-4 inline-block font-medium text-blue-700 hover:underline">
              Browse all products
            </Link>
          </div>
        ) : (
          <ErrorMessage title="Could not load this product" message={product.message} onRetry={product.retry} />
        ))}

      {/* `key` gives each product a fresh component, so the selected image resets between products. */}
      {product.status === 'success' && <ProductDetails key={product.data.id} product={product.data} />}
    </div>
  )
}

function ProductDetails({ product }) {
  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const [selectedImage, setSelectedImage] = useState(0)
  const originalPrice = product.discountPercentage > 0 ? product.price / (1 - product.discountPercentage / 100) : null

  return (
    <article className="grid gap-8 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2">
      <title>{`${product.title} | ShopLite`}</title>

      <div>
        <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-50">
          <img
            src={images[selectedImage]}
            alt={product.title}
            width={500}
            height={500}
            className="h-full w-full object-contain"
          />
        </div>
        {images.length > 1 && (
          <ul className="mt-3 flex gap-2 overflow-x-auto" aria-label="Product images">
            {images.map((src, index) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                  aria-pressed={index === selectedImage}
                  className={`size-16 rounded-lg border-2 bg-slate-50 p-1 ${
                    index === selectedImage ? 'border-blue-600' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-contain" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{product.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
          {originalPrice !== null && (
            <>
              <span className="text-slate-400 line-through">
                <span className="sr-only">Original price </span>
                {formatPrice(originalPrice)}
              </span>
              <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-medium text-green-800">
                {Math.round(product.discountPercentage)}% off
              </span>
            </>
          )}
        </div>
        <div className="mt-2">
          <StarRating rating={product.rating} size="md" />
        </div>

        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="font-semibold">Brand</dt>
          <dd className="text-slate-700">{product.brand ?? 'Not specified'}</dd>
          <dt className="font-semibold">Category</dt>
          <dd className="text-slate-700">{formatCategory(product.category)}</dd>
          <dt className="font-semibold">Availability</dt>
          <dd className="text-slate-700">
            {product.availabilityStatus ?? (product.stock > 0 ? 'In Stock' : 'Out of Stock')} ({product.stock} left)
          </dd>
        </dl>

        <section className="mt-6 border-t border-slate-200 pt-5">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-2 leading-relaxed text-slate-700">{product.description}</p>
        </section>

        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-6 border-t border-slate-200 pt-5">
            <h2 className="text-lg font-semibold">Reviews</h2>
            <ul className="mt-3 space-y-4">
              {product.reviews.map((review, index) => (
                <li key={`${review.reviewerName}-${index}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-medium">{review.reviewerName}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-1 text-slate-700">{review.comment}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}

function DetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading product"
      className="grid gap-8 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2"
    >
      <div aria-hidden="true" className="aspect-square animate-pulse rounded-lg bg-slate-200" />
      <div aria-hidden="true" className="animate-pulse space-y-4">
        <div className="h-8 w-3/4 rounded bg-slate-200" />
        <div className="h-8 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="h-24 rounded bg-slate-200" />
      </div>
    </div>
  )
}
