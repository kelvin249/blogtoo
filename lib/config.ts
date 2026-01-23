// Configuration for blog pagination
export const POSTS_PER_PAGE = 5;

// Phone notification configuration (SMS via Twilio)
// Set these environment variables to enable notifications:
// TWILIO_ACCOUNT_SID - Twilio account ID
// TWILIO_AUTH_TOKEN - Twilio auth token
// TWILIO_PHONE_NUMBER - Twilio phone number (format: +1234567890)
// ADMIN_PHONE_NUMBER - Your phone number to receive notifications (format: +1234567890)
export const PHONE_NOTIFICATIONS_ENABLED =
  !!process.env.TWILIO_ACCOUNT_SID &&
  !!process.env.TWILIO_AUTH_TOKEN &&
  !!process.env.TWILIO_PHONE_NUMBER &&
  !!process.env.ADMIN_PHONE_NUMBER;

// Add more settings here as needed
export const BLOG_CONFIG = {
  postsPerPage: POSTS_PER_PAGE,
};
