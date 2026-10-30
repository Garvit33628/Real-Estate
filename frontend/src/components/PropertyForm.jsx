import { useRef, useState } from 'react';
import { postFormData, putJson } from '../utils/api';

const fieldClass = 'min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200';
const labelClass = 'flex min-w-0 flex-col gap-2 text-sm text-gray-600';

const initialFields = {
  title: '',
  description: '',
  type: 'house',
  status: 'for_sale',
  price: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  bedrooms: '1',
  bathrooms: '1',
  areaSqFt: '',
  amenities: '',
};

function getFields(property) {
  if (!property) {
    return initialFields;
  }

  return {
    title: property.title || '',
    description: property.description || '',
    type: property.type || 'house',
    status: property.status || 'for_sale',
    price: String(property.price ?? ''),
    address: property.location?.address || '',
    city: property.location?.city || '',
    state: property.location?.state || '',
    zipCode: property.location?.zipCode || '',
    bedrooms: String(property.bedrooms ?? 0),
    bathrooms: String(property.bathrooms ?? 0),
    areaSqFt: String(property.areaSqFt ?? ''),
    amenities: property.amenities?.join(', ') || '',
  };
}

function PropertyForm({ property, onCreated, onUpdated, onCancelEdit }) {
  const formRef = useRef(null);
  const [fields, setFields] = useState(() => getFields(property));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const amenities = fields.amenities
      .split(',')
      .map((amenity) => amenity.trim())
      .filter(Boolean);

    try {
      if (property) {
        const updatedProperty = await putJson(`/properties/${property._id}`, {
          ...fields,
          amenities: amenities.join(', '),
        });
        onUpdated(updatedProperty);
      } else {
        const formData = new FormData();
        Object.entries(fields).forEach(([name, value]) => {
          if (name !== 'amenities') {
            formData.append(name, value);
          }
        });
        if (amenities.length > 0) {
          formData.append('amenities', amenities.join(','));
        }
        Array.from(formRef.current.elements.images.files).forEach((image) => {
          formData.append('images', image);
        });

        const createdProperty = await postFormData('/properties', formData);
        setFields(initialFields);
        formRef.current.reset();
        onCreated(createdProperty);
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to create property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className={labelClass}>
        <span>Listing title</span>
        <input className={fieldClass} name="title" value={fields.title} onChange={handleChange} required />
      </label>
      <label className={labelClass}>
        <span>Description</span>
        <textarea className={`${fieldClass} resize-y`} name="description" value={fields.description} onChange={handleChange} rows="4" required />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          <span>Type</span>
          <div className="relative">
            <select className={`${fieldClass} appearance-none pr-10`} name="type" value={fields.type} onChange={handleChange}>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 size-2 -translate-y-1/2 rotate-45 border-b border-r border-gray-600" aria-hidden="true" />
          </div>
        </label>
        <label className={labelClass}>
          <span>Status</span>
          <div className="relative">
            <select className={`${fieldClass} appearance-none pr-10`} name="status" value={fields.status} onChange={handleChange}>
              <option value="for_sale">For sale</option>
              <option value="for_rent">For rent</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 size-2 -translate-y-1/2 rotate-45 border-b border-r border-gray-600" aria-hidden="true" />
          </div>
        </label>
        <label className={labelClass}>
          <span>Price (NPR)</span>
          <input className={fieldClass} name="price" type="number" min="1" value={fields.price} onChange={handleChange} required />
        </label>
        <label className={labelClass}>
          <span>Area (sq ft)</span>
          <input className={fieldClass} name="areaSqFt" type="number" min="1" value={fields.areaSqFt} onChange={handleChange} required />
        </label>
        <label className={labelClass}>
          <span>Bedrooms</span>
          <input className={fieldClass} name="bedrooms" type="number" min="0" value={fields.bedrooms} onChange={handleChange} required />
        </label>
        <label className={labelClass}>
          <span>Bathrooms</span>
          <input className={fieldClass} name="bathrooms" type="number" min="0" value={fields.bathrooms} onChange={handleChange} required />
        </label>
      </div>

      <label className={labelClass}>
        <span>Street address</span>
        <input className={fieldClass} name="address" value={fields.address} onChange={handleChange} required />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          <span>City</span>
          <input className={fieldClass} name="city" value={fields.city} onChange={handleChange} required />
        </label>
        <label className={labelClass}>
          <span>State / province</span>
          <input className={fieldClass} name="state" value={fields.state} onChange={handleChange} />
        </label>
        <label className={labelClass}>
          <span>Postal code</span>
          <input className={fieldClass} name="zipCode" value={fields.zipCode} onChange={handleChange} />
        </label>
      </div>
      <label className={labelClass}>
        <span>Amenities (comma-separated)</span>
        <input className={fieldClass} name="amenities" value={fields.amenities} onChange={handleChange} placeholder="Parking, Garden, Balcony" />
      </label>
      {property ? (
        <p className="m-0 text-sm text-gray-500">Existing photos are retained when editing.</p>
      ) : (
        <label className={labelClass}>
          <span>Photos</span>
          <input className="w-full rounded-xl border border-gray-300 bg-white p-2 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:font-semibold" name="images" type="file" accept="image/*" multiple />
        </label>
      )}

      {error && <p className="m-0 rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button className="rounded-xl border border-gray-700 bg-gray-700 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60" disabled={isSubmitting} type="submit">
          {isSubmitting ? property ? 'Saving...' : 'Publishing...' : property ? 'Save changes' : 'Publish property'}
        </button>
        {property && (
          <button className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60" disabled={isSubmitting} onClick={onCancelEdit} type="button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default PropertyForm;
