# Project Code Style Rules

You must follow these rules for all code generated in this project.

## Main Goal

This project must follow a clean frontend architecture using:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- MVVM
- Fake data only
- Clean layer separation

The project must be easy to read, easy to scale, and easy to maintain.

## General Rules

- Do not write comments in the code unless I explicitly ask for comments.
- Use TypeScript only.
- Do not use `any`.
- Do not use `unknown`.
- Use strict and clear types.
- Do not ignore TypeScript errors.
- Do not create unnecessary files.
- Do not create unnecessary abstractions.
- Keep each file small and focused.
- Use clean and readable naming.
- Use fake data only.
- Do not create a real backend.
- Do not connect to a real database.
- Do not use API routes unless I explicitly ask.
- Do not put fake data inside UI components.
- Do not put fake data inside ViewModels.
- Handle loading states.
- Handle error states.
- Handle empty states.
- Keep business logic outside the UI.
- Keep domain logic pure TypeScript.
- Follow MVVM architecture.

## Styling Rules

- Use Tailwind CSS for styling.
- Use shadcn/ui components whenever possible.
- Do not create a custom component when shadcn/ui already provides a suitable one.
- Use modern, clean, professional UI.
- Use responsive design for mobile, tablet, and desktop.
- Use consistent spacing.
- Use consistent typography.
- Use consistent colors.
- Use accessible UI patterns.
- Use semantic HTML where possible.
- Do not use inline styles unless necessary.
- Do not use CSS modules unless I explicitly ask.

## shadcn/ui Rules

Use shadcn/ui components for common UI elements.

Preferred components:

- `Button`
- `Card`
- `Input`
- `Label`
- `Textarea`
- `Dialog`
- `Sheet`
- `Table`
- `Badge`
- `Tabs`
- `Select`
- `DropdownMenu`
- `Form`
- `Alert`
- `Avatar`
- `Separator`
- `Skeleton`

Rules:

- Use shadcn/ui components for reusable UI patterns.
- Keep shadcn/ui components in the normal `components/ui` folder.
- Do not rewrite shadcn/ui components manually.
- Customize shadcn/ui components using Tailwind classes.
- Use `cn()` utility when merging class names.

## Architecture Rules

The project must follow this structure:

```txt
src/
  app/
  presentation/
  domain/
  data/
  lib/
```

The main layers are:

```txt
app/
presentation/
domain/
data/
```

The dependency direction must be:

```txt
app -> presentation -> domain <- data
```

MVVM flow must be:

```txt
UI Component -> ViewModel -> Use Case -> Repository Interface -> Repository Implementation -> Fake Data
```

## App Folder Rules

The `app` folder is only for Next.js routing and app setup.

Allowed inside `app`:

- Pages
- Layouts
- Route groups
- Metadata
- Global providers
- Loading pages
- Error pages
- Not found pages

The `app` folder must not contain:

- Business logic
- Fake data
- Repository implementations
- Use cases
- Complex UI logic
- Data fetching simulation logic

Example:

```txt
app/
  layout.tsx
  page.tsx
  books/
    page.tsx
```

A page inside `app` should only connect to a screen from the presentation layer.

Example:

```tsx
import { BooksScreen } from "@/presentation/screens/books/BooksScreen";

export default function BooksPage() {
  return <BooksScreen />;
}
```

## Presentation Layer Rules

The `presentation` layer is responsible for everything related to the UI.

Allowed inside `presentation`:

- Screens
- Components
- ViewModels
- UI hooks
- UI-only helpers

Allowed folders inside `presentation`:

- `components`
- `screens`
- `viewmodels`
- `hooks`
- `helpers`

Do not create any other folder inside `presentation` unless I explicitly ask for that exact folder.

The `presentation` layer must not contain:

- Fake data
- Business rules
- Repository implementations
- API simulation logic
- Domain entities duplicated as UI types
- A general `types` folder

Important rule:

```txt
Do not create a `types` folder inside the presentation layer.
```

Good structure:

```txt
presentation/
  components/
  screens/
  viewmodels/
```

Bad structure:

```txt
presentation/
  components/
  screens/
  viewmodels/
  types/
```

## Presentation Type Rules

Do not create a shared `types` folder inside `presentation`.

Business types must be placed in:

```txt
domain/entities/
```

UI-only types must be placed near the file that uses them.

Good example:

```txt
presentation/
  viewmodels/
    useBooksViewModel.ts
```

Inside the ViewModel file:

