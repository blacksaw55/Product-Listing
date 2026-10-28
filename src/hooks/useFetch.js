import { useCallback, useEffect, useState } from 'react'
import { ApiError, fetchJson } from '../api/products'

/**
 * Responses we already have, keyed by URL. Coming back to the listing page
 * (or re-selecting a category) shows the data instantly instead of a spinner.
 */
const cache = new Map()

/** Test helper: start every test with an empty cache. */
export function clearFetchCache() {
  cache.clear()
}

function toErrorState(error) {
  if (error instanceof ApiError) {
    const notFound = error.status === 404
    return {
      status: 'error',
      notFound,
      message: notFound
        ? 'We could not find what you were looking for.'
        : 'The server returned an error. Please try again.',
    }
  }
  return {
    status: 'error',
    notFound: false,
    message: 'Could not reach the server. Check your connection and try again.',
  }
}

/**
 * Loads JSON from `url` and tracks loading / error / success.
 * Returns exactly one of these shapes, always with a `retry` function:
 *   { status: "loading" }
 *   { status: "error", message, notFound }
 *   { status: "success", data }
 * - When `url` changes, the old request is cancelled (AbortController), so a slow
 *   earlier response can never overwrite a newer one.
 * - `retry()` throws away the cached copy and fetches again.
 */
export function useFetch(url) {
  const [attempt, setAttempt] = useState(0)
  // The finished result, remembered together with the request it belongs to.
  const [settled, setSettled] = useState(null)

  useEffect(() => {
    if (cache.has(url)) return

    const controller = new AbortController()
    fetchJson(url, controller.signal)
      .then((data) => {
        cache.set(url, data)
        setSettled({ url, attempt, state: { status: 'success', data } })
      })
      .catch((error) => {
        if (controller.signal.aborted) return // we cancelled it ourselves; not a real error
        setSettled({ url, attempt, state: toErrorState(error) })
      })

    return () => controller.abort()
  }, [url, attempt])

  const retry = useCallback(() => {
    cache.delete(url)
    setAttempt((n) => n + 1)
  }, [url])

  const cached = cache.get(url)
  if (cached !== undefined) return { status: 'success', data: cached, retry }
  if (settled && settled.url === url && settled.attempt === attempt) return { ...settled.state, retry }
  return { status: 'loading', retry }
}
