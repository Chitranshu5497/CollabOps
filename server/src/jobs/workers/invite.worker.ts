import { Worker } from "bullmq";

new Worker(
  "invite-email",

  async (job) => {
    console.log("\n========================");
    console.log("📧 Processing Invite Job");
    console.log("========================");

    console.log("To:", job.data.email);
    console.log("Workspace:", job.data.workspaceName);
    console.log("Invited By:", job.data.invitedBy);

    console.log("Connecting to Email Provider...");

    await new Promise((resolve) =>
      setTimeout(resolve, 1500)
    );

    console.log("Generating email...");

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    console.log("Sending email...");

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    console.log("✅ Invite email sent successfully!");
  },

  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

console.log("🚀 Invite Worker Running");