import { Queue } from "bullmq";

export const passwordResetQueue = new Queue("password-reset-email", {
  connection: {
    url: process.env.REDIS_URL,
  },

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 2000,
    },

    removeOnComplete: 100,
    removeOnFail: 50,
  },
});
