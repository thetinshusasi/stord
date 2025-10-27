import { factory, primaryKey } from "@mswjs/data";
import faker from "faker";
import { rest } from "msw";
import { convertSnakeToCamelCaseRecursive } from "./utils";

// Loosely based on the actual product model
const db = factory({
  product: {
    id: primaryKey(() => faker.datatype.uuid()),
    network_id: () => "cool-network-1",
    type: String,
    sku: String,
    name: String,
    upc: String,
    description: String,
    primary_unit: String,
    status: String,
    version: Number,
    created_at: () => new Date().toString(),
    updated_at: () => new Date().toString(),
  },
});

// Persistence utilities
const STORAGE_KEY = "msw-products-db";

const saveToStorage = () => {
  try {
    const allProducts = db.product.findMany({});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProducts));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
};

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const products = JSON.parse(stored);
      // Clear existing data and load from storage
      const existingProducts = db.product.findMany({});
      existingProducts.forEach((product: any) => {
        db.product.delete({
          where: {
            id: {
              equals: product.id,
            },
          },
        });
      });
      products.forEach((product: any) => {
        db.product.create(product);
      });
      return true;
    }
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
  }
  return false;
};

// Load data from storage on initialization
const hasLoadedFromStorage = loadFromStorage();

const types = ["Kit", "Order"];

const createProductData = (version: 1 | 2, index: number) => {
  const date = faker.date.past().toISOString();
  return {
    id: faker.random.uuid(),
    type: faker.random.arrayElement(types),
    sku: `sku-${index}`,
    name: faker.commerce.productName(),
    upc: faker.random.alphaNumeric(12),
    description: faker.lorem.lines(1),
    primary_unit: "ea",
    version,
    created_at: date,
    updated_at: date,
  };
};

// Only create seed data if we haven't loaded from storage
if (!hasLoadedFromStorage) {
  [...new Array(50)].forEach((_, i) =>
    db.product.create(createProductData(1, i))
  );
  [...new Array(50)].forEach((_, i) =>
    db.product.create(createProductData(2, i))
  );
  // Save initial seed data
  saveToStorage();
}

export const handlers = [
  rest.get("/v1/products?page=2", (req, res, ctx) => {
    const page = (req.url.searchParams.get("page") || 1) as number;
    const per_page = (req.url.searchParams.get("per_page") || 10) as number;
    const data = db.product
      .findMany({
        take: per_page,
        skip: Math.max(per_page * (page - 1), 0),
        where: {
          version: {
            equals: 1,
          },
        },
      })
      .map(convertSnakeToCamelCaseRecursive);

    return res(
      ctx.json({
        data,
        page,
        total_pages: Math.ceil(db.product.count() / per_page),
        total: db.product.count(),
      }),
      ctx.delay(300)
    );
  }),

  rest.get("/products", (req, res, ctx) => {
    // Force error for testing - change this back to 0.3 for normal behavior
    if (Math.random() < 0.3) {
      return res(
        ctx.json({ message: "Oh no, there was a random server error" }),
        ctx.status(500)
      );
    }

    const page = (req.url.searchParams.get("page") || 1) as number;
    const per_page = (req.url.searchParams.get("per_page") || 10) as number;

    // Count only v2 products for accurate pagination
    const v2ProductCount = db.product.count({
      where: {
        version: {
          equals: 2,
        },
      },
    });

    const data = db.product
      .findMany({
        take: per_page,
        skip: Math.max(per_page * (page - 1), 0),
        where: {
          version: {
            equals: 2,
          },
        },
      })
      .map(convertSnakeToCamelCaseRecursive);

    return res(
      ctx.json({
        data,
        page,
        total_pages: Math.ceil(v2ProductCount / per_page),
        total: v2ProductCount,
      }),
      ctx.delay(300)
    );
  }),

  rest.post<{
    sku: string;
    name: string;
    primary_unit: string;
    description?: string;
    upc?: string;
  }>("/products", (req, res, ctx) => {
    const requiredFields = ["sku", "name", "primary_unit"] as const;
    let errors = [];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        errors.push({ field, message: "This field is required" });
      }
    }

    if (errors.length) {
      return res(ctx.json({ errors }), ctx.status(400, "Validation Errors"));
    }

    if (Math.random() < 0.3) {
      return res(
        ctx.json({ message: "Oh no, there was a random server error" }),
        ctx.status(500)
      );
    }

    // Create product with all provided fields
    const productData = {
      sku: req.body.sku,
      name: req.body.name,
      primary_unit: req.body.primary_unit,
      description: req.body.description || "",
      upc: req.body.upc || "",
      type: "Kit", // Default type
      status: "active", // Default status
      version: 2, // Default to v2
      network_id: "cool-network-1",
    };

    const newProduct = db.product.create(productData);
    saveToStorage(); // Persist changes
    return res(ctx.json(newProduct));
  }),

  rest.delete("/products/:id", (req, res, ctx) => {
    const { id } = req.params;

    if (Math.random() < 0.3) {
      return res(
        ctx.json({ message: "Oh no, there was a random server error" }),
        ctx.status(500)
      );
    }

    const product = db.product.findFirst({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    if (!product) {
      return res(ctx.json({ message: "Product not found" }), ctx.status(404));
    }

    db.product.delete({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    saveToStorage(); // Persist changes
    return res(ctx.json({ message: "Product deleted successfully" }));
  }),

  ...db.product.toHandlers("rest"),
] as const;
