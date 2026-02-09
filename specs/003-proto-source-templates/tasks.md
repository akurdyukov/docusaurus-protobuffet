# Tasks: Proto Source Templates

**Input**: Design documents from `/specs/003-proto-source-templates/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: No automated tests requested. Manual verification via `npx lerna run build`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Build system changes needed before proto files can be properly included

- [x] T001 Update `copy-template-fixtures` script in `packages/docusaurus-protobuffet-init/package.json` — change from `copyfiles -f src/templates/* dist/templates/` to `copyfiles -u 2 "src/templates/**/*" dist/templates/`
- [x] T002 Delete `packages/docusaurus-protobuffet-init/src/templates/proto_workspace.json`

---

## Phase 2: User Story 1 - Scaffolded project includes proto source files (Priority: P1)

**Goal**: Replace the pre-built JSON descriptor with 9 reconstructed `.proto` source files organized by protobuf package path.

**Independent Test**: Run `npx lerna run build` and verify `packages/docusaurus-protobuffet-init/dist/templates/proto/protobuffet/example/ad/v1/ads.proto` exists with correct directory structure preserved.

### Implementation for User Story 1

- [x] T003 [P] [US1] Create `packages/docusaurus-protobuffet-init/src/templates/proto/protobuffet/example/common/types/v1/money.proto` — define package `protobuffet.example.common.types.v1` with `Money` message (fields: `currency_code` string, `units` int64, `nanos` int32) with doc comments from JSON descriptor
- [x] T004 [P] [US1] Create `packages/docusaurus-protobuffet-init/src/templates/proto/protobuffet/example/ad/v1/ads.proto` — define package `protobuffet.example.ad.v1` with `AdType` enum (UNKNOWN, FEATURED_PRODUCT, HEADER_PRODUCT, BUY_IT_AGAIN_PRODUCT), messages `Ad`, `AdRequest`, `AdResponse`, and `AdService` service with `GetAds` RPC
- [x] T005 [P] [US1] Create `packages/docusaurus-protobuffet-init/src/templates/proto/protobuffet/example/carts/v1/carts.proto` — define package `protobuffet.example.carts.v1` with messages `CartItem`, `Cart`, `AddItemRequest`, `GetCartRequest`, `EmptyCartRequest`, `Empty`, and `CartService` service with `AddItem`, `GetCart`, `EmptyCart` RPCs
- [x] T006 [P] [US1] Create `packages/docusaurus-protobuffet-init/src/templates/proto/protobuffet/example/currency/v1/currency.proto` — define package `protobuffet.example.currency.v1`, import `money.proto`, with messages `CurrencyConversionRequest` (field `from` of type `Money`), `Empty`, `GetSupportedCurrenciesResponse`, and `CurrencyService` service with `GetSupportedCurrencies`, `Convert` RPCs
- [x] T007 [P] [US1] Create `packages/docusaurus-protobuffet-init/src/templates/proto/protobuffet/example/payment/v1/payment.proto` — define package `protobuffet.example.payment.v1`, import `money.proto`, with messages `CreditCardInfo`, `ChargeRequest` (fields `amount` Money, `credit_card` CreditCardInfo), `ChargeResponse`, and `PaymentService` service with `Charge` RPC
- [x] T008 [P] [US1] Create `packages/docusaurus-protobuffet-init/src/templates/proto/protobuffet/example/productcatalog/v1/productcatalog.proto` — define package `protobuffet.example.productcatalog.v1`, import `money.proto`, with messages `Product` (fields include `price_usd` Money), `Empty`, `GetProductRequest`, `ListProductsResponse`, `SearchProductsRequest`, `SearchProductsResponse`, and `ProductCatalogService` service with `ListProducts`, `GetProduct`, `SearchProducts` RPCs
- [x] T009 [P] [US1] Create `packages/docusaurus-protobuffet-init/src/templates/proto/protobuffet/example/recommendations/v1/recommendations.proto` — define package `protobuffet.example.recommendations.v1` with messages `ListRecommendationsRequest`, `ListRecommendationsResponse`, and `RecommendationService` service with `ListRecommendations` RPC
- [x] T010 [P] [US1] Create `packages/docusaurus-protobuffet-init/src/templates/proto/protobuffet/example/shipping/v1/shipping.proto` — define package `protobuffet.example.shipping.v1`, import `carts.proto` and `money.proto`, with messages `Address`, `GetQuoteRequest`, `GetQuoteResponse`, `ShipOrderRequest`, `ShipOrderResponse`, and `ShippingService` service with `GetQuote`, `ShipOrder` RPCs
- [x] T011 [P] [US1] Create `packages/docusaurus-protobuffet-init/src/templates/proto/protobuffet/example/checkout/v1/checkout.proto` — define package `protobuffet.example.checkout.v1`, import `carts.proto`, `money.proto`, `shipping.proto`, and `payment.proto`, with messages `OrderItem`, `OrderResult`, `PlaceOrderRequest`, `PlaceOrderResponse`, and `CheckoutService` service with `PlaceOrder` RPC
- [x] T012 [US1] Run `npx lerna run build` and verify all 9 proto files exist under `packages/docusaurus-protobuffet-init/dist/templates/proto/protobuffet/example/` with correct directory nesting