```tsx
type BooksViewModelState = {
  searchQuery: string;
  selectedCategoryId: string | null;
  isDialogOpen: boolean;
};
```

This is good because the type is only used by that ViewModel.

Bad example:

```txt
presentation/
  types/
    BooksViewModelState.ts
```

Do not do this unless I explicitly ask.

## UI Component Rules

UI components must be clean and simple.

Rules:

- UI components should only display data.
- UI components should call callbacks from the ViewModel.
- UI components must not contain business logic.
- UI components must not access fake data directly.
- UI components must not call repositories directly.
- UI components must not call use cases directly.
- UI components must not contain complex filtering logic.
- UI components must not contain complex validation logic.
- Keep JSX readable.
- Split large UI into smaller components.

Good UI component behavior:

```txt
Receive data -> Display data -> Trigger callback
```

Bad UI component behavior:

```txt
Load fake data -> Filter data -> Apply business rules -> Display data
```

## Screen Rules

Screens are page-level UI components inside the presentation layer.

Screens are responsible for:

- Calling the ViewModel
- Passing state to components
- Showing loading UI
- Showing error UI
- Showing empty UI
- Showing success UI

Screens must not:

- Contain business logic
- Access fake data directly
- Create repository instances directly
- Duplicate domain logic

Example:

```txt
presentation/
  screens/
    books/
      BooksScreen.tsx
```

## ViewModel Rules

ViewModels are responsible for UI state and UI actions.

ViewModels can:

- Store UI state
- Expose state to screens
- Handle user actions
- Call domain use cases
- Convert domain result to UI state
- Manage loading state
- Manage error state
- Manage empty state

ViewModels must not:

- Contain JSX
- Import shadcn/ui
- Import Tailwind classes
- Access fake data directly
- Implement business rules that belong in domain
- Implement repository logic

Example:

```txt
presentation/
  viewmodels/
    books/
      useBooksViewModel.ts
```

ViewModel naming:

```txt
useBooksViewModel.ts
useCreateBookViewModel.ts
useBranchesViewModel.ts
```

## Domain Layer Rules

The `domain` layer must be pure TypeScript.

The domain layer is the core of the project.

Allowed inside `domain`:

- Entities
- Schemas
- Use cases
- Repository contracts
- Business rules
- Validators
- Domain services
- Shared result types
- Shared business types

The domain layer must not import:

- React
- Next.js
- Tailwind CSS
- shadcn/ui
- Data layer files
- UI components
- Browser-specific code unless necessary

The domain layer must not know how data is stored or loaded.

Good structure:

```txt
domain/
  entities/
  schemas/
  repositories/
  usecases/
  validators/
  result/
```

## Schema and Type Rules

Shared schemas and shared business types must be placed in the domain layer.

Correct locations:

```txt
domain/entities/
domain/schemas/
domain/validators/
```

Rules:

- Entity types must be placed in `domain/entities`.
- Reusable schema types must be placed in `domain/schemas`.
- Business validation rules must be placed in `domain/validators`.
- Do not create schema folders inside `presentation`.
- Do not create shared type folders inside `presentation`.
- Do not define business schema types inside `app`, `presentation`, or `data`.

## Entity Rules

Entities are the main business objects of the project.

Examples in a library system:

```txt
Book
Branch
User
Role
Sale
Stock
Event
Permission
```

Entities must be placed inside:

```txt
domain/entities/
```

Example:

```tsx
export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  branchId: string;
};
```

Rules:

- Entities must be pure TypeScript types.
- Entities must not import React.
- Entities must not import UI components.
- Entities must not contain Tailwind classes.
- Entities must describe business data.
- Do not duplicate entity types in presentation.
- Do not create presentation types for domain entities.

## Repository Contract Rules

Repository contracts are interfaces inside the domain layer.

They describe what the app can do, not how it is done.

Example:

```tsx
import { Book } from "../entities/Book";
import { Result } from "../result/Result";

export interface BookRepository {
  getBooks(): Promise<Result<Book[]>>;
  getBookById(id: string): Promise<Result<Book>>;
}
```

Rules:

- Repository contracts must be in the domain layer.
- Repository contracts must not use fake data directly.
- Repository contracts must not know about the data layer.
- Repository contracts must return typed results.
- Repository contracts must describe business actions clearly.

Example folder:

```txt
domain/
  repositories/
    BookRepository.ts
```

## Use Case Rules

Use cases contain business actions.

Example use cases:

```txt
GetBooksUseCase
GetBookByIdUseCase
CreateBookUseCase
UpdateStockUseCase
GetBranchesUseCase
```

