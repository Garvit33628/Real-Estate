import { useEffect, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import { getJson } from '../utils/api';
import { formatNpr } from '../utils/formatters';

const emptyFilters = {
  city: '',
  type: '',
  status: '',
  bedrooms: '',
};

const propertyTypeLabels = {
  apartment: 'Apartment',
  house: 'House',
  villa: 'Villa',
  land: 'Land',
  commercial: 'Commercial',
};

const propertyStatusLabels = {
  for_sale: 'For sale',
  for_rent: 'For rent',
  sold: 'Sold',
  rented: 'Rented',
};

const fieldClass = 'min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200';
const filterLabelClass = 'flex min-w-0 flex-col gap-2 text-xs text-gray-600';

function PropertiesPage({
  user,
  favoriteIds,
  favoritesOnly,
  onNavigateAuth,
  onBrowseProperties,
  onViewFavorites,
  onOpenAdmin,
  onSelectProperty,
  onToggleFavorite,
  onLogout,
}) {
  const [filters, setFilters] = useState(emptyFilters);
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const loadProperties = async () => {
      setIsLoading(true);
      setError('');

      try {
        const results = await getJson('/properties', filters);
        if (isCurrentRequest) {
          setProperties(Array.isArray(results) ? results : []);
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setError(requestError.message || 'Unable to load properties.');
          setProperties([]);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadProperties();
    return () => {
      isCurrentRequest = false;
    };
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setDraftFilters((previous) => ({ ...previous, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setFilters({ ...draftFilters });
  };

  const handleClearFilters = () => {
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
  };

  const visibleProperties = favoritesOnly
    ? properties.filter((property) => favoriteIds.has(property._id))
    : properties;

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

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-600">{favoritesOnly ? 'Your shortlist' : 'Browse homes'}</p>
            <h1 className="m-0 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{favoritesOnly ? 'Saved properties' : 'Find your next place.'}</h1>
          </div>
          {!isLoading && !error && (
            <p className="m-0 text-sm text-gray-600">
              {visibleProperties.length} {visibleProperties.length === 1 ? 'property' : 'properties'}
            </p>
          )}
        </div>

        {!favoritesOnly && <form className="mb-7 grid grid-cols-1 items-end gap-3 rounded-2xl border border-gray-300 bg-white p-4 sm:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_0.8fr_auto]" onSubmit={handleSearch}>
          <label className={filterLabelClass}>
            <span>City</span>
            <input
              className={fieldClass}
              name="city"
              value={draftFilters.city}
              onChange={handleFilterChange}
              placeholder="Any city"
            />
          </label>

          <label className={filterLabelClass}>
            <span>Property type</span>
            <select className={fieldClass} name="type" value={draftFilters.type} onChange={handleFilterChange}>
              <option value="">Any type</option>
              {Object.entries(propertyTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className={filterLabelClass}>
            <span>Availability</span>
            <select className={fieldClass} name="status" value={draftFilters.status} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="for_sale">For sale</option>
              <option value="for_rent">For rent</option>
            </select>
          </label>

          <label className={filterLabelClass}>
            <span>Bedrooms</span>
            <select className={fieldClass} name="bedrooms" value={draftFilters.bedrooms} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <button className="rounded-xl border border-gray-700 bg-gray-700 px-4 py-3 font-semibold text-white transition hover:bg-gray-800" type="submit">Search</button>
            <button className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50" onClick={handleClearFilters} type="button">
              Clear
            </button>
          </div>
        </form>}

        {isLoading ? (
          <p className="rounded-2xl border border-gray-300 bg-white px-5 py-9 text-center text-gray-600" role="status">Loading properties...</p>
        ) : error ? (
          <p className="rounded-2xl border border-red-300 bg-red-50 px-5 py-9 text-center text-red-800" role="alert">{error}</p>
        ) : visibleProperties.length === 0 ? (
          <p className="rounded-2xl border border-gray-300 bg-white px-5 py-9 text-center text-gray-600">
            {favoritesOnly ? 'You have no saved properties yet.' : 'No properties match those filters.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProperties.map((property) => {
              const imageUrl = property.images?.[0]?.url;
              const location = property.location;
              const statusLabel = propertyStatusLabels[property.status] || 'Available';

              return (
                <article className="min-w-0 overflow-hidden rounded-2xl border border-gray-300 bg-white" key={property._id}>
                  <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-gray-200 text-sm text-gray-600">
                    {imageUrl ? (
                      <img className="h-full w-full object-cover" src={imageUrl} alt={property.title} />
                    ) : (
                      <span>No photo available</span>
                    )}
                    <span className="absolute left-3 top-3 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900">{statusLabel}</span>
                  </div>
                  <div className="p-4">
                    <p className="mb-1.5 text-lg font-bold text-gray-900">{formatNpr(property.price)}</p>
                    <h2 className="m-0 text-base font-semibold text-gray-900">{property.title}</h2>
                    <p className="mb-3 mt-1 min-h-[1.4em] text-sm text-gray-600">
                      {[location?.city, location?.state].filter(Boolean).join(', ')}
                    </p>
                    <div className="flex flex-wrap gap-x-3.5 gap-y-2 border-t border-gray-300 pt-3 text-xs text-gray-600">
                      <span>{property.bedrooms || 0} beds</span>
                      <span>{property.bathrooms || 0} baths</span>
                      <span>{Number(property.areaSqFt || 0).toLocaleString()} sq ft</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        className="cursor-pointer border-0 bg-transparent p-0 text-sm font-bold text-gray-900 underline underline-offset-4 hover:text-gray-600"
                        onClick={() => onSelectProperty(property)}
                        type="button"
                      >
                        View details
                      </button>
                      <button
                        className={favoriteIds.has(property._id)
                          ? 'rounded-xl border border-gray-700 bg-gray-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800'
                          : 'rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'}
                        onClick={() => onToggleFavorite(property._id)}
                        type="button"
                        aria-pressed={favoriteIds.has(property._id)}
                      >
                        {favoriteIds.has(property._id) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default PropertiesPage;