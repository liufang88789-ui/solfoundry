import { apiClient, setAuthToken, getAuthToken } from '../services/apiClient';
import type {
  NotificationPreferences,
  NotificationPreferencesUpdate,
} from '../types/notification';

export interface EmailPreview {
  subject: string;
  html: string;
  text: string;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return apiClient<NotificationPreferences>('/api/notifications/preferences');
}

export async function updateNotificationPreferences(
  update: NotificationPreferencesUpdate,
): Promise<NotificationPreferences> {
  return apiClient<NotificationPreferences>('/api/notifications/preferences', {
    method: 'PUT',
    body: update,
  });
}

export async function previewEmail(
  eventType: string,
  bountyId?: string,
  bountyTitle?: string,
): Promise<EmailPreview> {
  return apiClient<EmailPreview>('/api/notifications/preview', {
    method: 'POST',
    params: { eventType },
    body: {
      bounty_id: bountyId,
      bounty_title: bountyTitle,
    },
  });
}