Rules:

- Use cases must live in the domain layer.
- Use cases must call repository contracts.
- Use cases must contain business logic when needed.
- Use cases must not import React.
- Use cases must not import UI components.
- Use cases must not import fake data.
- Use cases must not import repository implementations.

Example:

```tsx
import { BookRepository } from "../repositories/BookRepository";

export class GetBooksUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  execute() {
    return this.bookRepository.getBooks();
  }
}
```

Auth can use one use case class when the auth actions belong to the same flow.
All auth functions should stay in that one class and call the repository
interface.

Example:

```tsx
import { LoginCredentials } from "@/domain/entities/LoginCredentials";
import { User } from "@/domain/entities/User";
import { AuthRepository } from "@/domain/repositories/AuthRepository";
import { Result } from "@/domain/result/Result";

export class AuthUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  login(credentials: LoginCredentials): Promise<Result<User>> {
    return this.authRepository.login(credentials);
  }

  logout(): Promise<Result<null>> {
    return this.authRepository.logout();
  }

  getCurrentUser(): Promise<Result<User | null>> {
    return this.authRepository.getCurrentUser();
  }
}
```

## Data Layer Rules

The `data` layer is responsible for data implementation.

Allowed inside `data`:

- Fake data
- Repository implementations
- Data sources
- Mappers
- Simulated API calls
- Error simulation
- Loading simulation

The data layer can import from:

```txt
domain/
```

The data layer must not import from:

```txt
presentation/
app/
```

Good structure:

```txt
data/
  fake/
  datasources/
  repositories/
  mappers/
```

## Fake Data Rules

All fake data must be inside the data layer.

Correct location:

```txt
data/fake/
```

Example:

```txt
data/
  fake/
    fakeBooks.ts
    fakeBranches.ts
    fakeUsers.ts
```

Rules:

- Do not place fake data inside UI components.
- Do not place fake data inside ViewModels.
- Do not place fake data inside domain.
- Fake data should be strongly typed.
- Fake data should be realistic.
- Fake data should support the UI requirements.

Example:

```tsx
import { Book } from "@/domain/entities/Book";

export const fakeBooks: Book[] = [
  {
    id: "book-1",
    title: "Clean Architecture",
    author: "Robert C. Martin",
    price: 20,
    stock: 15,
    branchId: "branch-1"
  }
];
```

## Repository Implementation Rules

Repository implementations live in the data layer.

Example:

```txt
data/
  repositories/
    BookRepositoryImpl.ts
```

Rules:

- Repository implementations must implement domain repository contracts.
- Repository implementations can use fake data.
- Repository implementations can simulate loading.
- Repository implementations can simulate errors.
- Repository implementations must return typed results.
- Repository implementations must not return raw untyped data.
- Repository implementations must not import UI components.

Example:

```tsx
import { BookRepository } from "@/domain/repositories/BookRepository";
import { Result } from "@/domain/result/Result";
import { Book } from "@/domain/entities/Book";
import { fakeBooks } from "../fake/fakeBooks";

export class BookRepositoryImpl implements BookRepository {
  async getBooks(): Promise<Result<Book[]>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        data: fakeBooks
      };
    } catch {
      return {
        success: false,
        error: "Failed to load books"
      };
    }
  }
}
```

## Mapper Rules

Use mappers when data shape is different from domain entity shape.

Example:

```txt
data/
  mappers/
    bookMapper.ts
```

Rules:

- Mappers must live in the data layer.
- Mappers convert data models to domain entities.
- Mappers must not contain UI logic.
- Mappers must not import presentation files.

## Result Type Rules

Use typed result objects instead of throwing raw errors everywhere.

Example:

```tsx
export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
```

Place it inside:

```txt
domain/result/Result.ts
```

Rules:

- Use `Result<T>` for repository responses.
- Use friendly error messages.
- Do not expose raw technical errors to the UI.
- Do not use `any`.
- Do not use `unknown`.

## Loading State Rules

Use clear loading states in ViewModels.

Example:

```tsx
type AsyncState<T> =
  | {
      status: "idle";
      data: null;
      error: null;
    }
  | {
      status: "loading";
      data: null;
      error: null;
    }
  | {
      status: "success";
      data: T;
      error: null;
    }
  | {
      status: "error";
      data: null;
      error: string;
    };
```

Rules:

- Show loading UI when data is loading.
- Show error UI when data fails.
- Show empty UI when data is empty.
- Show content UI when data loads successfully.
- Do not hide errors silently.

