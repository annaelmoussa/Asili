"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderService_1 = require("../services/orderService");
const Order_1 = __importDefault(require("../models/Order"));
const OrderItem_1 = __importDefault(require("../models/OrderItem"));
const Product_1 = __importDefault(require("../models/Product"));
jest.mock("../models/Order");
jest.mock("../models/OrderItem");
jest.mock("../models/Product");
describe("OrderService", () => {
    let orderService;
    beforeEach(() => {
        orderService = new orderService_1.OrderService();
        jest.clearAllMocks();
    });
    describe("getOrdersByUserId", () => {
        it("should return orders for a given user", async () => {
            const mockOrders = [
                { id: "1", userId: "user1", status: "completed" },
                { id: "2", userId: "user1", status: "pending" },
            ];
            Order_1.default.findAll.mockResolvedValue(mockOrders);
            const result = await orderService.getOrdersByUserId("user1");
            expect(Order_1.default.findAll).toHaveBeenCalledWith({
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
            OrderItem_1.default.findAll.mockResolvedValue(mockOrderItems);
            const result = await orderService.getOrderItems("order1");
            expect(OrderItem_1.default.findAll).toHaveBeenCalledWith(expect.objectContaining({
                where: { orderId: "order1" },
                include: expect.any(Array),
                attributes: ["id", "quantity"],
                order: [[{ model: Product_1.default, as: "product" }, "name", "ASC"]],
            }));
            expect(result).toEqual(mockOrderItems);
        });
    });
    describe("createOrder", () => {
        it("should create a new order with order items", async () => {
            const mockOrderInfo = {
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
            Order_1.default.create.mockResolvedValue(mockCreatedOrder);
            OrderItem_1.default.create.mockResolvedValue({});
            Order_1.default.findByPk.mockResolvedValue({
                ...mockCreatedOrder,
                items: mockOrderItems,
            });
            const result = await orderService.createOrder(mockOrderInfo, mockOrderItems);
            expect(Order_1.default.create).toHaveBeenCalledWith(mockOrderInfo);
            expect(OrderItem_1.default.create).toHaveBeenCalledTimes(2);
            expect(Order_1.default.findByPk).toHaveBeenCalledWith("newOrder1", expect.any(Object));
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
            Order_1.default.findByPk.mockResolvedValue(mockOrder);
            const result = await orderService.getOrderById("order1");
            expect(Order_1.default.findByPk).toHaveBeenCalledWith("order1", expect.any(Object));
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
            Order_1.default.update.mockResolvedValue([1]);
            Order_1.default.findByPk.mockResolvedValue(mockUpdatedOrder);
            const result = await orderService.updateOrderStatus("order1", "shipped");
            expect(Order_1.default.update).toHaveBeenCalledWith({ status: "shipped" }, { where: { id: "order1" } });
            expect(Order_1.default.findByPk).toHaveBeenCalledWith("order1", expect.any(Object));
            expect(result).toEqual(mockUpdatedOrder);
        });
    });
});
