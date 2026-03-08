# UI Engine Project Context

## 1. Goal

The UI Engine is being reorganized into isolated components with explicit boundaries:

- shared engine infrastructure for cross-cutting concerns
- local component services for internal state and reads
- component APIs centered around use-cases
- strict model ownership per domain

This is no longer a `catalog`-only refactor. `catalog` and `workspace` already follow the new direction. The next architectural target is `graph-document`.

## 2. Current Structure

### Model

Model lives under:

- `apps/web/src/shared/infrastructure/ui-engine/model`

Current major model areas:

- `core`
    - generic `Result` / `Issue` / `UseCase` types
    - entity timestamps
    - component/shared service context types
- `catalog`
    - catalog document
    - libraries
    - items
    - item modules
    - refs / validation
    - bundle export/import model
- `workspace`
    - `Workspace`
    - `WorkspaceTabSession`
    - `WorkspaceTabDocument`
- `graph-document`
    - `GraphDocument`
    - `GraphDocumentSnapshot`
    - snapshot payload: `contentJson`, `viewport`, `extensions`
- `events`, `visual`, `nodes-spec`, `node-kind`
    - shared engine-level supporting model

### Components

Components live under:

- `apps/web/src/shared/infrastructure/ui-engine/components`

Current component state:

- `catalog`
    - migrated to local services + component use-cases
- `workspace`
    - migrated to local services + component use-cases
- `graph-runtime`
    - still a legacy integration area around the runtime/graph layer
    - not yet split into a dedicated `graph-document` component

## 3. Component Status

### Catalog

Structure:

- `services`
    - `state`
    - `query`
    - `factory`
    - `validation`
    - `io`
- `use-cases`
    - `initCatalog`
    - `createLibrary`
    - `createItem`
    - `updateItem`
    - `deleteItem`
    - `deleteLibrary`
    - `importLibrary`
    - `importBundle`
    - `exportLibrary`
    - `exportBundle`
    - `exportCatalog`

`createCatalog()` builds the service graph first, then builds use-cases on top of it.

### Workspace

Structure:

- `services`
    - `state`
    - `query`
    - `factory`
- `helpers`
    - shared tree traversal helpers used by both state and use-cases
- `use-cases`
    - `createTab`
    - `open`
    - `closeTab`
    - `exportTab`
    - `importTab`
    - `updateTitle`

Important boundary:

- `workspace` does not own graph snapshot data anymore
- `WorkspaceTabDocument` contains only:
    - `session`
    - `workspaces`
- graph snapshot payload belongs to `graph-document`, not to `workspace`

`createWorkspace()` follows the same pattern as `catalog`: build local services, then build use-cases on top.

### Graph Document

Current state:

- model exists
- component does not exist yet

Expected ownership:

- one graph document per `workspaceId`
- graph snapshot persistence/import/export
- patch/update operations for `contentJson` / `viewport` / `extensions`

## 4. Architectural Rules

### Boundaries

- components should not directly mutate each other
- cross-component coordination must happen through:
    - public component APIs
    - shared services
    - higher-level orchestration use-cases

### Public API shape

- `query` is public read access
- writes and user actions should go through use-cases
- local services are implementation details of the component

### Ownership split

- `catalog` owns catalog documents and item/library semantics
- `workspace` owns tab tree and tab session semantics
- `graph-document` owns graph snapshot semantics

### Import / export rule

- `workspace.exportTab/importTab` are component-local operations
- full tab import/export across `workspace` + `graph-document` belongs to a higher-level use-case layer, not to `workspace` alone

## 5. Current Priority

The next correct step is:

1. build a dedicated `graph-document` component
2. give it the same shape:
    - `state`
    - `query`
    - `factory`
    - `use-cases`
3. only after that add higher-level tab bundle import/export that orchestrates multiple components

## 6. Working Commands

From repo root:

- `pnpm --filter web test`
- `pnpm --filter web build`

## 7. Notes

- Do not reintroduce snapshot fields into `workspace`.
- Do not bypass component boundaries by reading internal stores from another component.
- Keep `catalog` and `workspace` structurally aligned where the domains are analogous.
- Prefer deleting obsolete legacy paths instead of carrying temporary adapters.
