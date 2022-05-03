import { Server } from "socket.io";

let io;
let customerNamespace;
let restaurantNamespace;
let deliveryNamespace;

export const createIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
      ],
    },
  });
  customerNamespace = io.of("/customer");
  restaurantNamespace = io.of("/restaurant");
  deliveryNamespace = io.of("/delivery");
  return io;
};

export const getNamespaces = () => {
  return {
    main: io,
    customer: customerNamespace,
    restaurant: restaurantNamespace,
    delivery: deliveryNamespace,
  };
};
