"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const scopes_1 = require("../config/scopes");
const EmailNotification_1 = __importDefault(require("./EmailNotification"));
const UserPreferences_1 = __importDefault(require("./UserPreferences"));
const Widget_1 = __importDefault(require("./Widget"));
const AlertPreference_1 = __importDefault(require("./AlertPreference"));
let User = User_1 = class User extends sequelize_typescript_1.Model {
    static handleUserChanges(instance) {
        if (instance.role === "ROLE_ADMIN") {
            instance.scopes = scopes_1.ALL_SCOPES;
        }
        if (instance.changed('password')) {
            instance.lastPasswordChange = new Date();
        }
    }
    static associate() {
        User_1.hasMany(Widget_1.default, { foreignKey: "userId" });
        User_1.hasOne(AlertPreference_1.default, { foreignKey: "userId", as: "alertPreferences" });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        defaultValue: "ROLE_USER",
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isConfirmed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "confirmationToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "scopes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], User.prototype, "lastPasswordChange", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EmailNotification_1.default),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => UserPreferences_1.default),
    __metadata("design:type", UserPreferences_1.default)
], User.prototype, "preferences", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Widget_1.default),
    __metadata("design:type", Array)
], User.prototype, "widgets", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", void 0)
], User, "handleUserChanges", null);
User = User_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "User",
        timestamps: true,
        paranoid: true,
    })
], User);
exports.default = User;
