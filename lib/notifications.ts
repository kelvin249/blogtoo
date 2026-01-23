/**
 * Notification utility for sending phone alerts when new comments are submitted
 * Supports SMS notifications via Twilio
 */

import { PHONE_NOTIFICATIONS_ENABLED } from "./config";

interface NotificationPayload {
  slug: string;
  author: string;
  content: string;
  postTitle?: string;
}

/**
 * Send SMS notification about new comment
 * Requires Twilio credentials in environment variables
 */
export async function sendPhoneNotification(
  payload: NotificationPayload
): Promise<boolean> {
  // Check if notifications are enabled
  if (!PHONE_NOTIFICATIONS_ENABLED) {
    console.log("Phone notifications are disabled. Set Twilio env variables to enable.");
    return false;
  }

  try {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

    if (
      !twilioAccountSid ||
      !twilioAuthToken ||
      !twilioPhoneNumber ||
      !adminPhoneNumber
    ) {
      console.error("Missing Twilio configuration");
      return false;
    }

    // Construct the message
    const message = formatNotificationMessage(payload);

    // Twilio API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;

    // Send SMS via Twilio
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${twilioAccountSid}:${twilioAuthToken}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        From: twilioPhoneNumber,
        To: adminPhoneNumber,
        Body: message,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Twilio API error:", error);
      return false;
    }

    console.log("Phone notification sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send phone notification:", error);
    return false;
  }
}

/**
 * Format notification message for SMS
 * SMS has character limit, so keep it concise
 */
function formatNotificationMessage(payload: NotificationPayload): string {
  const { author, slug, content, postTitle } = payload;

  // Truncate long content for SMS (160 char limit standard)
  const truncatedContent =
    content.length > 80 ? content.substring(0, 77) + "..." : content;

  return `📝 New comment on "${postTitle || slug}"\n\nFrom: ${author}\n\n${truncatedContent}`;
}

/**
 * Alternative: Send notification via webhook/Discord
 * Useful if you don't want to use Twilio
 */
export async function sendWebhookNotification(
  payload: NotificationPayload
): Promise<boolean> {
  const webhookUrl = process.env.COMMENT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("Webhook URL not configured");
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "new_comment",
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });

    if (!response.ok) {
      console.error("Webhook notification failed:", response.statusText);
      return false;
    }

    console.log("Webhook notification sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send webhook notification:", error);
    return false;
  }
}
