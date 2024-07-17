import Queue from "bull";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const reservationExpirationQueue = new Queue(
  "reservation-expiration",
  redisUrl
);
export const stockReleaseQueue = new Queue("stock-release", redisUrl);
