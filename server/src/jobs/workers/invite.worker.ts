import { Worker } from "bullmq";

const worker = new Worker(
  "invite-email",

  async (job) => {
    console.log("\n========================");
    console.log("📧 Processing Invite Job");
    console.log("========================");

    console.log(job.data);

    if (Math.random() < 0.4) {
      console.log("❌ Email service unavailable");
      throw new Error("SMTP Server Down");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("✅ Email Sent");
  },

  {
    connection: {
      url: process.env.REDIS_URL,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job ${job?.id} failed: ${err.message}`);
});

console.log("🚀 Invite Worker Running");
