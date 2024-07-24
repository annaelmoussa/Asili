"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeApiLaPosteService = void 0;
const axios_1 = __importDefault(require("axios"));
class FakeApiLaPosteService {
    constructor() {
        this.baseUrl = 'http://fakeapilaposte:3000';
    }
    async generateTrackingNumber() {
        const response = await axios_1.default.get(`${this.baseUrl}/generate-tracking`);
        return response.data.trackingCode;
    }
    async getTrackingInfo(trackingCode) {
        const response = await axios_1.default.get(`${this.baseUrl}/tracking/${trackingCode}`);
        return response.data;
    }
}
exports.FakeApiLaPosteService = FakeApiLaPosteService;
