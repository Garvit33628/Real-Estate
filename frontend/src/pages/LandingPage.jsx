import SiteHeader from '../components/SiteHeader';

function LandingPage({
  user,
  onNavigateAuth,
  onBrowseProperties,
  onViewFavorites,
  onOpenAdmin,
  onLogout,
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <SiteHeader
        user={user}
        onNavigateAuth={onNavigateAuth}
        onBrowseProperties={onBrowseProperties}
        onViewFavorites={onViewFavorites}
        onOpenAdmin={onOpenAdmin}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-5 sm:px-6 lg:px-8">
        <section className="grid min-h-[620px] items-center gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="py-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gray-600">Simple homes, better living</p>
            <h1 className="m-0 max-w-2xl text-4xl font-bold leading-tight text-gray-950 sm:text-5xl">Find a place that feels like home.</h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-gray-600">
              Browse dependable property options, compare local listings, and take the next step with a clear and straightforward buying experience.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-9 gap-y-5">
              <div className="flex flex-col gap-2">
                <strong className="text-2xl text-gray-900">1200+</strong>
                <span className="text-sm text-gray-500">Homes</span>
              </div>
              <div className="flex flex-col gap-2">
                <strong className="text-2xl text-gray-900">4.9</strong>
                <span className="text-sm text-gray-500">Average review</span>
              </div>
              <div className="flex flex-col gap-2">
                <strong className="text-2xl text-gray-900">24/7</strong>
                <span className="text-sm text-gray-500">Support</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto grid min-h-[420px] w-full max-w-[520px] place-items-center sm:min-h-[520px]">
            <div
              className="relative aspect-[4/3] w-full max-w-[470px] rounded-3xl border border-gray-300 bg-cover bg-center"
              style={{ backgroundImage: "linear-gradient(rgba(17, 24, 39, 0.2), rgba(17, 24, 39, 0.2)), url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80')" }}
            >
              <div className="absolute bottom-4 left-4 rounded-full border border-gray-300 bg-white/90 px-4 py-2.5 text-xs font-bold text-gray-900">Featured listing</div>
            </div>
            <div className="absolute bottom-8 right-0 flex flex-col gap-1 rounded-2xl border border-gray-300 bg-white p-4 sm:right-2 sm:px-5">
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-500">From</span>
              <strong className="text-2xl text-gray-900">NPR 340,000</strong>
              <small className="text-gray-600">2 bed • city center</small>
            </div>
          </div>
        </section>

        <section id="featured" className="pt-4">
          <div className="mb-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gray-600">Why people choose us</p>
            <h2 className="m-0 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">Clear options for everyday buyers.</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-gray-300 bg-white p-6">
              <div className="mb-4 grid size-12 place-items-center rounded-xl bg-gray-200 text-lg text-gray-900">⌂</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Local listings</h3>
              <p className="m-0 leading-7 text-gray-600">Property options in the areas buyers actually care about.</p>
            </article>
            <article className="rounded-2xl border border-gray-300 bg-white p-6">
              <div className="mb-4 grid size-12 place-items-center rounded-xl bg-gray-200 text-lg text-gray-900">✓</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Simple process</h3>
              <p className="m-0 leading-7 text-gray-600">Less noise, clearer decisions, and easier home searches.</p>
            </article>
            <article className="rounded-2xl border border-gray-300 bg-white p-6">
              <div className="mb-4 grid size-12 place-items-center rounded-xl bg-gray-200 text-lg text-gray-900">◎</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Helpful support</h3>
              <p className="m-0 leading-7 text-gray-600">Guidance from the first click to final property shortlist.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;