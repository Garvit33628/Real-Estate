import { useEffect, useState } from 'react';
import NotificationToast from './NotificationToast';
import { postJson } from '../utils/api';

const fieldClass = 'w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200';
const labelClass = 'flex flex-col gap-2 text-sm text-gray-600';

function InquiryForm({ propertyId, user }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');
    setIsSubmitting(true);

    try {
      await postJson('/leads', { ...form, propertyId });
      setToast({ id: Date.now(), title: 'Inquiry sent!' });
      setForm((previous) => ({ ...previous, message: '' }));
    } catch (error) {
      setFeedback(error.message || 'Unable to send your inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast && (
        <NotificationToast
          title={toast.title}
          description="The listing team will follow up."
          onDismiss={() => setToast(null)}
        />
      )}

      <section className="rounded-2xl border border-gray-300 bg-white p-5" aria-labelledby="inquiry-heading">
        <h2 className="mb-2 text-lg font-semibold text-gray-900" id="inquiry-heading">Ask about this property</h2>
        <p className="mb-5 text-sm leading-6 text-gray-600">Send a message and the listing team will follow up.</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className={labelClass}>
            <span>Your name</span>
            <input className={fieldClass} name="name" value={form.name} onChange={handleChange} autoComplete="name" required />
          </label>
          <label className={labelClass}>
            <span>Email</span>
            <input className={fieldClass} name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
          </label>
          <label className={labelClass}>
            <span>Phone</span>
            <input className={fieldClass} name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" required />
          </label>
          <label className={labelClass}>
            <span>Message</span>
            <textarea
              className={`${fieldClass} resize-y`}
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              placeholder="I'd like to know more about this property."
              required
            />
          </label>

          {feedback && <p className="m-0 rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">{feedback}</p>}

          <button className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-700 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Sending...' : 'Send inquiry'}
          </button>
        </form>
      </section>
    </>
  );
}

export default InquiryForm;