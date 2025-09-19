# HiveSpace Admin Portal - Copilot Instructions

## Repository Overview

This is the **HiveSpace Admin Portal**, a modern Vue 3 admin dashboard built on the TailAdmin template. It's designed as a comprehensive data-centric admin panel for managing HiveSpace platform operations.

### Project Type & Size
- **Type**: Vue.js Admin Dashboard / Single Page Application
- **Size**: ~177 Vue components, ~30 TypeScript files, ~5,762 total lines of code
- **Primary Languages**: Vue 3 (Composition API), TypeScript, Tailwind CSS
- **Target Runtime**: Web browsers (development on Node.js 18+)

### Core Technology Stack
- **Frontend Framework**: Vue 3 with Composition API
- **Build System**: Vite 6.x (fast development server and optimized builds)
- **Type System**: TypeScript with strict type checking
- **Styling**: Tailwind CSS v4 (utility-first CSS framework)
- **State Management**: Pinia (official Vue state library)
- **HTTP Client**: Axios with centralized API configuration
- **Routing**: Vue Router 4
- **UI Components**: Custom components + third-party libraries (ApexCharts, Flatpickr, Quill, etc.)
- **Authentication**: OIDC (OpenID Connect) for enterprise SSO

## Build Instructions & Commands

### Prerequisites
- **Node.js**: 18.x or later (recommended: 20.x+)
- **Package Manager**: npm (package-lock.json present)
- **IDE Recommendation**: VSCode + Volar extension (disable Vetur)

### Essential Commands

#### Setup & Development
```bash
# Always run first - installs all dependencies
npm install

# Start development server (usually runs on http://localhost:5173, may use 5174 if 5173 is busy)
npm run dev
```

#### Build & Production
```bash
# Full production build (includes type-checking)
npm run build

# Build without type-checking (faster, for testing)
npm run build-only

# Preview production build locally
npm run preview
```

#### Code Quality & Validation
```bash
# Run ESLint (fixes auto-fixable issues)
npm run lint

# Type checking only (TypeScript validation)
npm run type-check

# Format code with Prettier
npm run format
```

### Known Build Issues & Workarounds

#### Type Check Failures (Expected)
The `npm run type-check` command currently fails with 11 errors. **This is expected and should be ignored unless you're specifically working on these files:**

**Known Issues:**
1. Missing `@/services/user.service` module (referenced in `src/stores/user.ts`)
2. Missing types for `quill-image-uploader` package
3. TypeScript strict mode violations in demo files

**Workaround**: The build (`npm run build`) still succeeds because Vite can compile TypeScript without strict type checking. Only fix these if directly working on the affected files.

#### Linting Issues (Partially Expected)
`npm run lint` shows 15 errors related to:
- Unused imports (`onMounted`, `onUnmounted`)
- Unused variables in demo components
- TypeScript strict type violations
- Empty object type issues

**Workaround**: These are primarily in demo/example files. Fix only if working on those specific components.

#### Dev Server Port
If port 5173 is busy, Vite automatically uses 5174. This is normal behavior.

### Environment Setup

#### Required Environment File
Create `.env` in project root (copy from `docs/env.example.md`):

```env
# API Configuration
VITE_API_BASE_URL=https://localhost:7001/api
VITE_API_TIMEOUT=30000

# Authentication (OIDC)
VITE_AUTH_CALLBACK_URL=http://localhost:5173/callback

# Application
VITE_APP_NAME=HiveSpace Admin Portal
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_LOGGING=true
VITE_ENABLE_DEBUG=true
```

#### Development Server Timing
- **npm install**: ~20-30 seconds
- **npm run dev**: ~2-5 seconds
- **npm run build**: ~10-15 seconds
- **npm run lint**: ~5-10 seconds

## Project Layout & Architecture

### High-Level Architecture

**API Gateway Pattern**: The application uses a centralized API gateway architecture where all API calls route through a single gateway endpoint configured via `VITE_API_BASE_URL`.

**Component-Based Architecture**: Follows Vue 3 composition API patterns with clear separation of concerns:
- **Components**: Reusable UI components
- **Views**: Page-level components 
- **Stores**: Centralized state management (Pinia)
- **Services**: API and business logic layer
- **Composables**: Reusable composition functions

### Key Directory Structure

