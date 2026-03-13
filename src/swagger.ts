import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Barcode API",
      version: "1.0.0",
      description: "API para gestionar barcodes con imágenes y contador de scans",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key requerida para las rutas de productos",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT requerido para las rutas protegidas de autenticación",
        },
      },
      schemas: {
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", format: "uuid", example: "a8d5cb2e-43a0-4cd0-9fcb-64e8c94f7f1f" },
            id: { type: "string", format: "uuid", example: "a8d5cb2e-43a0-4cd0-9fcb-64e8c94f7f1f" },
            barcode: { type: "string", example: "7791234567890" },
            name: { type: "string", example: "Coca Cola 500ml" },
            scans: { type: "integer", example: 12 },
            imageUrl: { type: "string", example: "https://res.cloudinary.com/demo/image/upload/barcodes/demo.jpg" },
            category: { type: "string", example: "Bebidas" },
            productTypeId: { type: "string", format: "uuid", nullable: true, example: "9dfc82d7-9f44-4dab-b7f0-bb2f99832f84" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProductCreateRequest: {
          type: "object",
          required: ["barcode"],
          properties: {
            barcode: { type: "string", example: "7791234567890" },
            name: { type: "string", example: "Coca Cola 500ml" },
            category: { type: "string", example: "Bebidas" },
            image: {
              type: "string",
              format: "binary",
              description: "Archivo de imagen opcional",
            },
          },
        },
        ProductUpdateRequest: {
          type: "object",
          properties: {
            barcode: { type: "string", example: "7791234567890" },
            name: { type: "string", example: "Coca Cola Zero 500ml" },
            image: {
              type: "string",
              format: "binary",
              description: "Archivo de imagen opcional",
            },
          },
        },
        ProductStats: {
          type: "object",
          properties: {
            totalProducts: { type: "integer", example: 154 },
            totalCategories: { type: "integer", example: 7 },
            latest: {
              type: "array",
              items: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        ProductCount: {
          type: "object",
          properties: {
            total: { type: "integer", example: 154 },
          },
        },
        FixUrlsResponse: {
          type: "object",
          properties: {
            updated: { type: "integer", example: 8 },
          },
        },
        DeleteProductResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Barcode eliminado correctamente" },
            deletedBarcode: { $ref: "#/components/schemas/Product" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Barcode no encontrado" },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", example: "field" },
                  value: { type: "string", example: "" },
                  msg: { type: "string", example: "El campo 'barcode' es requerido" },
                  path: { type: "string", example: "barcode" },
                  location: { type: "string", example: "body" },
                },
              },
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "admin@example.com" },
            password: { type: "string", format: "password", example: "secret123" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "last_name", "email", "password"],
          properties: {
            name: { type: "string", example: "Nacho" },
            last_name: { type: "string", example: "Perez" },
            email: { type: "string", format: "email", example: "nacho@example.com" },
            password: { type: "string", format: "password", example: "secret123" },
          },
        },
        AuthUser: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email", example: "nacho@example.com" },
            name: { type: "string", example: "Nacho" },
            last_name: { type: "string", example: "Perez" },
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/AuthUser" },
          },
        },
        AuthMeResponse: {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                email: { type: "string", format: "email", nullable: true },
                name: { type: "string", nullable: true },
                last_name: { type: "string", nullable: true },
                iat: { type: "integer", example: 1710000000 },
                exp: { type: "integer", example: 1710000900 },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/modules/**/*.ts"],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