**Checkpoint**: Proto files are created and build output preserves directory structure. The init package no longer ships proto_workspace.json.

---

## Phase 3: User Story 2 - Generated project can regenerate JSON descriptor (Priority: P1)

**Goal**: Update the init CLI to copy proto files instead of JSON, inject a `generate-proto-json` npm script, and add the `generate-proto-json` step to the init flow.

**Independent Test**: Inspect `packages/docusaurus-protobuffet-init/src/index.ts` for correct flow: copies proto dir, injects npm script, runs generation.

### Implementation for User Story 2

- [x] T013 [US2] Update `packages/docusaurus-protobuffet-init/src/index.ts` — replace `fs.copyFileSync(... 'proto_workspace.json' ...)` with `fs.cpSync(path.resolve(__dirname, 'templates/proto'), siteName + '/proto', { recursive: true })` to copy the proto directory tree into the generated project
- [x] T014 [US2] Update `packages/docusaurus-protobuffet-init/src/index.ts` — after copying templates, add code to read the generated project's `package.json`, parse it with `JSON.parse`, add `"generate-proto-json": "docker run --rm -v $(pwd)/proto:/protos -v $(pwd)/fixtures:/out pseudomuto/protoc-gen-doc --doc_opt=json,proto_workspace.json"` to the `scripts` object, and write it back with `JSON.stringify(pkg, null, 2)`
- [x] T015 [US2] Run `npx lerna run build` to verify the init package compiles successfully with the updated index.ts

**Checkpoint**: The init CLI now copies proto source files and injects the generation script. The generated project's package.json will include the `generate-proto-json` script.

---

## Phase 4: User Story 3 - Init process generates docs from proto sources during setup (Priority: P2)

**Goal**: Wire up the init flow to run `npm run generate-proto-json` (via Docker) before `npx docusaurus generate-proto-docs`.

**Independent Test**: Read the updated `index.ts` and verify the Docker-based generation step is invoked before doc generation. Full end-to-end test requires Docker.

### Implementation for User Story 3

- [x] T016 [US3] Update `packages/docusaurus-protobuffet-init/src/index.ts` — add a new try/catch block that runs `execSync('cd ${siteName} && npm run generate-proto-json', { stdio: 'inherit' })` with a clear error message (`chalk.red('Generation of proto JSON descriptor failed. Is Docker running?')`) before the existing `npx docusaurus generate-proto-docs` step
- [x] T017 [US3] Run `npx lerna run build` to verify final compilation

**Checkpoint**: The full init flow now: creates project, installs deps, copies proto files, injects npm script, generates JSON from protos (Docker), generates Docusaurus docs.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all changes

- [x] T018 Verify `packages/docusaurus-protobuffet-init/src/templates/proto_workspace.json` no longer exists in source or build output
- [x] T019 Run quickstart.md validation — verify build completes with `npx lerna run build` and proto files are present at `dist/templates/proto/protobuffet/example/ad/v1/ads.proto`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion (T001-T002 must complete before T012 build verification)
- **User Story 2 (Phase 3)**: Depends on User Story 1 (proto files must exist for init flow to copy them)
- **User Story 3 (Phase 4)**: Depends on User Story 2 (npm script injection must exist before running it)
- **Polish (Phase 5)**: Depends on all phases complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup. Creates the proto files.
- **User Story 2 (P1)**: Depends on US1. Updates init flow to copy proto files and inject npm script.
- **User Story 3 (P2)**: Depends on US2. Adds the Docker generation step to the init flow.

### Within Each User Story

- T003-T011 (proto file creation) are all parallelizable — different files, no dependencies
- T013-T014 (index.ts changes) are sequential — same file
- T016 (index.ts addition) depends on T013-T014 — same file, builds on prior changes

### Parallel Opportunities

- All 9 proto file creation tasks (T003-T011) can run in parallel
- T001 and T002 can run in parallel (different files)

---

## Parallel Example: User Story 1

```text
# Launch all proto file creation tasks together (all [P]):
Task T003: "Create money.proto"
Task T004: "Create ads.proto"
Task T005: "Create carts.proto"
Task T006: "Create currency.proto"
Task T007: "Create payment.proto"
Task T008: "Create productcatalog.proto"
Task T009: "Create recommendations.proto"
Task T010: "Create shipping.proto"
Task T011: "Create checkout.proto"

# Then sequentially:
Task T012: "Build and verify directory structure"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (update build script, delete JSON)
2. Complete Phase 2: User Story 1 (create 9 proto files)
3. **STOP and VALIDATE**: Run `npx lerna run build`, verify proto files in dist
4. Proto files exist and build works — MVP achieved

### Incremental Delivery

1. Setup → Build script and JSON deletion
2. User Story 1 → Proto files created and building correctly
3. User Story 2 → Init flow updated to copy protos and inject script
4. User Story 3 → Docker generation step wired into init flow
5. Polish → Final verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- User Stories 2 and 3 are NOT independently parallelizable — they build on each other (same file: index.ts)
- All proto file creation tasks (T003-T011) ARE parallelizable
- No automated tests exist — verification is via `npx lerna run build`
- Full end-to-end testing requires Docker running