```
src/
├── components/           # Reusable Vue components
│   ├── common/          # Shared UI components (Toast, Modal, etc.)
│   ├── charts/          # Chart components (ApexCharts)
│   ├── forms/           # Form-related components
│   ├── layout/          # Layout components (Header, Sidebar)
│   └── tables/          # Table components
├── views/               # Page-level components
│   ├── Demo/            # Demo pages and examples
│   ├── auth/            # Authentication pages
│   └── others/          # Additional page types
├── stores/              # Pinia state stores
│   ├── app.ts          # Global app state (theme, notifications)
│   ├── auth.ts         # Authentication state
│   └── user.ts         # User management state
├── services/            # API services layer
│   ├── api.ts          # Axios configuration
│   ├── admin.service.ts # Admin API endpoints
│   └── index.ts        # Service exports
├── config/              # Configuration management
│   ├── index.ts        # Unified configuration
│   └── constants.ts    # Environment constants
├── router/              # Vue Router configuration
├── composables/         # Reusable composition functions
├── i18n/               # Internationalization
│   └── locales/        # Language files (en.json, vi.json)
├── icons/              # SVG icon components
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

### Configuration Files (Root Directory)

**Critical Build Files:**
- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Vite bundler configuration
- `tsconfig.json` - TypeScript configuration (project references)
- `tsconfig.app.json` - Main app TypeScript config
- `eslint.config.ts` - ESLint linting rules
- `postcss.config.js` - PostCSS configuration for Tailwind

**Environment Files:**
- `.env.development` - Development environment variables
- `.env` - Local environment overrides (create from docs/env.example.md)

**Other Important Files:**
- `.prettierrc.json` - Code formatting rules
- `.editorconfig` - Editor configuration
- `.gitignore` - Git ignore patterns
- `env.d.ts` - Vite environment type definitions

### Component Patterns

**Toast Notifications:**
```typescript
// Use app store for notifications
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
appStore.notifySuccess('Success!', 'Data saved.')
appStore.notifyError('Error!', 'Connection failed.')
```

**API Calls:**
```typescript
// Centralized API services
import { adminService } from '@/services/admin.service'
const users = await adminService.getUsers()
```

**State Management:**
```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores'
const authStore = useAuthStore()
await authStore.login(credentials)
</script>
```

### Validation & CI/CD

**No GitHub Actions Detected**: This repository does not currently have GitHub Actions workflows. Manual validation is required.

**Pre-commit Validation Steps:**
1. `npm run lint` - Fix linting issues
2. `npm run type-check` - Verify TypeScript (expect known failures)
3. `npm run build` - Ensure production build succeeds
4. `npm run dev` - Test development server starts

**Manual Testing:**
- Navigate to `http://localhost:5173` (or 5174) after `npm run dev`
- Test key user flows in the admin dashboard
- Verify toast notifications and modal dialogs work
- Check responsive design on different screen sizes

### Important Dependencies

**Runtime Dependencies (Always Required):**
- Vue 3 + Vue Router 4 + Pinia (core framework)
- Axios (HTTP client)
- Tailwind CSS (styling)
- ApexCharts (data visualization)
- Flatpickr (date picker)
- Lucide Vue (icons)

**Development Dependencies:**
- Vite (build tool)
- TypeScript + vue-tsc (type checking)
- ESLint + Prettier (code quality)

### Memory Bank Documentation

The `memory-bank/` directory contains additional project context:
- `architecture/` - Architectural decisions
- `patterns/` - Code patterns and examples
- `troubleshooting/` - Common issues and solutions
- `conventions/` - Coding standards
- `docs/` - Additional documentation

### Documentation Resources

**Primary Documentation:**
- `docs/README.md` - Technical documentation hub
- `docs/env.example.md` - Environment configuration guide
- `docs/components/` - Component-specific guides
- `src/config/README.md` - Configuration system guide

## Agent Instructions

**Trust These Instructions**: These instructions are comprehensive and tested. Only search the codebase if information here is incomplete or found to be incorrect.

**Common Tasks:**
- **Adding Components**: Place in appropriate `src/components/` subdirectory
- **API Integration**: Use `src/services/` pattern with Axios
- **State Management**: Use Pinia stores in `src/stores/`
- **Styling**: Use Tailwind CSS utility classes
- **Icons**: Add SVG components to `src/icons/` and export in `index.ts`

**Before Making Changes:**
1. Run `npm install` to ensure dependencies are current
2. Start with `npm run dev` to verify current functionality
3. Use `npm run lint` to check for immediate code quality issues
4. Make incremental changes and test frequently

**Critical Notes:**
- Always use TypeScript for new files
- Follow Vue 3 Composition API patterns
- Use the centralized configuration system (`src/config/`)
- Respect the existing component architecture
- Test changes with both `npm run dev` and `npm run build`