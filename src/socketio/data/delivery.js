let deliveries = [];

export const addDelivery = (decoded, socketId) => {
  for (let delivery of deliveries) {
    if (delivery.userId === decoded.id) {
      return console.log("delivery already added");
    }
  }
  deliveries.push({
    userId: decoded.id,
    socketId,
  });
  console.log("delivery added", socketId);
};

export const removeDelivery = (socketId) => {
  const newDeliveries = [];
  for (let delivery of deliveries) {
    if (delivery.socketId === socketId) {
      continue;
    }
    newDeliveries.push(delivery);
  }
  deliveries = newDeliveries;
  console.log("delivery removed", socketId);
};

export const getDeliveries = () => {
  return deliveries;
};
