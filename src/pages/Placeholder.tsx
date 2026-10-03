import Alert from 'react-bootstrap/Alert'

// Stand-in for pages that haven't been ported from Vue yet.
export default function Placeholder({ title }: { title: string }) {
  return (
    <>
      <h1>{title}</h1>
      <Alert variant="secondary">
        This page hasn't been ported yet. The Vue version is in <code>legacy/</code>.
      </Alert>
    </>
  )
}
