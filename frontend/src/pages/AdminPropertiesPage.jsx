import { useEffect, useState } from 'react';
import PropertyForm from '../components/PropertyForm';
import SiteHeader from '../components/SiteHeader';
import { deleteJson, getJson } from '../utils/api';
import { formatNpr } from '../utils/formatters';

function AdminPropertiesPage({
  user,
  onNavigateAuth,
  onBrowseProperties,
  onViewFavorites,
  onOpenAdmin,
  onLogout,
  onNotify,
}) {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadProperties = async () => {
      setIsLoading(true);
      setError('');

      try {
        const results = await getJson('/properties');
        if (isCurrentRequest) {
          setProperties(Array.isArray(results) ? results : []);
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setError(requestError.message || 'Unable to load properties.');
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
  }, []);

  const handleCreated = (property) => {
    setProperties((current) => [property, ...current]);
    onNotify('Property published', `${property.title} is now listed.`);
  };

  const handleUpdated = (property) => {
    setProperties((current) => current.map((item) => (
      item._id === property._id ? property : item
    )));
    setEditingProperty(null);
    onNotify('Property updated', `${property.title} changes were saved.`);
  };

  const handleDelete = async (property) => {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(property._id);
    setError('');

    try {
      await deleteJson(`/properties/${property._id}`);
      setProperties((current) => current.filter((item) => item._id !== property._id));
      onNotify('Property deleted', `${property.title} was removed.`);
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete property.');
    } finally {
      setDeletingId('');
    }
  };

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
        <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-600">Administration</p>
            <h1 className="m-0 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">Manage properties</h1>
            <p className="mt-2 text-sm text-gray-600">Publish a listing or remove one assigned to your account.</p>
          </div>
          <button className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50" onClick={onBrowseProperties} type="button">
            View public listings
          </button>
        </div>

        {error && <p className="mb-5 rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">{error}</p>}

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]">
          <section className="min-w-0 rounded-2xl border border-gray-300 bg-white p-4 sm:p-5" aria-labelledby="create-property-heading">
            <h2 className="mb-5 text-lg font-semibold text-gray-900" id="create-property-heading">
              {editingProperty ? 'Edit property' : 'New property'}
            </h2>
            <PropertyForm
              key={editingProperty?._id || 'new-property'}
              property={editingProperty}
              onCreated={handleCreated}
              onUpdated={handleUpdated}
              onCancelEdit={() => setEditingProperty(null)}
            />
          </section>

          <section className="min-w-0 rounded-2xl border border-gray-300 bg-white p-4 sm:p-5" aria-labelledby="property-inventory-heading">
            <div className="flex items-center justify-between">
              <h2 className="mb-5 text-lg font-semibold text-gray-900" id="property-inventory-heading">Published listings</h2>
              {!isLoading && <span>{properties.length}</span>}
            </div>

            {isLoading ? (
              <p className="rounded-2xl border border-gray-300 bg-white px-5 py-9 text-center text-gray-600" role="status">Loading properties...</p>
            ) : properties.length === 0 ? (
              <p className="rounded-2xl border border-gray-300 bg-white px-5 py-9 text-center text-gray-600">No published listings yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {properties.map((property) => {
                  const assignedStaffId = typeof property.assignedStaff === 'string'
                    ? property.assignedStaff
                    : property.assignedStaff?._id;
                  const canDelete = assignedStaffId === user._id;

                  return (
                    <article className="flex min-w-0 flex-wrap items-center gap-3 rounded-xl border border-gray-300 p-2.5" key={property._id}>
                      <div className="grid size-[72px] shrink-0 place-items-center overflow-hidden rounded-lg bg-gray-200 text-xs text-gray-600">
                        {property.images?.[0]?.url
                          ? <img className="h-full w-full object-cover" src={property.images[0].url} alt="" />
                          : <span>No photo</span>}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1 break-words text-xs text-gray-600">
                        <strong className="text-sm text-gray-900">{property.title}</strong>
                        <span>{[property.location?.city, property.location?.state].filter(Boolean).join(', ')}</span>
                        <span>{formatNpr(property.price)}</span>
                      </div>
                      {canDelete ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                            onClick={() => setEditingProperty(property)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-xl border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                            disabled={deletingId === property._id}
                            onClick={() => handleDelete(property)}
                            type="button"
                          >
                            {deletingId === property._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-right text-xs text-gray-500">Assigned elsewhere</span>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminPropertiesPage;
