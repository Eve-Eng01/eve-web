# Forms Architecture Documentation

## Overview

This document outlines the scalable form system built with **React Hook Form** and **Yup** for the Eve Web application. The architecture provides reusable components, type-safe validation, and efficient error handling.

## Architecture Components

### 1. Validation Schemas (`src/shared/forms/schemas/`)

#### Structure
- **Organized by feature**: Each feature has its own schema file (e.g., `auth.schema.ts`)
- **Common rules**: Reusable validation rules in `commonRules` object
- **Type inference**: Automatic TypeScript types from Yup schemas

#### Example Schema
```typescript
export const loginSchema = yup.object().shape({
  email: commonRules.email,
  password: yup.string().required("Password is required"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
```

#### Available Schemas
- `loginSchema` - Login form validation
- `signUpSchema` - Sign up form validation
- `verifyOtpSchema` - OTP verification
- `resendOtpSchema` - Resend OTP
- `forgotPasswordSchema` - Forgot password
- `resetPasswordSchema` - Reset password with confirmation

### 2. Form Components (`src/shared/forms/components/`)

#### FormInput
Reusable input component with:
- React Hook Form integration
- Icon support (left/right positioning)
- Error display
- Accessibility (ARIA attributes)
- Customizable styling

**Props:**
```typescript
interface FormInputProps<T> {
  name: Path<T>;
  label?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  // ... more props
}
```

#### FormTextarea
Textarea component with same features as FormInput.

#### FormSelect
Select dropdown component with:
- Option support
- Placeholder support
- Error handling
- Accessibility

#### FormError
Reusable error display component for:
- Form-level errors
- API errors
- Validation errors

### 3. Form Utilities (`src/shared/forms/utils/`)

#### formUtils.ts
Helper functions:
- `getFirstError()` - Get first error message
- `hasFormErrors()` - Check if form has errors
- `getAllErrors()` - Get all error messages
- `formatFieldName()` - Format field names for display

### 4. Form Hooks (`src/shared/forms/hooks/`)

#### useFormError
Custom hook for error handling:
```typescript
const { displayError, hasErrors, isSubmitting } = useFormError({
  form,
  apiError: mutation.error?.message,
});
```

## Usage Examples

### Basic Form Setup
```typescript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput, FormError, useFormError } from "@/shared/forms";
import { loginSchema, type LoginFormData } from "@/shared/forms/schemas";

function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  const { displayError } = useFormError({
    form,
    apiError: mutation.error?.message,
  });

  const onSubmit = async (data: LoginFormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        name="email"
        label="Email"
        type="email"
        register={register}
        error={errors.email}
        required
      />
      
      <FormInput
        name="password"
        label="Password"
        type="password"
        register={register}
        error={errors.password}
        required
      />

      {displayError && <FormError error={displayError} />}

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

### With Icons
```typescript
<FormInput
  name="email"
  label="Email"
  register={register}
  error={errors.email}
  icon={<Sms size="24" color="#BFBFBF" variant="Outline" />}
  iconPosition="left"
/>
```

### Custom Styling
```typescript
<FormInput
  name="email"
  register={register}
  error={errors.email}
  className="custom-wrapper"
  inputClassName="custom-input"
  errorClassName="custom-error"
/>
```

## File Structure

```
src/shared/forms/
├── schemas/
│   ├── auth.schema.ts      # Auth form schemas
│   └── index.ts            # Schema exports
├── components/
│   ├── FormInput.tsx       # Input component
│   ├── FormTextarea.tsx    # Textarea component
│   ├── FormSelect.tsx      # Select component
│   ├── FormError.tsx       # Error display
│   └── index.ts            # Component exports
├── hooks/
│   ├── useFormError.ts     # Error handling hook
│   └── index.ts            # Hook exports
├── utils/
│   └── formUtils.ts        # Utility functions
└── index.ts                # Main exports
```

## Best Practices

### 1. Schema Organization
- Group schemas by feature/domain
- Extract common validation rules
- Use TypeScript type inference

### 2. Component Reusability
- Use FormInput, FormTextarea, FormSelect for all forms
- Customize via props, not by creating new components
- Maintain consistent styling via className props

### 3. Error Handling
- Use `useFormError` hook for consistent error handling
- Display field-level errors inline
- Display form-level/API errors at form level

### 4. Validation Modes
- Use `mode: "onBlur"` for better UX (validates after user leaves field)
- Use `mode: "onChange"` for real-time validation (if needed)
- Use `mode: "onSubmit"` for minimal validation (default)

### 5. Type Safety
- Always use TypeScript types from schemas
- Use `yup.InferType<typeof schema>` for automatic types
- Type form data properly

## Scalability Considerations

### Adding New Form Fields
1. Add validation rule to schema
2. Add field to form using appropriate component
3. Type is automatically inferred

### Adding New Form Types
1. Create new schema file in `schemas/`
2. Export schema and types
3. Use existing components

### Custom Validation
```typescript
// In schema file
export const customSchema = yup.object().shape({
  field: yup
    .string()
    .required()
    .test("custom-rule", "Custom error", (value) => {
      // Custom validation logic
      return true;
    }),
});
```

### Async Validation
```typescript
const form = useForm({
  resolver: yupResolver(schema),
  mode: "onBlur",
  // Async validation handled by TanStack Query mutations
});
```

## Integration with API Layer

Forms integrate seamlessly with the API layer:

```typescript
const mutation = useLogin();

const onSubmit = async (data: LoginFormData) => {
  try {
    await mutation.mutateAsync(data);
    // Success handled by mutation hook
  } catch (error) {
    // Error handled by useFormError hook
  }
};
```

## Accessibility Features

- **ARIA attributes**: All form components include proper ARIA attributes
- **Error associations**: Errors are associated with inputs via `aria-describedby`
- **Required indicators**: Visual and semantic required field indicators
- **Keyboard navigation**: Full keyboard support

## Performance Optimizations

- **Minimal re-renders**: React Hook Form minimizes re-renders
- **Lazy validation**: Validation only when needed
- **Type-safe**: TypeScript prevents runtime errors
- **Reusable components**: Reduces bundle size

## Testing Considerations

1. **Schema Testing**: Test validation rules independently
2. **Component Testing**: Test form components in isolation
3. **Integration Testing**: Test form submission flow
4. **Error Handling**: Test error display and handling

## Future Enhancements

1. **Form Wizard**: Multi-step form support
2. **Field Dependencies**: Conditional field validation
3. **Async Field Validation**: Real-time field validation
4. **Form Templates**: Pre-built form templates
5. **Auto-save**: Draft saving functionality


