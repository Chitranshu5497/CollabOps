import { Queue } from "bullmq";

export const passwordResetQueue = new Queue("password-reset-email", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
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