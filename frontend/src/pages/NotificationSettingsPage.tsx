import { useAuth } from '../hooks/useAuth';
import { NotificationPreferencesPanel } from '../components/notifications/NotificationPreferences';

export function NotificationSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Notification Settings</h1>
          <p className="text-[#8b949e] text-sm">
            Control which emails SolFoundry sends you and how often.
          </p>
        </div>

        {user ? (
          <NotificationPreferencesPanel userId={user.id} />
        ) : (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 text-center">
            <p className="text-[#8b949e]">
              Please sign in to manage your notification preferences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
