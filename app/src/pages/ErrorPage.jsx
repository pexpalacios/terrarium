import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorPage({ notFound = false }) {
	const error = useRouteError()
	const is404 = notFound || (isRouteErrorResponse(error) && error.status === 404)

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
			<h1 className="text-3xl font-bold">
				{is404 ? 'Aquí no hay bichos...' : 'Algo salió mal'}
			</h1>
			<p>
				{is404
					? 'Esta página no existe.'
					: error?.message || 'Error inesperado.'}
			</p>
			<Link to="/" className="underline">
				Volver al repo
			</Link>
		</div>
	)
}