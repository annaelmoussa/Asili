"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const userController_1 = require("./../src/controllers/userController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const productController_1 = require("./../src/controllers/productController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const categoryController_1 = require("./../src/controllers/categoryController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const brandController_1 = require("./../src/controllers/brandController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const authController_1 = require("./../src/controllers/authController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const WidgetsController_1 = require("./../src/controllers/WidgetsController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const CartController_1 = require("./../src/controllers/CartController");
const authentication_1 = require("./../src/authentication");
const multer = require('multer');
const expressAuthenticationRecasted = authentication_1.expressAuthentication;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "role": { "dataType": "string", "required": true },
            "isConfirmed": { "dataType": "boolean" },
            "token": { "dataType": "string" },
            "scopes": { "dataType": "array", "array": { "dataType": "string" } },
            "isDeleted": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_IUser_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "string" }, "email": { "dataType": "string" }, "password": { "dataType": "string" }, "role": { "dataType": "string" }, "isConfirmed": { "dataType": "boolean" }, "token": { "dataType": "string" }, "scopes": { "dataType": "array", "array": { "dataType": "string" } }, "isDeleted": { "dataType": "boolean" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBrand": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "name": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICategory": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "name": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProduct": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "price": { "dataType": "double", "required": true },
            "categoryId": { "dataType": "string", "required": true },
            "brandId": { "dataType": "string", "required": true },
            "stock": { "dataType": "double", "required": true },
            "image": { "dataType": "string" },
            "isPromotion": { "dataType": "boolean", "required": true },
            "brand": { "ref": "IBrand" },
            "category": { "ref": "ICategory" },
            "brandName": { "dataType": "string" },
            "categoryName": { "dataType": "string" },
            "lowStockThreshold": { "dataType": "double", "required": true },
            "stockHistory": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "quantity": { "dataType": "double", "required": true }, "date": { "dataType": "datetime", "required": true } } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CategoryCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_ICategory_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "string" }, "name": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BrandCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_IBrand_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "string" }, "name": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignupRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LogoutRequest": {
        "dataType": "refObject",
        "properties": {
            "token": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IWidget": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "name": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
            "settings": { "dataType": "any", "required": true },
            "x": { "dataType": "double", "required": true },
            "y": { "dataType": "double", "required": true },
            "w": { "dataType": "double", "required": true },
            "h": { "dataType": "double", "required": true },
            "userId": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WidgetCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
            "settings": { "dataType": "any", "required": true },
            "x": { "dataType": "double", "required": true },
            "y": { "dataType": "double", "required": true },
            "w": { "dataType": "double", "required": true },
            "h": { "dataType": "double", "required": true },
            "userId": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICartItem": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "cartId": { "dataType": "string", "required": true },
            "productId": { "dataType": "string", "required": true },
            "quantity": { "dataType": "double", "required": true },
            "reservationExpires": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }] },
            "product": { "ref": "IProduct" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartItemUpdate": {
        "dataType": "refObject",
        "properties": {
            "productId": { "dataType": "string", "required": true },
            "quantity": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app, opts) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const upload = opts?.multer || multer({ "limits": { "fileSize": 8388608 } });
    app.get('/users/:userId', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController.prototype.getUser)), async function UserController_getUser(request, response, next) {
        const args = {
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new userController_1.UserController();
            await templateService.apiHandler({
                methodName: 'getUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/users', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController.prototype.getUsers)), async function UserController_getUsers(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new userController_1.UserController();
            await templateService.apiHandler({
                methodName: 'getUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/users', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController.prototype.createUser)), async function UserController_createUser(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "IUser" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new userController_1.UserController();
            await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/users/:userId', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController.prototype.updateUser)), async function UserController_updateUser(request, response, next) {
        const args = {
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "Partial_IUser_" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new userController_1.UserController();
            await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/users/:userId', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(userController_1.UserController.prototype.deleteUser)), async function UserController_deleteUser(request, response, next) {
        const args = {
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new userController_1.UserController();
            await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/products/low-stock', ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.getLowStockProducts)), async function ProductController_getLowStockProducts(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'getLowStockProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/products/categories', ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.getCategories)), async function ProductController_getCategories(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'getCategories',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/products/brands', ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.getBrands)), async function ProductController_getBrands(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'getBrands',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/products/search', ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.searchProducts)), async function ProductController_searchProducts(request, response, next) {
        const args = {
            query: { "in": "query", "name": "query", "dataType": "string" },
            category: { "in": "query", "name": "category", "dataType": "string" },
            brand: { "in": "query", "name": "brand", "dataType": "string" },
            minPrice: { "in": "query", "name": "minPrice", "dataType": "string" },
            maxPrice: { "in": "query", "name": "maxPrice", "dataType": "string" },
            isPromotion: { "in": "query", "name": "isPromotion", "dataType": "string" },
            inStock: { "in": "query", "name": "inStock", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'searchProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/products/:productId', ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.getProduct)), async function ProductController_getProduct(request, response, next) {
        const args = {
            productId: { "in": "path", "name": "productId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'getProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/products', ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.getProducts)), async function ProductController_getProducts(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'getProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/products', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), upload.fields([{ "name": "image", "maxCount": 1, "multiple": false }]), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.createProduct)), async function ProductController_createProduct(request, response, next) {
        const args = {
            name: { "in": "formData", "name": "name", "required": true, "dataType": "string" },
            description: { "in": "formData", "name": "description", "required": true, "dataType": "string" },
            price: { "in": "formData", "name": "price", "required": true, "dataType": "string" },
            categoryId: { "in": "formData", "name": "categoryId", "required": true, "dataType": "string" },
            brandId: { "in": "formData", "name": "brandId", "required": true, "dataType": "string" },
            stock: { "in": "formData", "name": "stock", "required": true, "dataType": "string" },
            isPromotion: { "in": "formData", "name": "isPromotion", "required": true, "dataType": "string" },
            lowStockThreshold: { "in": "formData", "name": "lowStockThreshold", "required": true, "dataType": "string" },
            image: { "in": "formData", "name": "image", "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'createProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/products/:productId', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN|ROLE_STORE_KEEPER"] }]), upload.fields([{ "name": "image", "maxCount": 1, "multiple": false }]), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.updateProduct)), async function ProductController_updateProduct(request, response, next) {
        const args = {
            productId: { "in": "path", "name": "productId", "required": true, "dataType": "string" },
            name: { "in": "formData", "name": "name", "dataType": "string" },
            description: { "in": "formData", "name": "description", "dataType": "string" },
            price: { "in": "formData", "name": "price", "dataType": "string" },
            categoryId: { "in": "formData", "name": "categoryId", "dataType": "string" },
            brandId: { "in": "formData", "name": "brandId", "dataType": "string" },
            stock: { "in": "formData", "name": "stock", "dataType": "string" },
            isPromotion: { "in": "formData", "name": "isPromotion", "dataType": "string" },
            lowStockThreshold: { "in": "formData", "name": "lowStockThreshold", "dataType": "string" },
            image: { "in": "formData", "name": "image", "dataType": "file" },
            existingImageUrl: { "in": "formData", "name": "existingImageUrl", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'updateProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/products/:productId', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.deleteProduct)), async function ProductController_deleteProduct(request, response, next) {
        const args = {
            productId: { "in": "path", "name": "productId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'deleteProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/products/:productId/stock', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN|ROLE_STORE_KEEPER"] }]), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.updateStock)), async function ProductController_updateStock(request, response, next) {
        const args = {
            productId: { "in": "path", "name": "productId", "required": true, "dataType": "string" },
            body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "quantity": { "dataType": "double", "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'updateStock',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/products/:productId/low-stock-threshold', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN|ROLE_STORE_KEEPER"] }]), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.updateLowStockThreshold)), async function ProductController_updateLowStockThreshold(request, response, next) {
        const args = {
            productId: { "in": "path", "name": "productId", "required": true, "dataType": "string" },
            body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "lowStockThreshold": { "dataType": "double", "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'updateLowStockThreshold',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/products/:productId/stock-history', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN|ROLE_STORE_KEEPER"] }]), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController)), ...((0, runtime_1.fetchMiddlewares)(productController_1.ProductController.prototype.getStockHistory)), async function ProductController_getStockHistory(request, response, next) {
        const args = {
            productId: { "in": "path", "name": "productId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new productController_1.ProductController();
            await templateService.apiHandler({
                methodName: 'getStockHistory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/categories', ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController)), ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController.prototype.getCategories)), async function CategoryController_getCategories(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new categoryController_1.CategoryController();
            await templateService.apiHandler({
                methodName: 'getCategories',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/categories/:categoryId', ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController)), ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController.prototype.getCategory)), async function CategoryController_getCategory(request, response, next) {
        const args = {
            categoryId: { "in": "path", "name": "categoryId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new categoryController_1.CategoryController();
            await templateService.apiHandler({
                methodName: 'getCategory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/categories', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController)), ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController.prototype.createCategory)), async function CategoryController_createCategory(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "CategoryCreationParams" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new categoryController_1.CategoryController();
            await templateService.apiHandler({
                methodName: 'createCategory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/categories/:categoryId', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController)), ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController.prototype.updateCategory)), async function CategoryController_updateCategory(request, response, next) {
        const args = {
            categoryId: { "in": "path", "name": "categoryId", "required": true, "dataType": "string" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "Partial_ICategory_" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new categoryController_1.CategoryController();
            await templateService.apiHandler({
                methodName: 'updateCategory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/categories/:categoryId', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController)), ...((0, runtime_1.fetchMiddlewares)(categoryController_1.CategoryController.prototype.deleteCategory)), async function CategoryController_deleteCategory(request, response, next) {
        const args = {
            categoryId: { "in": "path", "name": "categoryId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new categoryController_1.CategoryController();
            await templateService.apiHandler({
                methodName: 'deleteCategory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/brands', ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController)), ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController.prototype.getBrands)), async function BrandController_getBrands(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new brandController_1.BrandController();
            await templateService.apiHandler({
                methodName: 'getBrands',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/brands/:brandId', ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController)), ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController.prototype.getBrand)), async function BrandController_getBrand(request, response, next) {
        const args = {
            brandId: { "in": "path", "name": "brandId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new brandController_1.BrandController();
            await templateService.apiHandler({
                methodName: 'getBrand',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/brands', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController)), ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController.prototype.createBrand)), async function BrandController_createBrand(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "BrandCreationParams" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new brandController_1.BrandController();
            await templateService.apiHandler({
                methodName: 'createBrand',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/brands/:brandId', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController)), ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController.prototype.updateBrand)), async function BrandController_updateBrand(request, response, next) {
        const args = {
            brandId: { "in": "path", "name": "brandId", "required": true, "dataType": "string" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "Partial_IBrand_" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new brandController_1.BrandController();
            await templateService.apiHandler({
                methodName: 'updateBrand',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/brands/:brandId', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController)), ...((0, runtime_1.fetchMiddlewares)(brandController_1.BrandController.prototype.deleteBrand)), async function BrandController_deleteBrand(request, response, next) {
        const args = {
            brandId: { "in": "path", "name": "brandId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new brandController_1.BrandController();
            await templateService.apiHandler({
                methodName: 'deleteBrand',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/auth/login', ...((0, runtime_1.fetchMiddlewares)(authController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(authController_1.AuthController.prototype.login)), async function AuthController_login(request, response, next) {
        const args = {
            body: { "in": "body", "name": "body", "required": true, "ref": "LoginRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new authController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/auth/signup', ...((0, runtime_1.fetchMiddlewares)(authController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(authController_1.AuthController.prototype.signup)), async function AuthController_signup(request, response, next) {
        const args = {
            body: { "in": "body", "name": "body", "required": true, "ref": "SignupRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new authController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'signup',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/auth/logout', ...((0, runtime_1.fetchMiddlewares)(authController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(authController_1.AuthController.prototype.logout)), async function AuthController_logout(request, response, next) {
        const args = {
            body: { "in": "body", "name": "body", "required": true, "ref": "LogoutRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new authController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/auth/user', ...((0, runtime_1.fetchMiddlewares)(authController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(authController_1.AuthController.prototype.getUser)), async function AuthController_getUser(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new authController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'getUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/widgets', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(WidgetsController_1.WidgetsController)), ...((0, runtime_1.fetchMiddlewares)(WidgetsController_1.WidgetsController.prototype.getWidgets)), async function WidgetsController_getWidgets(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new WidgetsController_1.WidgetsController();
            await templateService.apiHandler({
                methodName: 'getWidgets',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/widgets', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(WidgetsController_1.WidgetsController)), ...((0, runtime_1.fetchMiddlewares)(WidgetsController_1.WidgetsController.prototype.createWidget)), async function WidgetsController_createWidget(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "WidgetCreationParams" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new WidgetsController_1.WidgetsController();
            await templateService.apiHandler({
                methodName: 'createWidget',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/widgets/:widgetId', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(WidgetsController_1.WidgetsController)), ...((0, runtime_1.fetchMiddlewares)(WidgetsController_1.WidgetsController.prototype.updateWidget)), async function WidgetsController_updateWidget(request, response, next) {
        const args = {
            widgetId: { "in": "path", "name": "widgetId", "required": true, "dataType": "string" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "WidgetCreationParams" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new WidgetsController_1.WidgetsController();
            await templateService.apiHandler({
                methodName: 'updateWidget',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/widgets/:widgetId', authenticateMiddleware([{ "jwt": ["ROLE_ADMIN"] }]), ...((0, runtime_1.fetchMiddlewares)(WidgetsController_1.WidgetsController)), ...((0, runtime_1.fetchMiddlewares)(WidgetsController_1.WidgetsController.prototype.deleteWidget)), async function WidgetsController_deleteWidget(request, response, next) {
        const args = {
            widgetId: { "in": "path", "name": "widgetId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new WidgetsController_1.WidgetsController();
            await templateService.apiHandler({
                methodName: 'deleteWidget',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/carts/get-cart-items', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController)), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController.prototype.getCartItems)), async function CartController_getCartItems(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new CartController_1.CartController();
            await templateService.apiHandler({
                methodName: 'getCartItems',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/carts/add-item', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController)), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController.prototype.addItem)), async function CartController_addItem(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "CartItemUpdate" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new CartController_1.CartController();
            await templateService.apiHandler({
                methodName: 'addItem',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/carts/remove-item/:itemId', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController)), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController.prototype.removeItem)), async function CartController_removeItem(request, response, next) {
        const args = {
            itemId: { "in": "path", "name": "itemId", "required": true, "dataType": "string" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new CartController_1.CartController();
            await templateService.apiHandler({
                methodName: 'removeItem',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/carts/update-item-quantity/:itemId/:quantity', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController)), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController.prototype.updateItemQuantity)), async function CartController_updateItemQuantity(request, response, next) {
        const args = {
            itemId: { "in": "path", "name": "itemId", "required": true, "dataType": "string" },
            quantity: { "in": "path", "name": "quantity", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new CartController_1.CartController();
            await templateService.apiHandler({
                methodName: 'updateItemQuantity',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/carts/clear-expired-reservations', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController)), ...((0, runtime_1.fetchMiddlewares)(CartController_1.CartController.prototype.clearExpiredReservations)), async function CartController_clearExpiredReservations(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new CartController_1.CartController();
            await templateService.apiHandler({
                methodName: 'clearExpiredReservations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return async function runAuthenticationMiddleware(request, response, next) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts = [];
            const pushAndRethrow = (error) => {
                failedAttempts.push(error);
                throw error;
            };
            const secMethodOrPromises = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises = [];
                    for (const name in secMethod) {
                        secMethodAndPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                }
                else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                }
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            try {
                request['user'] = await Promise.any(secMethodOrPromises);
                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next();
            }
            catch (err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