## Error Handling Rules

- Handle errors in the data layer.
- Convert technical errors into friendly messages.
- ViewModels should expose friendly error messages.
- UI should display the error clearly.
- Do not show raw error objects in UI.
- Do not ignore failed operations.
- Do not use `console.log` for normal error handling unless I explicitly ask.

## Dependency Rules

Allowed dependencies:

```txt
app -> presentation
presentation -> domain
data -> domain
```

Not allowed:

```txt
domain -> data
domain -> presentation
domain -> app
data -> presentation
data -> app
presentation -> data
```

Important:

- Presentation should not directly import repository implementations.
- Presentation should call use cases.
- Use cases should call repository interfaces.
- Data layer should implement repository interfaces.
- Domain must stay independent.

## Import Rules

Use clean imports.

Good:

```tsx
import { Book } from "@/domain/entities/Book";
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase";
```

Avoid deep messy imports when possible.

Bad:

```tsx
import { Book } from "../../../../domain/entities/Book";
```

Rules:

- Use path aliases when available.
- Avoid circular imports.
- Keep imports organized.
- Remove unused imports.

## Naming Rules

Use clear naming.

Components:

```txt
BookCard.tsx
BooksTable.tsx
CreateBookDialog.tsx
```

Screens:

```txt
BooksScreen.tsx
DashboardScreen.tsx
BranchesScreen.tsx
```

ViewModels:

```txt
useBooksViewModel.ts
useDashboardViewModel.ts
useBranchesViewModel.ts
```

Entities:

```txt
Book.ts
Branch.ts
User.ts
Permission.ts
```

Repositories:

```txt
BookRepository.ts
BranchRepository.ts
UserRepository.ts
```

Repository implementations:

```txt
BookRepositoryImpl.ts
BranchRepositoryImpl.ts
UserRepositoryImpl.ts
```

Use cases:

```txt
GetBooksUseCase.ts
CreateBookUseCase.ts
UpdateBookStockUseCase.ts
```

## File Organization Example

Use this structure for features:

```txt
src/
  app/
    books/
      page.tsx

  presentation/
    components/
      books/
        BookCard.tsx
        BooksTable.tsx
        CreateBookDialog.tsx
    screens/
      books/
        BooksScreen.tsx
    viewmodels/
      books/
        useBooksViewModel.ts

  domain/
    entities/
      Book.ts
    repositories/
      BookRepository.ts
    usecases/
      books/
        GetBooksUseCase.ts
        GetBookByIdUseCase.ts
        CreateBookUseCase.ts
    result/
      Result.ts

  data/
    fake/
      fakeBooks.ts
    repositories/
      BookRepositoryImpl.ts
    datasources/
      BookFakeDataSource.ts
    mappers/
      bookMapper.ts

  lib/
    utils.ts
```

## UI Logic Rules

UI can contain simple display logic only.

Allowed in UI:

```txt
Show button
Show card
Show table
Show loading component
Show error message
Show empty state
Call onClick callback
```

Not allowed in UI:

```txt
Filter business data
Calculate business rules
Access fake data
Create repository
Call repository
Validate business rules
Handle data mapping
```

Good:

```tsx
<Button onClick={viewModel.createBook}>Create Book</Button>
```

Bad:

```tsx
<Button onClick={() => fakeBooks.push(newBook)}>Create Book</Button>
```

## Business Logic Rules

Business logic must be inside the domain layer.

Examples of business logic:

- Checking if a book is available
- Checking stock status
- Calculating total price
- Validating permissions
- Checking user role access
- Filtering data based on business rules
- Validating book creation rules

Example:

```tsx
export function canManageBranch(role: UserRole) {
  return role === "super_admin" || role === "branch_admin";
}
```

Place business rules inside:

```txt
domain/
  validators/
  services/
  usecases/
```

## Fake API Simulation Rules

When simulating API behavior:

- Simulate delay in data layer.
- Simulate success in data layer.
- Simulate failure in data layer.
- Return typed result.
- Do not simulate API calls in UI.
- Do not simulate API calls in ViewModel.

Example:

```tsx
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
```

Place it inside:

```txt
data/datasources/
```

or:

```txt
data/utils/
```

## Form Rules

For forms:

- Use shadcn/ui form components when possible.
- Keep form UI inside presentation.
- Keep validation rules in domain when they are business rules.
- ViewModel handles submit action.
- ViewModel calls use case.
- Use clear error messages.

