# TravelShield Frontend Documentation

## 🎨 UI/UX Design System

### Design Principles
- Clean and modern interface
- Responsive design for all devices
- Accessibility-first approach
- Consistent branding
- Intuitive navigation

### Color Palette
```scss
// Primary Colors
$primary-blue: #2563eb;
$primary-indigo: #4f46e5;
$primary-purple: #7c3aed;

// Secondary Colors
$secondary-green: #10b981;
$secondary-red: #ef4444;
$secondary-yellow: #f59e0b;

// Neutral Colors
$neutral-50: #f8fafc;
$neutral-100: #f1f5f9;
$neutral-800: #1e293b;
$neutral-900: #0f172a;
```

### Typography
```scss
// Font Families
$font-primary: 'Inter', sans-serif;
$font-secondary: 'Poppins', sans-serif;

// Font Sizes
$text-xs: 0.75rem;
$text-sm: 0.875rem;
$text-base: 1rem;
$text-lg: 1.125rem;
$text-xl: 1.25rem;
$text-2xl: 1.5rem;
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   └── Modal/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Navigation/
│   │   └── features/
│   │       ├── safety/
│   │       ├── booking/
│   │       └── claims/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Safety/
│   │   ├── Booking/
│   │   ├── Claims/
│   │   └── Profile/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   └── useSafety.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── safety.service.ts
│   ├── store/
│   │   ├── slices/
│   │   └── store.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── formatting.ts
│   └── App.tsx
└── package.json
```

## 🎯 Core Features Implementation

### 1. Interactive Safety Map
```typescript
// components/features/safety/SafetyMap.tsx
import { MapboxMap, Marker } from 'mapbox-gl';

interface SafetyMapProps {
  alerts: SafetyAlert[];
  onAlertClick: (alert: SafetyAlert) => void;
}

const SafetyMap: React.FC<SafetyMapProps> = ({ alerts, onAlertClick }) => {
  return (
    <MapContainer>
      <MapboxMap
        style="mapbox://styles/mapbox/light-v10"
        center={[0, 0]}
        zoom={2}
      >
        {alerts.map(alert => (
          <Marker
            key={alert.id}
            longitude={alert.longitude}
            latitude={alert.latitude}
            onClick={() => onAlertClick(alert)}
          />
        ))}
      </MapboxMap>
    </MapContainer>
  );
};
```

### 2. Booking System
```typescript
// components/features/booking/BookingForm.tsx
interface BookingFormProps {
  onSubmit: (data: BookingData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <DatePicker
        label="Check-in"
        name="checkIn"
        rules={{ required: true }}
      />
      <DatePicker
        label="Check-out"
        name="checkOut"
        rules={{ required: true }}
      />
      <GuestCounter
        label="Guests"
        name="guests"
        min={1}
        max={10}
      />
      <PriceCalculator
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
      />
      <Button type="submit">Book Now</Button>
    </Form>
  );
};
```

## 🚀 Performance Optimizations

### 1. Code Splitting
```typescript
// App.tsx
const HomePage = lazy(() => import('./pages/Home'));
const SafetyPage = lazy(() => import('./pages/Safety'));
const BookingPage = lazy(() => import('./pages/Booking'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Suspense>
  );
};
```

### 2. Image Optimization
```typescript
// components/common/Image/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  sizes
}) => {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${src}?format=webp&w=300 300w,
                ${src}?format=webp&w=600 600w`}
        sizes={sizes}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};
```

## 🔄 State Management

### 1. Redux Store Configuration
```typescript
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import safetyReducer from './slices/safetySlice';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    safety: safetyReducer,
    booking: bookingReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
```

### 2. API Integration
```typescript
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Define endpoints here
  }),
});
```

## 📱 Responsive Design

### 1. Breakpoint System
```scss
// styles/breakpoints.scss
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px
);

@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

### 2. Responsive Components
```typescript
// components/layout/Header/Header.tsx
const Header: React.FC = () => {
  return (
    <StyledHeader>
      <Logo />
      <DesktopNav className="hidden md:flex" />
      <MobileNav className="md:hidden" />
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  @include respond-to('md') {
    padding: 1.5rem 2rem;
  }
`;
```

## 🎨 UI Components Library

### 1. Button Component
```typescript
// components/common/Button/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  isLoading,
  children
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : children}
    </StyledButton>
  );
};
```

### 2. Form Components
```typescript
// components/common/Form/Input.tsx
interface InputProps {
  label: string;
  error?: string;
  type: 'text' | 'email' | 'password';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  type
}) => {
  return (
    <FormControl error={!!error}>
      <Label>{label}</Label>
      <StyledInput type={type} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormControl>
  );
};
```

## 📈 Analytics and Monitoring

### 1. Performance Monitoring
```typescript
// utils/analytics.ts
export const trackPageView = (page: string) => {
  analytics.page(page);
};

export const trackEvent = (name: string, data: any) => {
  analytics.track(name, data);
};
```

### 2. Error Tracking
```typescript
// utils/errorTracking.ts
export const initErrorTracking = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
};
```

## 🔒 Security Measures

### 1. XSS Prevention
```typescript
// utils/security.ts
export const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html);
};
```

### 2. CSRF Protection
```typescript
// services/api.ts
const api = axios.create({
  headers: {
    'X-CSRF-Token': getCsrfToken(),
  },
});
```

## 🔄 Continuous Integration

```yaml
# .github/workflows/frontend.yml
name: Frontend CI

on:
  push:
    paths:
      - 'frontend/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

## 📱 Progressive Web App

### 1. Service Worker
```typescript
// src/service-worker.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
  })
);
```

### 2. Manifest
```json
// public/manifest.json
{
  "name": "TravelShield",
  "short_name": "TravelShield",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔄 Next Steps

1. Implement remaining UI components
2. Add more interactive features
3. Enhance performance optimizations
4. Improve accessibility
5. Add more unit and integration tests
6. Implement remaining analytics tracking
7. Add more PWA features
8. Enhance security measures
