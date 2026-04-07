---

##  `part2.md`

```md
# Part 2: Database Design

##  Tables

### Companies
- id (PK)
- name

### Warehouses
- id (PK)
- company_id (FK)
- name

### Products
- id (PK)
- company_id (FK)
- name
- sku (UNIQUE)
- price
- low_stock_threshold

### Inventory
- id (PK)
- product_id (FK)
- warehouse_id (FK)
- quantity
- UNIQUE(product_id, warehouse_id)

### Suppliers
- id (PK)
- name
- contact_email

### Product_Suppliers
- product_id (FK)
- supplier_id (FK)

### Sales
- id (PK)
- product_id
- quantity
- created_at

---

## Relationships

- Company → Warehouses (1:M)
- Product → Inventory (1:M)
- Product ↔ Supplier (M:M)

---

## Missing Requirements

- What defines "recent sales"?
- Multiple suppliers priority?
- Bundle inventory handling?
- Per warehouse threshold?

---

## Design Decisions

- Unique SKU → avoids duplication
- Inventory table → supports multi-warehouse
- Index on product_id → faster queries
