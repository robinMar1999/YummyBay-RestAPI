let customers = [];

export const addCustomer = (decoded, socketId) => {
  for (let customer of customers) {
    if (customer.userId === decoded.id) {
      return console.log("customer already added");
    }
  }
  customers.push({
    userId: decoded.id,
    socketId,
  });
  console.log("customer added", socketId);
};

export const removeCustomer = (socketId) => {
  const newCustomers = [];
  for (let customer of customers) {
    if (customer.socketId === socketId) {
      continue;
    }
    newCustomers.push(customer);
  }
  customers = newCustomers;
  console.log("customer removed", socketId);
};

export const getCustomers = () => {
  return customers;
};
