export function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    // role="alert" makes screen readers announce the error as soon as it appears.
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-800">{title}</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Try again
        </button>
      )}
    </div>
  )
}
