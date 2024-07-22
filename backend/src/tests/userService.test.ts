import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../config/dbConfigPostgres";
import { IUser } from "../interfaces/IUser";
import { UserService } from "../services/userService";
import { ALL_SCOPES } from "../config/scopes";

const userService = new UserService();

describe("UserService", () => {
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

  it("should create a user", async () => {
    const userCreationParams: IUser = {
      email: "test@example.com",
      password: "password123",
      role: "ROLE_USER",
    };

    const user = await userService.create(userCreationParams, { transaction });

    expect(user).toMatchObject(userCreationParams);
    expect(user.id).toBeDefined();
  });

  it("should create an admin user with all scopes", async () => {
    const adminUserParams: IUser = {
      email: "admin@example.com",
      password: "adminpass123",
      role: "ROLE_ADMIN",
    };

    const user = await userService.create(adminUserParams, { transaction });

    expect(user).toMatchObject(adminUserParams);
    expect(user.scopes).toEqual(ALL_SCOPES);
  });

  it("should get all users", async () => {
    const user1: IUser = {
      email: "user1@example.com",
      password: "pass1",
      role: "ROLE_USER",
    };
    const user2: IUser = {
      email: "user2@example.com",
      password: "pass2",
      role: "ROLE_USER",
    };

    await userService.create(user1, { transaction });
    await userService.create(user2, { transaction });

    const users = await userService.getAll({ transaction });

    expect(users.length).toBe(2);
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining(user1),
        expect.objectContaining(user2),
      ])
    );
  });

  it("should get a user by id", async () => {
    const userCreationParams: IUser = {
      email: "test3@example.com",
      password: "password3",
      role: "ROLE_USER",
    };

    const createdUser = await userService.create(userCreationParams, {
      transaction,
    });
    const fetchedUser = await userService.get(createdUser.id as string, {
      transaction,
    });

    expect(fetchedUser).toMatchObject(userCreationParams);
  });

  it("should return null for a non-existing user", async () => {
    const nonExistingId = uuidv4();
    const fetchedUser = await userService.get(nonExistingId, { transaction });
    expect(fetchedUser).toBeNull();
  });

  it("should update a user", async () => {
    const userCreationParams: IUser = {
      email: "update@example.com",
      password: "updatepass",
      role: "ROLE_USER",
    };

    const createdUser = await userService.create(userCreationParams, {
      transaction,
    });

    const updateParams: IUser = {
      ...createdUser,
      email: "updated@example.com",
    };

    const updatedUser = await userService.update(
      createdUser.id as string,
      updateParams,
      { transaction }
    );

    expect(updatedUser).toMatchObject(updateParams);
  });

  it("should delete a user", async () => {
    const userCreationParams: IUser = {
      email: "delete@example.com",
      password: "deletepass",
      role: "ROLE_USER",
    };

    const createdUser = await userService.create(userCreationParams, {
      transaction,
    });

    await userService.delete(createdUser.id as string, { transaction });

    const deletedUser = await userService.get(createdUser.id as string, {
      transaction,
    });

    expect(deletedUser).toBeNull();
  });
});