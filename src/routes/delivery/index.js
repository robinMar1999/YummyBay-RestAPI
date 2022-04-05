import mainRoutes from "./main.js";

const baseUrl = "/delivery";

const addDeliveryRoutes = (app) => {
  app.use(`${baseUrl}`, mainRoutes);
};

export default addDeliveryRoutes;
