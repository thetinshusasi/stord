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
    updated_at: () => new Date().toString()
  }
});

const types = ["Kit", "Order"];

const createProductData = (version: 1 | 2, index: number) => {
  const date = faker.date.past().toISOString();
  return {
    id: faker.random.uuid(),
    type: faker.random.arrayElement(types),
    sku: `sku-${index}`,
    description: faker.lorem.lines(1),
    primary_unit: "ea",
    version,
    created_at: date,
    updated_at: date
  };
};

[...new Array(50)].forEach((_, i) =>
  db.product.create(createProductData(1, i))
);
[...new Array(50)].forEach((_, i) =>
  db.product.create(createProductData(2, i))
);

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
            equals: 1
          }
        }
      })
      .map(convertSnakeToCamelCaseRecursive);

    return res(
      ctx.json({
        data,
        page,
        total_pages: Math.ceil(db.product.count() / per_page),
        total: db.product.count()
      }),
      ctx.delay(300)
    );
  }),

  rest.get("/products", (req, res, ctx) => {
    if (Math.random() < 0.3) {
      return res(
        ctx.json({ message: "Oh no, there was a random server error" }),
        ctx.status(500)
      );
    }

    const page = (req.url.searchParams.get("page") || 1) as number;
    const per_page = (req.url.searchParams.get("per_page") || 10) as number;
    const data = db.product.findMany({
      take: per_page,
      skip: Math.max(per_page * (page - 1), 0),
      where: {
        version: {
          equals: 2
        }
      }
    });

    return res(
      ctx.json({
        data,
        page,
        total_pages: Math.ceil(db.product.count() / per_page),
        total: db.product.count()
      }),
      ctx.delay(300)
    );
  }),

  rest.post<{ sku: string; name: string; primary_unit: string }>(
    "/products",
    (req, res, ctx) => {
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

      return res(ctx.json(db.product.create(req.body)));
    }
  ),
  ...db.product.toHandlers("rest")
] as const;
