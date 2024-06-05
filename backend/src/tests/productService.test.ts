import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../config/dbConfigPostgres";
import { IProduct } from "../interfaces/IProduct";
import { ProductService } from "../services/productService";

const productService = new ProductService();

describe("ProductService", () => {
  let transaction: any;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    transaction = await sequelize.transaction();
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it("should create a product", async () => {
    const productCreationParams: IProduct = {
      name: "Test Product",
      description: "Test Description",
      price: 10,
      category: "Test Category",
      stock: 100,
    };

    const product = await productService.create(productCreationParams, {
      transaction,
    });

    expect(product).toMatchObject(productCreationParams);
    expect(product.id).toBeDefined();
  });

  it("should get all products", async () => {
    const product1: IProduct = {
      name: "Product 1",
      description: "Description 1",
      price: 10,
      category: "Category 1",
      stock: 100,
    };
    const product2: IProduct = {
      name: "Product 2",
      description: "Description 2",
      price: 15,
      category: "Category 2",
      stock: 150,
    };

    await productService.create(product1, { transaction });
    await productService.create(product2, { transaction });

    const products = await productService.getAll({ transaction });

    expect(products.length).toBe(2);
    expect(products).toEqual(
      expect.arrayContaining([
        expect.objectContaining(product1),
        expect.objectContaining(product2),
      ])
    );
  });

  it("should get a product by id", async () => {
    const productCreationParams: IProduct = {
      name: "Product 3",
      description: "Description 3",
      price: 20,
      category: "Category 3",
      stock: 200,
    };

    const createdProduct = await productService.create(productCreationParams, {
      transaction,
    });
    const fetchedProduct = await productService.get(
      createdProduct.id as string,
      { transaction }
    );

    expect(fetchedProduct).toMatchObject(productCreationParams);
  });

  it("should return null for a non-existing product", async () => {
    const nonExistingId = uuidv4();
    const fetchedProduct = await productService.get(nonExistingId, {
      transaction,
    });
    expect(fetchedProduct).toBeNull();
  });
});
