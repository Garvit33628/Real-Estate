function NotificationToast({ title, description, onDismiss }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm items-center gap-3 rounded-xl border border-blue-300 border-l-4 border-l-blue-600 bg-blue-50 px-4 py-3 text-blue-950 shadow-lg sm:right-5 sm:top-5" role="status" aria-live="polite">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700" aria-hidden="true">✓</span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
        <strong>{title}</strong>
        <span className="text-xs text-blue-800">{description}</span>
      </div>
      <button
        className="grid size-8 shrink-0 place-items-center rounded-lg border-0 bg-transparent text-xl text-blue-800 hover:bg-blue-100"
        onClick={onDismiss}
        type="button"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export default NotificationToast;