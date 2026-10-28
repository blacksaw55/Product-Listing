import { Link } from 'react-router'

export function Header() {
  return (
    <header className="bg-slate-800 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Shop<span className="text-amber-400">Lite</span>
        </Link>
        <p className="text-sm text-slate-300">Powered by DummyJSON</p>
      </div>
    </header>
  )
}
