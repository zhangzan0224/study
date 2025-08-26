# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 H5 mobile application for managing medical activities. The project uses Vue CLI, Vant UI components, and follows a mobile-first design approach.

## Development Commands

- **Install dependencies**: `pnpm install`
- **Development server**: `pnpm run serve`
- **Production build**: `pnpm run build`

## Technology Stack

- **Framework**: Vue 3 with Composition API
- **UI Library**: Vant 4.9.21 (mobile UI components)
- **State Management**: Vuex 4
- **Routing**: Vue Router 4 with hash history
- **Styling**: Less preprocessor
- **Build Tool**: Vue CLI 5

## Project Structure

```
src/
├── main.js              # App entry point with Vant initialization
├── App.vue             # Root component with router-view
├── router/             # Vue Router configuration
│   └── index.js       # Route definitions with lazy loading
├── store/              # Vuex store (currently empty)
│   └── index.js       # Store setup with modules structure
├── views/             # Page-level components
│   ├── HomeView.vue   # Home page with HelloWorld component
│   ├── AboutView.vue  # About page (lazy-loaded)
│   └── NewActivity.vue # Main activity creation form
├── components/        # Reusable components
│   └── HelloWorld.vue # Example component
└── assets/            # Static assets
    └── logo.png       # Vue logo
```

## Key Architecture Notes

### Mobile-First Design
- Uses Vant UI components optimized for mobile
- Custom styling with Less and scoped styles
- Responsive layout with fixed footer navigation

### Activity Management
The main feature is the `NewActivity.vue` component which provides a comprehensive form for creating medical activities including:

- **Activity Information**: Company details, activity metadata, scheduling
- **Expert Information**: Photo upload, professional details, hospital info
- **Form Validation**: Required field validation with custom error messages
- **File Upload**: Vant uploader component for expert photos

### State Management
- Vuex store is set up but currently empty
- Forms use Vue's reactive system with `reactive()`
- Component-level state management in setup functions

### Routing Configuration
- Hash-based routing for mobile compatibility
- Lazy loading for About page
- Direct imports for frequently accessed pages

### Styling Conventions
- Uses `:deep()` selector for Vant component style overrides
- Color scheme based on rgba values for consistency
- Mobile-optimized spacing and typography
- Custom form field styling with right-aligned text

## Development Notes

- Path aliases configured: `@/` maps to `src/`
- No linting or type checking commands currently configured
- Uses pnpm as package manager
- Mobile H5 development with touch-optimized interactions