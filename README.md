# ECommerce 3D Frontend

A modern React frontend with 3D product visualization, smooth animations, and beautiful UI/UX.

## Features

- 🎨 **Modern UI/UX** - Clean, responsive design with Tailwind CSS
- 🎭 **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- 🎯 **3D Product Views** - Interactive 3D models with React Three Fiber
- 🛒 **Shopping Cart** - Animated cart with real-time updates
- 👤 **User Authentication** - Login/Register with form validation
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts
- 🔍 **Advanced Search** - Real-time product filtering and search
- ⚡ **Performance Optimized** - Code splitting and lazy loading

## Tech Stack

- **React 18** - Latest React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Three Fiber** - React renderer for Three.js
- **Zustand** - Lightweight state management
- **React Router v6** - Client-side routing
- **React Hot Toast** - Beautiful notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── 3D/             # Three.js 3D components
│   ├── Cart/           # Shopping cart components
│   ├── Layout/         # Layout components (Header, Footer)
│   └── Products/       # Product-related components
├── pages/              # Page components
│   ├── Home.tsx        # Homepage with hero section
│   ├── Products.tsx    # Product catalog
│   ├── ProductDetail.tsx # Individual product page
│   ├── Login.tsx       # Authentication pages
│   ├── Register.tsx    
│   └── Profile.tsx     # User profile
├── store/              # State management
│   └── useStore.ts     # Zustand store
├── App.tsx             # Main app component
├── index.tsx           # Entry point
└── index.css           # Global styles
```

## Key Features

### 3D Product Visualization
- Interactive 3D models that users can rotate and zoom
- Smooth animations and lighting effects
- Color and material variations

### Animated Shopping Experience
- Smooth page transitions
- Hover effects and micro-interactions
- Real-time cart updates with animations
- Loading states and skeleton screens

### Modern Authentication
- Form validation with visual feedback
- Social login integration ready
- Secure token-based authentication
- Password strength indicators

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized performance on mobile

## Customization

### Colors and Theming
Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your primary colors */ },
      secondary: { /* your secondary colors */ }
    }
  }
}
```

### 3D Models
Replace the placeholder 3D models in `src/components/3D/` with your own models.

### Animations
Customize animations in individual components using Framer Motion variants.

## Performance

- Code splitting with React.lazy()
- Image optimization and lazy loading
- Efficient state management with Zustand
- Optimized 3D rendering with React Three Fiber

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
