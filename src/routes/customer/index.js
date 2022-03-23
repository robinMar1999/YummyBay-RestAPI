import orderRoutes from "./order.js";

const baseUrl = "/customer";

const addCustomerRoutes = (app) => {
  app.use(`${baseUrl}/order`, orderRoutes);
};

export default addCustomerRoutes;
