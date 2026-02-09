# Data Model: Proto Source Templates

This feature modifies file-based assets (no database entities). The "data model" consists of the template file structure and the generated project file structure.

## Template Files (init package source)

### Before (current)

```
src/templates/
├── docusaurus.config.ts
├── favicon.ico
├── landing_page.js
├── landing_page.module.css
├── logo.png
└── proto_workspace.json          ← 67KB pre-built JSON descriptor (REMOVED)
```

### After (new)

```
src/templates/
├── docusaurus.config.ts
├── favicon.ico
├── landing_page.js
├── landing_page.module.css
├── logo.png
└── proto/                         ← NEW: proto source directory tree
    └── protobuffet/example/
        ├── ad/v1/ads.proto
        ├── carts/v1/carts.proto
        ├── checkout/v1/checkout.proto
        ├── common/types/v1/money.proto
        ├── currency/v1/currency.proto
        ├── payment/v1/payment.proto
        ├── productcatalog/v1/productcatalog.proto
        ├── recommendations/v1/recommendations.proto
        └── shipping/v1/shipping.proto
```

## Generated Project Structure (output of init CLI)

### Before (current)

```
<siteName>/
├── fixtures/
│   └── proto_workspace.json      ← copied from template
├── protodocs/                    ← generated MDX files
└── ...
```

### After (new)

```
<siteName>/
├── proto/                         ← NEW: copied from template
│   └── protobuffet/example/...
├── fixtures/
│   └── proto_workspace.json      ← generated at init time via Docker
├── protodocs/                    ← generated MDX files
└── ...
```

## Proto File Cross-References

Several proto files import types from other proto files in the workspace:

| Proto File | Imports |
|------------|---------|
| ads.proto | (none) |
| carts.proto | (none) |
| checkout.proto | carts.proto (CartItem), money.proto (Money), shipping.proto (Address), payment.proto (CreditCardInfo) |
| money.proto | (none) |
| currency.proto | money.proto (Money) |
| payment.proto | money.proto (Money) |
| productcatalog.proto | money.proto (Money) |
| recommendations.proto | (none) |
| shipping.proto | carts.proto (CartItem), money.proto (Money) |
