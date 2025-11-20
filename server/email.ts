import { createTransport, type Transporter } from "nodemailer";
import type { Applicant } from "@shared/schema";

let transporter: Transporter | null = null;

// Only create transporter if SMTP config is available
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("Email service configured successfully");
  } catch (error) {
    console.error("Failed to configure email service:", error);
  }
} else {
  console.warn("Email service not configured - SMTP environment variables missing");
}

export async function sendApplicationConfirmation(applicant: Applicant): Promise<void> {
  if (!transporter) {
    console.log("Email not sent - transporter not configured");
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: applicant.email,
    subject: "Application Received - Research Project",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Received</h2>
        <p>Dear ${applicant.fullName},</p>
        <p>Thank you for applying to our research project in ${applicant.location}.</p>
        <p>We have successfully received your application and it is currently under review.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Application Details:</strong><br>
          Location: ${applicant.location}<br>
          Submitted: ${new Date(applicant.createdAt).toLocaleDateString()}<br>
          Status: Pending Review
        </div>
        <p>You can check your application status at any time by logging in with your email and phone number.</p>
        <p>We will notify you via email once there is an update on your application status.</p>
        <p>Best regards,<br>Research Project Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    // Don't throw error - application should still succeed even if email fails
  }
}

export async function sendStatusUpdate(applicant: Applicant, oldStatus: string): Promise<void> {
  if (!transporter) {
    console.log("Email not sent - transporter not configured");
    return;
  }

  let subject = "";
  let message = "";

  switch (applicant.status) {
    case "Shortlisted":
      subject = "Congratulations! You've Been Shortlisted";
      message = `
        <p>Dear ${applicant.fullName},</p>
        <p>We are pleased to inform you that your application for our research project has been <strong>shortlisted</strong>!</p>
        ${applicant.resumptionDate ? `
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <strong>Next Steps:</strong><br>
            Resumption Date: ${new Date(applicant.resumptionDate).toLocaleDateString()}<br>
            ${applicant.resumptionDetails ? `<br>${applicant.resumptionDetails}` : ""}
          </div>
        ` : ""}
        ${applicant.adminNotes ? `
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Additional Information:</strong><br>
            ${applicant.adminNotes}
          </div>
        ` : ""}
        <p>Please log in to your applicant portal to view more details.</p>
      `;
      break;

    case "Employed":
      subject = "Congratulations! You Have Been Selected";
      message = `
        <p>Dear ${applicant.fullName},</p>
        <p>Congratulations! We are delighted to inform you that you have been selected for our research project in ${applicant.location}.</p>
        ${applicant.resumptionDate ? `
          <div style="background-color: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #059669;">
            <strong>Resumption Details:</strong><br>
            Date: ${new Date(applicant.resumptionDate).toLocaleDateString()}<br>
            ${applicant.resumptionDetails ? `<br>${applicant.resumptionDetails}` : ""}
          </div>
        ` : ""}
        ${applicant.adminNotes ? `
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Important Information:</strong><br>
            ${applicant.adminNotes}
          </div>
        ` : ""}
        <p>We look forward to working with you!</p>
      `;
      break;

    case "Rejected":
      subject = "Update on Your Application";
      message = `
        <p>Dear ${applicant.fullName},</p>
        <p>Thank you for your interest in our research project and for taking the time to apply.</p>
        <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
        ${applicant.adminNotes ? `
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ${applicant.adminNotes}
          </div>
        ` : ""}
        <p>We appreciate your interest and wish you the very best in your future endeavors.</p>
      `;
      break;

    default:
      subject = "Application Status Update";
      message = `
        <p>Dear ${applicant.fullName},</p>
        <p>Your application status has been updated to: <strong>${applicant.status}</strong></p>
        ${applicant.adminNotes ? `
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ${applicant.adminNotes}
          </div>
        ` : ""}
        <p>Please log in to your applicant portal for more details.</p>
      `;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: applicant.email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Research Project Application Update</h2>
        ${message}
        <p>Best regards,<br>Research Project Team</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          If you have any questions, please log in to your applicant portal to view your application details.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send status update email:", error);
    // Don't throw error - status update should still succeed even if email fails
  }
}
