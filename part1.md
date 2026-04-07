# Part 1: Code Review & Debugging

## Issues Identified

### 1. Syntax Errors

- Incorrect quotes
- Missing commas

### 2. No Input Validation

- Required fields not validated

### 3. SKU Not Unique

- No check for duplicate SKU

### 4. No Transaction Handling

- Product & inventory saved separately

### 5. Single Warehouse Limitation

- Violates multi-warehouse requirement

### 6. No Error Handling

- No try/catch block

---

## Impact

- App crashes on invalid input
- Duplicate products
- Data inconsistency
- Production failures

---

## Fixed Code (Flask with Explanation)

```python
@app.route("/api/products", methods=["POST"])
def create_product():
    data = request.get_json()

    try:
        #  1. Input Validation
        # Ensure required fields are present
        if "name" not in data or "sku" not in data:
            return {"error": "Missing required fields: name, sku"}, 400

        # 2. SKU Uniqueness Check
        # Prevent duplicate products with same SKU
        existing = Product.query.filter_by(sku=data["sku"]).first()
        if existing:
            return {"error": "SKU already exists"}, 400

        # 3. Create Product Object
        # Use default price if not provided
        product = Product(
            name=data["name"],
            sku=data["sku"],
            price=data.get("price", 0)
        )

        # Add product to session
        db.session.add(product)

        # 4. Flush to get product ID before commit
        # Needed for creating related inventory record
        db.session.flush()

        # 5. Optional Inventory Creation
        # Supports multi-warehouse scenario (initial warehouse optional)
        if "warehouse_id" in data:
            inventory = Inventory(
                product_id=product.id,
                warehouse_id=data["warehouse_id"],
                quantity=data.get("initial_quantity", 0)
            )
            db.session.add(inventory)

        # 6. Single Transaction Commit
        # Ensures both product and inventory are saved together
        db.session.commit()

        return {
            "message": "Product created successfully",
            "id": product.id
        }, 201

    except Exception as e:
        # 7. Rollback on Failure
        # Prevents partial data save (data inconsistency)
        db.session.rollback()

        # Log error (important for debugging in production)
        print("Error creating product:", str(e))

        return {"error": "Internal server error"}, 500
```
