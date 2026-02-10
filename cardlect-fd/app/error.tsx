'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ padding: '20px', fontFamily: 'system-ui' }}>
        <h1>Something went wrong!</h1>
        <p>An error occurred while rendering this page.</p>
        {error?.message && <p style={{ color: '#666' }}>Error: {error.message}</p>}
        <button onClick={() => reset()} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Try again
        </button>
      </body>
    </html>
  )
}
