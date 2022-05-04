import { Server } from "socket.io";

let io;
let customerNamespace;
let restaurantNamespace;
let deliveryNamespace;

export const createIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
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
