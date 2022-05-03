import orderRoutes from "./order.js";
import paymentRoutes from "./payment.js";
import profileRoutes from "./profile.js";

const baseUrl = "/customer";

const addCustomerRoutes = (app) => {
  app.use(`${baseUrl}/order`, orderRoutes);
  app.use(`${baseUrl}/payment`, paymentRoutes);
  app.use(`${baseUrl}/profile`, profileRoutes);
};

export default addCustomerRoutes;
