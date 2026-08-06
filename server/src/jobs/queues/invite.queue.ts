import { Queue } from "bullmq";

export const inviteQueue = new Queue("invite-email", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});