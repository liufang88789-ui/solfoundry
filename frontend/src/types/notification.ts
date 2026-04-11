export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'off';

export interface NotificationPreferences {
  id?: number;
  user_id: string;
  email_enabled: boolean;
  frequency: NotificationFrequency;
  notify_bounty_posted: boolean;
  notify_bounty_updated: boolean;
  notify_deadline_reminder: boolean;
  notify_bounty_completed: boolean;
  notify_review_feedback: boolean;
  notify_submission_accepted: boolean;
  notify_submission_rejected: boolean;
  notify_payment_sent: boolean;
  digest_day: number;           // 0=Mon … 6=Sun
  digest_time: string;           // HH:MM UTC
  email?: string;
  interested_skills: string[];
  created_at?: string;
  updated_at?: string;
}

export interface NotificationPreferencesUpdate {
  email_enabled?: boolean;
  frequency?: NotificationFrequency;
  notify_bounty_posted?: boolean;
  notify_bounty_updated?: boolean;
  notify_deadline_reminder?: boolean;
  notify_bounty_completed?: boolean;
  notify_review_feedback?: boolean;
  notify_submission_accepted?: boolean;
  notify_submission_rejected?: boolean;
  notify_payment_sent?: boolean;
  digest_day?: number;
  digest_time?: string;
  email?: string;
  interested_skills?: string[];
}
