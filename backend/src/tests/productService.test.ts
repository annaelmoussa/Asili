import { v4 as uuidv4 } from "uuid";
import { Transaction } from "sequelize";
import { IProduct, ProductCreationParams } from "../interfaces/IProduct";
import { ProductService } from "../services/productService";
import { sequelize } from "../config/dbConfigPostgres";

describe("ProductService", () => {
  let productService: ProductService;
  let transaction: Transaction;

  beforeAll(() => {
    productService = new ProductService(sequelize);
  });

  beforeEach(async () => {
    transaction = await sequelize.transaction();
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  const createTestProduct = async (name: string = "Test Product"): Promise<IProduct> => {
    const productCreationParams: ProductCreationParams = {
      name,
      description: `Description for ${name}`,
      price: 10,
      category: "Test Category",
      stock: 100,
    };
    return await productService.create(productCreationParams, { transaction });
  };

  it("should create a product", async () => {
    const product = await createTestProduct();
    expect(product).toMatchObject({
      name: "Test Product",
      description: "Description for Test Product",
      price: 10,
      category: "Test Category",
      stock: 100,
    });
    expect(product.id).toBeDefined();
  });

  it("should get all products", async () => {
    await Promise.all([
      createTestProduct("Product 1"),
      createTestProduct("Product 2")
    ]);

    const products = await productService.getAll({ transaction });

    expect(products.length).toBeGreaterThanOrEqual(2);
    expect(products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Product 1" }),
        expect.objectContaining({ name: "Product 2" }),
      ])
    );
  });

  it("should get a product by id", async () => {
    const createdProduct = await createTestProduct();
    const fetchedProduct = await productService.get(createdProduct.id as string, { transaction });

    expect(fetchedProduct).toMatchObject({
      name: "Test Product",
      description: "Description for Test Product",
      price: 10,
      category: "Test Category",
      stock: 100,
    });
  });

  it("should return null for a non-existing product", async () => {
    const nonExistingId = uuidv4();
    const fetchedProduct = await productService.get(nonExistingId, { transaction });
    expect(fetchedProduct).toBeNull();
  });

  it("should update a product", async () => {
    const createdProduct = await createTestProduct();
    const updateParams: Partial<IProduct> = {
      name: "Updated Product",
      price: 15,
    };

    const updatedProduct = await productService.update(
      createdProduct.id as string,
      updateParams,
      { transaction }
    );

    expect(updatedProduct).not.toBeNull();
    if (updatedProduct) {
      expect(updatedProduct.name).toBe(updateParams.name);
      expect(updatedProduct.price).toBe(updateParams.price);
      expect(updatedProduct.id).toBe(createdProduct.id);
    }
  });

  it("should delete a product", async () => {
    const createdProduct = await createTestProduct();
    const deleteResult = await productService.delete(createdProduct.id as string, { transaction });

    expect(deleteResult).toBe(true);

    const fetchedProduct = await productService.get(createdProduct.id as string, { transaction });
    expect(fetchedProduct).toBeNull();
  });
});