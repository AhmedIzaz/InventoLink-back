import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "InventoLink API",
      description: "API documentation for InventoLink",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.ts"],
};

export default swaggerJsdoc(swaggerOptions);
