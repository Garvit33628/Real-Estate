import { useEffect, useState } from 'react';
import { getJson, postJson } from './utils/api';
import NotificationToast from './components/NotificationToast';
import AdminPropertiesPage from './pages/AdminPropertiesPage';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import PropertiesPage from './pages/PropertiesPage';

const initialForm = { name: '', email: '', password: '', phone: '' };

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem('realestate_demo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(getSavedUser);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  useEffect(() => {
    if (!user?._id) {
      return undefined;
    }

    let isCurrentRequest = true;
    getJson('/auth/me')
      .then((profile) => {
        if (isCurrentRequest) {
          setFavoriteIds(new Set((profile.favorites || []).map((property) => (
            typeof property === 'string' ? property : property._id
          ))));
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          setFavoriteIds(new Set());
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [user?._id]);

  const showNotification = (title, description) => {
    setNotification({ id: Date.now(), title, description });
  };

  const handleNavigateAuth = (mode) => {
    setAuthMode(mode);
    setCurrentPage('auth');
    setMessage('');
    showNotification(
      mode === 'login' ? 'Login' : 'Register',
      mode === 'login' ? 'Login form opened.' : 'Registration form opened.'
    );
  };

  const handleToggleFavorite = async (propertyId) => {
    if (!user) {
      handleNavigateAuth('login');
      return;
    }

    try {
      const favorites = await postJson(`/users/favorites/${propertyId}`, {});
      const nextFavorites = new Set((favorites || []).map((favorite) => (
        typeof favorite === 'string' ? favorite : favorite._id
      )));
      setFavoriteIds(nextFavorites);
      showNotification(
        nextFavorites.has(propertyId) ? 'Property saved' : 'Property removed',
        nextFavorites.has(propertyId)
          ? 'You can find it in your saved properties.'
          : 'It was removed from your saved properties.'
      );
    } catch (error) {
      showNotification('Could not update saved properties', error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const payload = authMode === 'login'
        ? { email: form.email, password: form.password }
        : form;
      const result = await postJson(endpoint, payload);

      if (result?.token) {
        localStorage.setItem('realestate_demo_token', result.token);
      }

      const currentUser = {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
      };

      localStorage.setItem('realestate_demo_user', JSON.stringify(currentUser));
      setUser(currentUser);
      setForm(initialForm);
      setCurrentPage('properties');
      setMessage('');
      showNotification(
        authMode === 'login' ? 'Login successful!' : 'Account created!',
        `Welcome${currentUser.name ? `, ${currentUser.name}` : ''}.`
      );
    } catch (error) {
      setMessage(error.message || 'Unable to complete the request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('realestate_demo_token');
    localStorage.removeItem('realestate_demo_user');
    setUser(null);
    setSelectedProperty(null);
    setFavoriteIds(new Set());
    setCurrentPage('landing');
    showNotification('Logged out', 'You have been returned to the home page.');
  };

  let page;

  if (currentPage === 'auth') {
    page = (
      <AuthPage
        authMode={authMode}
        form={form}
        message={message}
        isSubmitting={isSubmitting}
        onModeChange={handleNavigateAuth}
        onFieldChange={handleChange}
        onSubmit={handleSubmit}
        onBack={() => setCurrentPage('landing')}
      />
    );
  } else if (currentPage === 'properties' || currentPage === 'favorites') {
    page = (
      <PropertiesPage
        user={user}
        favoriteIds={favoriteIds}
        favoritesOnly={currentPage === 'favorites'}
        onNavigateAuth={handleNavigateAuth}
        onBrowseProperties={() => setCurrentPage('properties')}
        onViewFavorites={() => setCurrentPage('favorites')}
        onOpenAdmin={() => setCurrentPage('adminProperties')}
        onToggleFavorite={handleToggleFavorite}
        onSelectProperty={(property) => {
          setSelectedProperty(property);
          setCurrentPage('propertyDetails');
        }}
        onLogout={handleLogout}
      />
    );
  } else if (currentPage === 'propertyDetails' && selectedProperty) {
    page = (
      <PropertyDetailsPage
        property={selectedProperty}
        user={user}
        isFavorite={favoriteIds.has(selectedProperty._id)}
        onNavigateAuth={handleNavigateAuth}
        onBrowseProperties={() => setCurrentPage('properties')}
        onViewFavorites={() => setCurrentPage('favorites')}
        onOpenAdmin={() => setCurrentPage('adminProperties')}
        onToggleFavorite={handleToggleFavorite}
        onBack={() => setCurrentPage('properties')}
        onLogout={handleLogout}
      />
    );
  } else if (currentPage === 'adminProperties' && user?.role === 'admin') {
    page = (
      <AdminPropertiesPage
        user={user}
        onViewFavorites={() => setCurrentPage('favorites')}
        onNavigateAuth={handleNavigateAuth}
        onBrowseProperties={() => setCurrentPage('properties')}
        onOpenAdmin={() => setCurrentPage('adminProperties')}
        onLogout={handleLogout}
        onNotify={showNotification}
      />
    );
  } else {
    page = (
      <LandingPage
        user={user}
        onNavigateAuth={handleNavigateAuth}
        onBrowseProperties={() => setCurrentPage('properties')}
        onViewFavorites={() => setCurrentPage('favorites')}
        onOpenAdmin={() => setCurrentPage('adminProperties')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <>
      {page}
      {notification && (
        <NotificationToast
          key={notification.id}
          title={notification.title}
          description={notification.description}
          onDismiss={() => setNotification(null)}
        />
      )}
    </>
  );
}

export default App;
