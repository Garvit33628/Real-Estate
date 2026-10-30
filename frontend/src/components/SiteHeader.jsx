function SiteHeader({
  user,
  onNavigateAuth,
  onBrowseProperties,
  onViewFavorites,
  onOpenAdmin,
  onLogout,
}) {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-5 gap-y-3 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-xl bg-gray-700 font-bold text-white">G</div>
        <div>
          <p className="m-0 text-base font-bold text-gray-900">Ghar Hub</p>
          <span className="text-xs text-gray-500">Property listings</span>
        </div>
      </div>

      <nav className="order-3 flex basis-full items-center gap-5 border-t border-gray-300 pt-3 text-sm text-gray-600 md:order-none md:basis-auto md:border-0 md:pt-0">
        <button className="cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit hover:text-gray-950" onClick={onBrowseProperties} type="button">
          Properties
        </button>
        {user && (
          <button className="cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit hover:text-gray-950" onClick={onViewFavorites} type="button">
            Saved
          </button>
        )}
        <a className="hover:text-gray-950" href="#featured">About</a>
      </nav>

      {user ? (
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2 text-sm text-gray-900">
          <span className="mr-1">Hello, {user.name}</span>
          {user.role === 'admin' && (
            <button className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50" onClick={onOpenAdmin} type="button">
              Manage listings
            </button>
          )}
          <button className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      ) : (
        <button className="ml-auto rounded-xl border border-gray-700 bg-gray-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800" onClick={() => onNavigateAuth('register')} type="button">
          Get started
        </button>
      )}
    </header>
  );
}

export default SiteHeader;