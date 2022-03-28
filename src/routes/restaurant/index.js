import profileRoutes from "./profile.js";
import dishRoutes from "./dish.js";
import mainRoutes from "./main.js";

const baseUrl = "/restaurant";

const addRestaurantRoutes = (app) => {
  app.use(`${baseUrl}`, mainRoutes);
  app.use(`${baseUrl}/profile`, profileRoutes);
  app.use(`${baseUrl}/dish`, dishRoutes);
};

export default addRestaurantRoutes;
