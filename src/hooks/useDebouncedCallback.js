import { useEffect, useMemo, useRef } from 'react'

/**
 * Returns a function that waits until calls stop for `delay` ms, then runs `callback`
 * with the latest arguments. Typing "1", "15", "150" in a price box
 * therefore updates the list once instead of three times.
 */
export function useDebouncedCallback(callback, delay) {
  const callbackRef = useRef(callback)
  const timerRef = useRef(undefined)

  // Always call the newest callback, without restarting the timer.
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cancel a pending call when the component unmounts.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  return useMemo(() => {
    const debounced = (...args) => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay)
    }
    debounced.cancel = () => clearTimeout(timerRef.current)
    return debounced
  }, [delay])
}