Do not submit fake data directly from the component to fake arrays.

Correct flow:

```txt
Form -> ViewModel submit action -> Use Case -> Repository -> Fake Data Source
```

## Table Rules

For tables:

- Use shadcn/ui `Table`.
- Keep columns readable.
- Use badges for statuses.
- Use buttons for actions.
- Keep row actions clean.
- Do not put business logic inside table cells.

## Dialog Rules

For dialogs:

- Use shadcn/ui `Dialog`.
- Dialog open state should be controlled by ViewModel or local UI state if it is only visual.
- Form submission should go through ViewModel.
- Do not place fake data logic inside dialogs.

## Dashboard Rules

For dashboards:

- Use cards for statistics.
- Use tables for recent records.
- Use badges for statuses.
- Use clean responsive grid layout.
- Dashboard calculations should come from ViewModel or domain use case.
- Do not calculate business statistics directly inside JSX.

## Role and Permission Rules

For projects with roles:

- Define roles in domain entities.
- Define permissions in domain entities or domain services.
- Do not hard-code permission logic inside UI components.
- UI can hide/show elements based on ViewModel state.
- ViewModel should get permission result from domain logic.

Example:

```tsx
export type UserRole = "super_admin" | "branch_admin" | "sub_branch_admin" | "staff";
```

## No Comments Rule

Do not write comments in generated code.

Bad:

```tsx
// This function gets books
function getBooks() {}
```

Good:

```tsx
function getBooks() {}
```

Only write comments if I explicitly ask.

## No any and No unknown Rule

Never use:

```tsx
any
unknown
```

Bad:

```tsx
const data: any = {};
```

Bad:

```tsx
const value: unknown = response;
```

Good:

```tsx
type BookResponse = {
  id: string;
  title: string;
};

const data: BookResponse = {
  id: "1",
  title: "Clean Architecture"
};
```

## Component Props Rules

Always type component props clearly.

Good:

```tsx
type BookCardProps = {
  book: Book;
  onSelect: (bookId: string) => void;
};

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <Card>
      <Button onClick={() => onSelect(book.id)}>Select</Button>
    </Card>
  );
}
```

Bad:

```tsx
export function BookCard(props: any) {
  return <div>{props.book.title}</div>;
}
```

## Function Rules

Functions must have clear input and output types when needed.

Good:

```tsx
function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
```

Bad:

```tsx
function formatPrice(price) {
  return "$" + price;
}
```

## Data Flow Rules

The correct data flow is:

```txt
Fake Data -> Data Source -> Repository Implementation -> Repository Interface -> Use Case -> ViewModel -> Screen -> Component
```

The UI action flow is:

```txt
Component Event -> Screen -> ViewModel Action -> Use Case -> Repository -> Data Source
```

## Testing Rules

When creating tests:

- Test domain use cases.
- Test repository implementations.
- Test ViewModels when needed.
- Do not test shadcn/ui internals.
- Use fake data for tests.
- Test loading state.
- Test success state.
- Test error state.
- Test empty state.

Test names should start with:

```txt
should
```

or:

```txt
when
```

Example:

```tsx
it("should return books when repository succeeds", async () => {});
```

## Final Checklist

Before generating or updating any code, check that the code follows:

- Uses TypeScript
- Uses Tailwind CSS
- Uses shadcn/ui
- Does not use comments
- Does not use `any`
- Does not use `unknown`
- Follows MVVM
- Has `app`, `presentation`, `domain`, and `data`
- Does not create `presentation/types`
- Keeps UI free from business logic
- Keeps fake data only in the data layer
- Keeps domain pure TypeScript
- Handles loading state
- Handles error state
- Handles empty state
- Uses clear names
- Uses strict types
- Keeps files small and focused


## TanStack Query Rules

- TanStack Query must be used only in the presentation layer or app provider setup.
- `QueryClientProvider` must be configured in the app layer or a provider file used by the app layer.
- `useQuery` and `useMutation` must be used inside ViewModels, not directly inside UI components when business flow is involved.
- UI components must not call `useQuery` directly.
- Screens can call ViewModels that use TanStack Query.
- Domain layer must not import TanStack Query.
- Data layer must not import TanStack Query.
- Domain use cases must return promises or typed results.
- TanStack Query query functions should call domain use cases.
- Query keys must be clear and consistent.
- Loading, error, empty, and success states must be exposed from the ViewModel.
- Do not put business logic inside `queryFn`.
- Do not access fake data directly from `queryFn`.
- Fake data must stay inside the data layer.
