import InquiryForm from '../components/InquiryForm';
import SiteHeader from '../components/SiteHeader';
import { formatNpr } from '../utils/formatters';

const propertyStatusLabels = {
  for_sale: 'For sale',
  for_rent: 'For rent',
  sold: 'Sold',
  rented: 'Rented',
};

function PropertyDetailsPage({
  property,
  user,
  isFavorite,
  onNavigateAuth,
  onBrowseProperties,
  onViewFavorites,
  onOpenAdmin,
  onToggleFavorite,
  onBack,
  onLogout,
}) {
  const location = property.location;
  const imageUrl = property.images?.[0]?.url;

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

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-7 sm:px-6 lg:px-8">
        <button className="mb-5 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900 transition hover:bg-gray-50" onClick={onBack} type="button">
          Back to properties
        </button>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
          <div className="min-w-0">
            <div className="grid aspect-video place-items-center overflow-hidden rounded-2xl border border-gray-300 bg-gray-200 text-sm text-gray-600">
              {imageUrl ? <img className="h-full w-full object-cover" src={imageUrl} alt={property.title} /> : <span>No photo available</span>}
            </div>

            <section className="border-b border-gray-300 py-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-600">{propertyStatusLabels[property.status] || 'Available'}</p>
                  <h1 className="m-0 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{property.title}</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    {[location?.address, location?.city, location?.state, location?.zipCode]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
                <p className="m-0 shrink-0 text-xl font-bold text-gray-900">{formatNpr(property.price)}</p>
                <button
                  className={isFavorite
                    ? 'shrink-0 rounded-xl border border-gray-700 bg-gray-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800'
                    : 'shrink-0 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'}
                  onClick={() => onToggleFavorite(property._id)}
                  type="button"
                  aria-pressed={isFavorite}
                >
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1"><strong>{property.bedrooms || 0}</strong><span className="text-sm text-gray-600">Bedrooms</span></div>
                <div className="flex flex-col gap-1"><strong>{property.bathrooms || 0}</strong><span className="text-sm text-gray-600">Bathrooms</span></div>
                <div className="flex flex-col gap-1"><strong>{Number(property.areaSqFt || 0).toLocaleString()}</strong><span className="text-sm text-gray-600">Sq ft</span></div>
                <div className="flex flex-col gap-1"><strong>{propertyTypeLabels[property.type] || property.type}</strong><span className="text-sm text-gray-600">Type</span></div>
              </div>
            </section>

            <section className="border-b border-gray-300 py-5">
              <h2 className="mb-2 text-lg font-semibold text-gray-900">About this property</h2>
              <p className="m-0 whitespace-pre-line text-sm leading-7 text-gray-600">{property.description}</p>
            </section>

            {property.amenities?.length > 0 && (
              <section className="border-b border-gray-300 py-5">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">Features</h2>
                <ul className="mt-3 flex flex-wrap gap-2 p-0">
                  {property.amenities.map((amenity) => <li className="list-none rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm text-gray-600" key={amenity}>{amenity}</li>)}
                </ul>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-5">
            <InquiryForm propertyId={property._id} user={user} />
          </aside>
        </div>
      </main>
    </div>
  );
}

const propertyTypeLabels = {
  apartment: 'Apartment',
  house: 'House',
  villa: 'Villa',
  land: 'Land',
  commercial: 'Commercial',
};

export default PropertyDetailsPage;