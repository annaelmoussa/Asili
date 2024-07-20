"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetsService = void 0;
const Widget_1 = __importDefault(require("../models/Widget"));
class WidgetsService {
    async getAllByUser(userId) {
        return Widget_1.default.findAll({ where: { userId } });
    }
    async create(userId, widgetData) {
        return Widget_1.default.create({ ...widgetData, userId });
    }
    async update(widgetId, widgetData) {
        const widget = await Widget_1.default.findByPk(widgetId);
        if (!widget) {
            return null;
        }
        return widget.update(widgetData);
    }
    async delete(widgetId) {
        const widget = await Widget_1.default.findByPk(widgetId);
        if (widget) {
            await widget.destroy();
        }
    }
}
exports.WidgetsService = WidgetsService;
