import { OrderService } from "../services/orderService";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";
import { IOrder } from "../interfaces/IOrder";
import { IOrderItem } from "../interfaces/IOrderItem";


jest.mock("../models/Order");
jest.mock("../models/OrderItem");
jest.mock("../models/Product");

describe("OrderService", () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
    jest.clearAllMocks();
  });

  describe("getOrdersByUserId", () => {
    it("should return orders for a given user", async () => {
      const mockOrders = [
        { id: "1", userId: "user1", status: "completed" },
        { id: "2", userId: "user1", status: "pending" },
      ];
      (Order.findAll as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderService.getOrdersByUserId("user1");

      expect(Order.findAll).toHaveBeenCalledWith({
        where: { userId: "user1" },
        include: expect.any(Array),
      });
      expect(result).toEqual(mockOrders);
    });
  });

  describe("getOrderItems", () => {
    it("should return order items for a given order", async () => {
      const mockOrderItems = [
        {
          id: "1",
          orderId: "order1",
          quantity: 2,
          product: { id: "prod1", name: "Product 1" },
        },
        {
          id: "2",
          orderId: "order1",
          quantity: 1,
          product: { id: "prod2", name: "Product 2" },
        },
      ];
      (OrderItem.findAll as jest.Mock).mockResolvedValue(mockOrderItems);

      const result = await orderService.getOrderItems("order1");

      expect(OrderItem.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { orderId: "order1" },
          include: expect.any(Array),
          attributes: ["id", "quantity"],
          order: [[{ model: Product, as: "product" }, "name", "ASC"]],
        })
      );
      expect(result).toEqual(mockOrderItems);
    });
  });

  describe("createOrder", () => {
    it("should create a new order with order items", async () => {
      const mockOrderInfo: IOrder = {
          userId: "user1", status: "pending",
          stripeInvoiceId: "",
          amount: 0,
          shippingAddress: ""
      };
      const mockOrderItems = [
        { productId: "prod1", quantity: 2 },
        { productId: "prod2", quantity: 1 },
      ];
      const mockCreatedOrder = { id: "newOrder1", ...mockOrderInfo };
      (Order.create as jest.Mock).mockResolvedValue(mockCreatedOrder);
      (OrderItem.create as jest.Mock).mockResolvedValue({});
      (Order.findByPk as jest.Mock).mockResolvedValue({
        ...mockCreatedOrder,
        items: mockOrderItems,
      });

      const result = await orderService.createOrder(
        mockOrderInfo,
        mockOrderItems
      );

      expect(Order.create).toHaveBeenCalledWith(mockOrderInfo);
      expect(OrderItem.create).toHaveBeenCalledTimes(2);
      expect(Order.findByPk).toHaveBeenCalledWith(
        "newOrder1",
        expect.any(Object)
      );
      expect(result).toEqual({
        ...mockCreatedOrder,
        items: mockOrderItems,
      });
    });
  });

  describe("getOrderById", () => {
    it("should return an order by its id", async () => {
      const mockOrder = {
        id: "order1",
        userId: "user1",
        status: "completed",
        items: [
          {
            id: "1",
            orderId: "order1",
            quantity: 2,
            product: { id: "prod1", name: "Product 1" },
          },
        ],
      };
      (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById("order1");

      expect(Order.findByPk).toHaveBeenCalledWith("order1", expect.any(Object));
      expect(result).toEqual(mockOrder);
    });
  });

  describe("updateOrderStatus", () => {
    it("should update the status of an order", async () => {
      const mockUpdatedOrder = {
        id: "order1",
        userId: "user1",
        status: "shipped",
        items: [],
      };
      (Order.update as jest.Mock).mockResolvedValue([1]);
      (Order.findByPk as jest.Mock).mockResolvedValue(mockUpdatedOrder);

      const result = await orderService.updateOrderStatus("order1", "shipped");

      expect(Order.update).toHaveBeenCalledWith(
        { status: "shipped" },
        { where: { id: "order1" } }
      );
      expect(Order.findByPk).toHaveBeenCalledWith("order1", expect.any(Object));
      expect(result).toEqual(mockUpdatedOrder);
    });
  });
});
