import { supabase } from "./supabase";

export interface ContactSubmission {
  name?: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Submits a contact form entry to Supabase
 */
export async function submitContactForm(data: ContactSubmission) {
  const { error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        name: data.name || 'Anonymous',
        email: data.email,
        subject: data.subject,
        message: data.message,
      }
    ]);

  if (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }

  return { success: true };
}

/**
 * Subscribes an email to the newsletter in Supabase
 */
export async function subscribeToNewsletter(email: string) {
  const { error } = await supabase
    .from('newsletter_subscriptions')
    .insert([{ email }]);

  if (error) {
    // 23505 is the error code for unique constraint violation (already subscribed)
    if (error.code === '23505') {
      return { success: true, alreadySubscribed: true };
    }
    console.error("Error subscribing to newsletter:", error);
    throw error;
  }

  return { success: true };
}
