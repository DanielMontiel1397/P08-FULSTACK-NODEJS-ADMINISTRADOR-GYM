import swaggerJSDoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.2",
    /*
    tags: [
      {
        name: "Administrador Gym API",
        description:
          "API para la administración de un gimnasio con sucursales y clientes",
      },
    ],
    */
    info: {
      title: "REST API Node.js / Express / TypeScript",
      version: "1.0.0",
      description:
        "API para la administración de un gimnasio con superadministrador, sucursales y clientes",
    },
  },
  apis: ["./src/routes/*.js", "./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions = {
  customCss: `
    /* ====== BASE ====== */
    body {
      background-color: #f5f7fb !important;
      font-family: "Inter", "Segoe UI", sans-serif !important;
    }

    /* ====== TOP BAR ====== */
    .topbar {
      background: linear-gradient(90deg, #0f172a, #1e293b) !important;
      padding: 14px 28px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    }

    .topbar-wrapper img {
      display: none !important;
    }

    .topbar-wrapper .link::after {
      content: "Gym API · Documentation";
      font-size: 20px;
      font-weight: 600;
      color: #f8fafc !important;
    }

    /* ====== OPBLOCK (ENDPOINT CARD) ====== */
    .swagger-ui .opblock {
      border-radius: 12px !important;
      margin-bottom: 18px !important;
      background: white !important;
      box-shadow: 0 6px 20px rgba(15,23,42,0.08) !important;
    }

    /* ====== METHOD COLORS ====== */
    .swagger-ui .opblock.opblock-get { border-left: 6px solid #22c55e !important; }
    .swagger-ui .opblock.opblock-post { border-left: 6px solid #3b82f6 !important; }
    .swagger-ui .opblock.opblock-put { border-left: 6px solid #f59e0b !important; }
    .swagger-ui .opblock.opblock-delete { border-left: 6px solid #ef4444 !important; }

    /* ====== PATH & DESCRIPTION TEXT ====== */
    .swagger-ui .opblock-summary-path {
      font-size: 15px !important;
      font-weight: 600 !important;
      color: #111827 !important; /* texto más oscuro */
    }

    .swagger-ui .opblock-summary-description {
      font-size: 14px !important;
      color: #1e293b !important; /* más contraste */
    }

    /* ====== RESPONSE BLOCKS ====== */
    .swagger-ui .responses-wrapper {
      border-radius: 10px !important;
      background: #f0f4f8 !important; /* ligeramente más oscuro para contraste */
      padding: 12px !important;
    }

    .swagger-ui pre {
      border-radius: 8px !important;
      background: #111827 !important; /* código oscuro */
      color: #f8fafc !important;      /* texto claro para contraste */
    }

    /* ====== EXECUTE BUTTON ====== */
    .swagger-ui .btn.execute {
      background: linear-gradient(90deg, #2563eb, #3b82f6) !important;
      color: white !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      border: none !important;
      padding: 8px 16px !important;
    }

    /* ====== INPUTS ====== */
    .swagger-ui input,
    .swagger-ui select,
    .swagger-ui textarea {
      border-radius: 6px !important;
      border: 1px solid #cbd5f5 !important;
      color: #0f172a !important; /* texto de los inputs legible */
    }
  `,
  customSiteTitle: "Gym API · Swagger Docs",
};



export default swaggerSpec;
export { swaggerUiOptions };
