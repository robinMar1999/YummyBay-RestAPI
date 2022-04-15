import orderRoutes from "./order.js";
import paymentRoutes from "./payment.js";

const baseUrl = "/customer";

const addCustomerRoutes = (app) => {
  app.use(`${baseUrl}/order`, orderRoutes);
  app.use(`${baseUrl}/payment`, paymentRoutes);
};

export default addCustomerRoutes;
