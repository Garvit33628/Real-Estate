function AuthPage({
  authMode,
  form,
  message,
  isSubmitting,
  onModeChange,
  onFieldChange,
  onSubmit,
  onBack,
}) {
  const fieldClass = 'w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-600 focus:ring-2 focus:ring-gray-200';

  return (
    <div className="grid min-h-screen place-items-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl border border-gray-300 bg-white p-5 sm:p-7">
        <button className="mb-5 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900 transition hover:bg-gray-50" onClick={onBack} type="button">
          ← Back to home
        </button>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-600">Welcome</p>
          <h1 className="m-0 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{authMode === 'login' ? 'Log in to your account' : 'Create your account'}</h1>
        </div>

        <div className="my-6 grid grid-cols-2 gap-2 rounded-xl border border-gray-300 bg-gray-50 p-1.5">
          <button
            className={authMode === 'login' ? 'rounded-lg border border-gray-700 bg-gray-700 px-3 py-3 font-semibold text-white' : 'rounded-lg border border-transparent bg-transparent px-3 py-3 font-semibold text-gray-600 hover:text-gray-900'}
            onClick={() => onModeChange('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={authMode === 'register' ? 'rounded-lg border border-gray-700 bg-gray-700 px-3 py-3 font-semibold text-white' : 'rounded-lg border border-transparent bg-transparent px-3 py-3 font-semibold text-gray-600 hover:text-gray-900'}
            onClick={() => onModeChange('register')}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {authMode === 'register' && (
            <label className="flex flex-col gap-2 text-sm text-gray-600">
              <span>Full name</span>
              <input className={fieldClass} type="text" name="name" value={form.name} onChange={onFieldChange} placeholder="John Smith" required />
            </label>
          )}

          <label className="flex flex-col gap-2 text-sm text-gray-600">
            <span>Email address</span>
            <input className={fieldClass} type="email" name="email" value={form.email} onChange={onFieldChange} placeholder="name@example.com" required />
          </label>

          {authMode === 'register' && (
            <label className="flex flex-col gap-2 text-sm text-gray-600">
              <span>Phone</span>
              <input className={fieldClass} type="tel" name="phone" value={form.phone} onChange={onFieldChange} placeholder="+1 555 123 4567" />
            </label>
          )}

          <label className="flex flex-col gap-2 text-sm text-gray-600">
            <span>Password</span>
            <input className={fieldClass} type="password" name="password" value={form.password} onChange={onFieldChange} placeholder="Enter your password" required />
          </label>

          {message && <p className="m-0 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800" role="alert">{message}</p>}

          <button className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-700 px-4 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? authMode === 'login' ? 'Logging in...' : 'Creating account...'
              : authMode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;