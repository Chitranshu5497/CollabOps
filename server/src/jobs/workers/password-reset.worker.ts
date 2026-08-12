import { Worker } from "bullmq";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const worker = new Worker(
  "password-reset-email",

  async (job) => {
    console.log("\n========================");
    console.log("🔐 Password Reset Email Job");
    console.log("========================");

    const { email, token } = job.data;

    const resetLink =
      `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    console.log("To:", email);
    console.log("Reset Link:", resetLink);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: [email],
      subject: "Reset your CollabOps password",

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Reset your CollabOps password</h2>

          <p>
            You requested a password reset for your CollabOps account.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #4f46e5;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 24px; color: #666;">
            This link expires in 15 minutes.
          </p>

          <p style="color: #999; font-size: 12px;">
            If you did not request a password reset, you can safely ignore
            this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Email failed:", error);
      throw new Error(error.message);
    }

    console.log("📧 Email sent successfully!");
    console.log("Email ID:", data?.id);
  },

  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Reset Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(
    `❌ Reset Job ${job?.id} failed: ${err.message}`
  );
});

console.log("🚀 Password Reset Worker Running");