import mainRoutes from "./main.js";
import profileRoutes from "./profile.js";

const baseUrl = "/delivery";

const addDeliveryRoutes = (app) => {
  app.use(`${baseUrl}`, mainRoutes);
  app.use(`${baseUrl}/profile`, profileRoutes);
};

export default addDeliveryRoutes;
