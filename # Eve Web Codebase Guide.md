# Eve Web Codebase Guide

This document outlines the conventions, patterns, and best practices for the Eve Web codebase. Follow this guide when making any changes to ensure consistency and maintainability.

## Table of Contents

1. [Project Overview](#project-overview)
2. [TypeScript Conventions](#typescript-conventions)
3. [Naming Conventions](#naming-conventions)
4. [File Structure](#file-structure)
5. [Component Patterns](#component-patterns)
6. [Routing Patterns](#routing-patterns)
7. [Styling Conventions](#styling-conventions)
8. [Import Patterns](#import-patterns)
9. [Code Organization](#code-organization)
10. [Linting & Formatting](#linting--formatting)

---

## Project Overview

- **Framework**: React 19 with TypeScript
- **Router**: TanStack Router (file-based routing)
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS v4 with DaisyUI
- **Build Tool**: Vite
- **Linter/Formatter**: Biome
- **Package Manager**: Yarn

---

## TypeScript Conventions

### Type Definitions

1. **Interfaces for Props**: Always use `interface` for component props, not `type`
   ```typescript
   // ✅ Good
   interface CustomButtonProps {
     title: string;
     icon?: React.ReactNode;
     onClick?: () => void;
     disabled?: boolean;
     className?: string;
   }

   // ❌ Avoid
   type CustomButtonProps = { ... }
   ```

2. **Component Props Interface Naming**: Use `ComponentNameProps` pattern
   ```typescript
   interface DatePickerDropdownProps { ... }
   interface DashboardLayoutProps { ... }
   interface InputFieldProps { ... }
   ```

3. **Type Exports**: Use `type` keyword for type-only exports when needed
   ```typescript
   export type AuthContextType = {
     user: object | null;
     loading: boolean;
   };
   ```

4. **Strict Mode**: The project uses TypeScript strict mode:
   - `strict: true`
   - `noUnusedLocals: true`
   - `noUnusedParameters: true`
   - `noFallthroughCasesInSwitch: true`

5. **Type Annotations**: Always type function parameters and return types explicitly
   ```typescript
   // ✅ Good
   const handleClick = (id: number): void => { ... }
   
   // ❌ Avoid
   const handleClick = (id) => { ... }
   ```

6. **React Component Types**: Use `React.FC<Props>` or explicit function signatures
   ```typescript
   // ✅ Good
   const Component: React.FC<Props> = ({ prop }) => { ... }
   
   // ✅ Also good
   function Component({ prop }: Props) { ... }
   ```

---

## Naming Conventions

### Files and Directories

1. **Component Files**: Use kebab-case for file names
   ```typescript
   date-picker-dropdown.tsx
   input-field.tsx
   nav-bar.tsx
   ```

2. **Route Files**: Use kebab-case matching the route path
   ```typescript
   sign-in.tsx
   sign-up.tsx
   forget-password.tsx
   ```

3. **Directories**: Use kebab-case
   ```
   sub-services/
   vendor-sub-services/
   accessories/
   ```

4. **Special Route Files**: Use TanStack Router conventions
   - `__root.tsx` - Root route
   - `_authenticated.tsx` - Layout route with authentication
   - `$eventId.tsx` - Dynamic route parameter

### Variables and Functions

1. **Variables**: Use camelCase
   ```typescript
   const selectedDate = new Date();
   const isModalOpen = false;
   const uploadedFiles = [];
   ```

2. **Functions**: Use camelCase with descriptive verbs
   ```typescript
   const handleClick = () => { ... }
   const handleFormSubmit = () => { ... }
   const getActiveSection = () => { ... }
   const setIsVisible = () => { ... }
   ```

3. **Event Handlers**: Prefix with `handle`
   ```typescript
   handleClick()
   handleSubmit()
   handleDelete()
   handleNavigation()
   ```

4. **Boolean Variables**: Prefix with `is`, `has`, `should`, or `can`
   ```typescript
   const isOpen = true;
   const hasError = false;
   const shouldReload = false;
   const canEdit = true;
   ```

5. **Constants**: Use UPPER_SNAKE_CASE for true constants, camelCase for const variables
   ```typescript
   const MAX_FILE_SIZE = 5000000; // True constant
   const months = ["January", ...]; // Const variable
   ```

### Components

1. **Component Names**: Use PascalCase
   ```typescript
   const DatePickerDropdown = () => { ... }
   const CustomButton = () => { ... }
   const DashboardLayout = () => { ... }
   ```

2. **Route Components**: Use `RouteComponent` or descriptive names
   ```typescript
   function RouteComponent() { ... }
   export function ServiceOne() { ... }
   ```

3. **Props Interfaces**: Use `ComponentNameProps`
   ```typescript
   interface DatePickerDropdownProps { ... }
   interface CustomButtonProps { ... }
   ```

---

## File Structure

### Project Structure

```
src/
├── app.tsx                    # Main app component
├── main.tsx                  # Entry point
├── index.css                 # Global styles
├── assets/                   # Static assets
│   ├── onBoarding/
│   ├── banks/
│   └── ...
├── providers/                # Context providers
│   └── auth-provider.tsx
├── routes/                   # TanStack Router routes
│   ├── __root.tsx
│   ├── _authenticated.tsx
│   ├── index.tsx
│   ├── auth/
│   ├── Onboarding/
│   └── ...
├── shared/                   # Shared code
│   ├── components/          # Reusable components
│   │   ├── accessories/     # UI components
│   │   ├── button/
│   │   ├── layouts/
│   │   └── pages/
│   ├── hoc/                 # Higher-order components
│   │   └── _authenticated/
│   └── utils/               # Utility functions
│       └── classnames.ts
└── dummy-data/              # Mock data
```

### Component Organization

1. **Shared Components**: Place in `src/shared/components/`
   - `accessories/` - Basic UI components (buttons, inputs, modals)
   - `layouts/` - Layout components
   - `pages/` - Page-specific components

2. **Route Components**: Place in `src/routes/` matching route structure

3. **Utilities**: Place in `src/shared/utils/`

---

## Component Patterns

### Component Structure

1. **Import Order**:
   ```typescript
   // 1. React and core libraries
   import React, { useState, useEffect } from "react";
   
   // 2. Third-party libraries
   import { createFileRoute } from "@tanstack/react-router";
   import { ChevronLeft } from "lucide-react";
   
   // 3. Internal imports (using path aliases)
   import { cn } from "@utils/classnames";
   import { CustomButton } from "@components/accessories/button";
   import logo from "@assets/evaLogo.png";
   ```

2. **Component Definition**:
   ```typescript
   // Interface first
   interface ComponentProps {
     prop: string;
   }
   
   // Then component
   const Component: React.FC<ComponentProps> = ({ prop }) => {
     // Hooks
     const [state, setState] = useState();
     
     // Effects
     useEffect(() => { ... }, []);
     
     // Handlers
     const handleClick = () => { ... };
     
     // Render
     return <div>...</div>;
   };
   
   export default Component;
   ```

3. **Route Components**: Use TanStack Router pattern
   ```typescript
   export const Route = createFileRoute("/path/to/route")({
     component: RouteComponent,
   });
   
   function RouteComponent() {
     return <div>...</div>;
   }
   ```

### State Management

1. **Local State**: Use `useState` for component-local state
   ```typescript
   const [isOpen, setIsOpen] = useState(false);
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   ```

2. **Context**: Use React Context for global state (see `auth-provider.tsx`)

3. **Server State**: Use TanStack Query for server state management

---

## Routing Patterns

### TanStack Router

1. **File-based Routing**: Routes are defined by file structure
   ```
   routes/
     index.tsx              → /
     auth/
       signin.tsx          → /auth/signin
       sign-up.tsx         → /auth/sign-up
   ```

2. **Layout Routes**: Use underscore prefix
   ```typescript
   _authenticated.tsx      // Layout route
   ```

3. **Dynamic Routes**: Use `$` prefix
   ```typescript
   $eventId.tsx            // /events/:eventId
   ```

4. **Route Definition**:
   ```typescript
   export const Route = createFileRoute("/path")({
     component: RouteComponent,
     beforeLoad: async ({ context }) => { ... },
   });
   ```

5. **Navigation**: Use `useNavigate` hook
   ```typescript
   const navigate = useNavigate();
   navigate({ to: "/path" });
   ```

---

## Styling Conventions

### Tailwind CSS

1. **Utility Classes**: Use Tailwind utility classes
   ```typescript
   <div className="flex items-center justify-center p-4">
   ```

2. **Conditional Classes**: Use `cn()` utility (from `classnames.ts`)
   ```typescript
   import { cn } from "@utils/classnames";
   
   <button className={cn(
     "base-classes",
     isActive && "active-classes",
     className
   )}>
   ```

3. **Custom Colors**: Use theme colors defined in `index.css`
   ```typescript
   className="bg-[#7417C6] text-white"
   ```

4. **Responsive Design**: Use Tailwind breakpoints
   ```typescript
   className="hidden md:flex"
   ```

5. **Spacing**: Use consistent spacing scale (Tailwind defaults)

### CSS Files

1. **Global Styles**: Only in `src/index.css`
2. **Component Styles**: Prefer Tailwind classes over separate CSS files
3. **If CSS file needed**: Use kebab-case matching component name
   ```typescript
   onboard.css  // For onboarding.tsx
   ```

---

## Import Patterns

### Path Aliases

The project uses TypeScript path aliases defined in `tsconfig.app.json`:

```typescript
"@assets/*"     → "./src/assets/*"
"@components/*" → "./src/shared/components/*"
"@routes/*"     → "./src/routes/*"
"@utils/*"      → "./src/shared/utils/*"
"@hoc/*"        → "./src/shared/hoc/*"
"@hooks/*"      → "./src/shared/hooks/*"
"@/*"           → "./src/*"
```

### Import Examples

```typescript
// ✅ Good - Use path aliases
import { cn } from "@utils/classnames";
import { CustomButton } from "@components/accessories/button";
import logo from "@assets/evaLogo.png";

// ❌ Avoid - Relative paths for shared code
import { cn } from "../../shared/utils/classnames";
```

### Import Order

1. React and core libraries
2. Third-party libraries
3. Internal imports (using aliases)
4. Types (if separate import needed)
5. Styles (if separate CSS file)

---

## Code Organization

### Function Organization

Within a component, organize code in this order:

1. **Hooks** (useState, useEffect, etc.)
2. **Derived State** (useMemo, useCallback)
3. **Event Handlers**
4. **Helper Functions**
5. **Render Logic**

### Component Exports

1. **Default Export**: For single component files
   ```typescript
   export default DatePickerDropdown;
   ```

2. **Named Export**: For multiple exports or when importing elsewhere
   ```typescript
   export { CustomButton };
   export function ServiceOne() { ... }
   ```

### Comments

1. **Use comments sparingly** - Code should be self-documenting
2. **TODO comments**: Use `// TODO` for future work
   ```typescript
   // TODO: Work on this the routing doesn't make sense
   ```

3. **Interface documentation**: Add JSDoc for complex interfaces if needed

---

## Linting & Formatting

### Biome Configuration

The project uses Biome for linting and formatting:

1. **Indentation**: 2 spaces
2. **Line Width**: 120 characters
3. **Quote Style**: Double quotes for JavaScript/TypeScript
4. **Semicolons**: Not required (Biome default)

### Code Style Rules

1. **No `any` types**: Avoid `any`, use proper types
   ```typescript
   // ❌ Avoid
   const data: any = { ... };
   
   // ✅ Good
   interface Data { ... }
   const data: Data = { ... };
   ```

2. **No unused variables**: Remove unused imports and variables

3. **Consistent formatting**: Let Biome auto-format on save

4. **ESLint Disable**: Only when necessary, with explanation
   ```typescript
   /* eslint-disable */ console.log(...);
   ```

---

## Best Practices

### React Patterns

1. **Hooks**: Always use hooks at the top level, not conditionally
2. **Keys**: Always provide keys for list items
   ```typescript
   {items.map((item) => (
     <div key={item.id}>...</div>
   ))}
   ```

3. **Event Handlers**: Use arrow functions or useCallback for handlers
4. **Props Destructuring**: Destructure props in function signature
   ```typescript
   const Component: React.FC<Props> = ({ prop1, prop2 }) => { ... }
   ```

### Type Safety

1. **Always type props**: Never use untyped props
2. **Use interfaces**: Prefer interfaces over types for object shapes
3. **Type guards**: Use type guards for runtime type checking when needed

### Performance

1. **Memoization**: Use `useMemo` and `useCallback` for expensive computations
2. **Lazy loading**: Consider code splitting for large components
3. **Image optimization**: Optimize images in assets folder

### Error Handling

1. **Error boundaries**: Use error boundaries for route-level error handling
2. **Try-catch**: Use try-catch for async operations
3. **User feedback**: Always provide user feedback for errors

---

## Common Patterns

### Modal Pattern

```typescript
const [isModalOpen, setIsModalOpen] = useState(false);

const handleOpen = () => setIsModalOpen(true);
const handleClose = () => setIsModalOpen(false);

return (
  <>
    <button onClick={handleOpen}>Open</button>
    {isModalOpen && (
      <Modal onClose={handleClose}>
        {/* Modal content */}
      </Modal>
    )}
  </>
);
```

### Form Pattern

```typescript
const [formData, setFormData] = useState({
  field1: "",
  field2: "",
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Submit logic
};
```

### Navigation Pattern

```typescript
import { useNavigate } from "@tanstack/react-router";

const navigate = useNavigate();

const handleNavigation = (path: string) => {
  navigate({ to: path });
};
```

---

## Additional Notes

1. **PWA Support**: The project includes PWA configuration via Vite PWA plugin
2. **Storybook**: Storybook is configured for component development
3. **Testing**: Vitest is configured for testing
4. **Console Ninja**: The project includes Console Ninja for debugging (see signin.tsx for examples)

---

## Quick Reference

### File Naming
- Components: `kebab-case.tsx`
- Routes: `kebab-case.tsx` (matching route path)
- Utilities: `kebab-case.ts`

### Naming
- Components: `PascalCase`
- Variables/Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE` (true constants) or `camelCase`
- Props Interfaces: `ComponentNameProps`

### Imports
- Use path aliases: `@components`, `@utils`, `@assets`
- Order: React → Third-party → Internal

### Types
- Use `interface` for props and object shapes
- Use `type` for unions, intersections, or type aliases
- Always type function parameters and returns

---

**Last Updated**: Based on codebase analysis as of current date
**Maintainer**: Follow this guide for all code changes

