let restaurants = [];

export const addRestaurant = (decoded, socketId) => {
  for (let restaurant of restaurants) {
    if (restaurant.userId === decoded.id) {
      return console.log("restaurant already added");
    }
  }
  restaurants.push({
    userId: decoded.id,
    socketId,
  });
  console.log("restaurant added", socketId);
};

export const removeRestaurant = (socketId) => {
  const newRestaurants = [];
  for (let restaurant of restaurants) {
    if (restaurant.socketId === socketId) {
      continue;
    }
    newRestaurants.push(restaurant);
  }
  restaurants = newRestaurants;
  console.log("restaurant removed", socketId);
};

export const getRestaurants = () => {
  return restaurants;
};
