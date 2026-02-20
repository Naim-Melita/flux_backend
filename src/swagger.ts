import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Barcode API",
      version: "1.0.0",
      description: "API para gestionar barcodes con imágenes y contador de scans"
    },
    servers: [
      {
        url: "http://localhost:5000/api"
      }
    ]
  },
  apis: ["./routes/*.ts"], // rutas donde pondremos anotaciones
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };