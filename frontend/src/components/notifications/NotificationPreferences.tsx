import { useState } from 'react';
import type {
  NotificationPreferences,
  NotificationPreferencesUpdate,
} from '../../types/notification';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../../api/notifications';

const FREQUENCY_OPTIONS = [
  { value: 'immediate', label: 'Immediate', description: 'Get notified as events happen' },
  { value: 'daily', label: 'Daily Digest', description: 'One email per day, summarizing new bounties' },
  { value: 'weekly', label: 'Weekly Digest', description: 'One email per week' },
  { value: 'off', label: 'Off', description: 'No email notifications' },
] as const;

const EVENT_LABELS: Record<string, { label: string; description: string }> = {
  notify_bounty_posted: {
    label: '💎 New bounty matching your skills',
    description: 'Email when a new bounty matches your interests',
  },
  notify_bounty_updated: {
    label: '📝 Bounty updated',
    description: 'Email when a bounty description or reward changes',
  },
  notify_deadline_reminder: {
    label: '⏰ Deadline reminder',
    description: 'Email 24 hours before a bounty deadline',
  },
  notify_bounty_completed: {
    label: '✅ Bounty completed',
    description: 'Email when a bounty is merged/closed',
  },
  notify_review_feedback: {
    label: '📋 Review feedback received',
    description: 'Email when multi-LLM review gives feedback on your PR',
  },
  notify_submission_accepted: {
    label: '🎉 Submission accepted',
    description: 'Email when your submission is accepted',
  },
  notify_submission_rejected: {
    label: '❌ Submission not accepted',
    description: 'Email when your submission is not accepted',
  },
  notify_payment_sent: {
    label: '💰 Payment sent',
    description: 'Email when $FNDRY payout is confirmed on-chain',
  },
};

const EVENT_KEYS = Object.keys(EVENT_LABELS) as (keyof NotificationPreferences)[];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Props {
  userId: string;
}

export function NotificationPreferencesPanel({ userId }: Props) {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificationPreferences();
      setPrefs(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }

  async function save(update: NotificationPreferencesUpdate) {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateNotificationPreferences(update);
      setPrefs(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6 text-[#8b949e]">Loading preferences…</div>;
  if (!prefs) {
    return (
      <div className="p-6">
        <p className="text-[#8b949e] mb-4">No preferences found.</p>
        <button onClick={load} className="btn-primary">Load preferences</button>
      </div>
    );
  }

  const isDigest = prefs.frequency === 'daily' || prefs.frequency === 'weekly';

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#e6edf3]">Email Notifications</h2>
        <button
          onClick={load}
          className="text-sm text-[#1f6feb] hover:underline"
        >
          Reload
        </button>
      </div>

      {error && (
        <div className="bg-[#3d1a1a] border border-[#f85149] rounded p-3 text-[#f85149] text-sm">
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-[#1a3d2a] border border-[#3fb950] rounded p-3 text-[#3fb950] text-sm">
          ✓ Preferences saved successfully
        </div>
      )}

      {/* Master toggle */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#1f6feb]"
            checked={prefs.email_enabled}
            onChange={(e) => save({ email_enabled: e.target.checked })}
            disabled={saving}
          />
          <div>
            <div className="font-medium text-[#e6edf3]">Enable email notifications</div>
            <div className="text-sm text-[#8b949e]">Turn off to pause all bounty emails</div>
          </div>
        </label>
      </div>

      {/* Frequency */}
      {prefs.email_enabled && (
        <>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
            <h3 className="font-medium text-[#e6edf3] mb-3">Email frequency</h3>
            <div className="space-y-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-[#161b22]"
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={opt.value}
                    checked={prefs.frequency === opt.value}
                    onChange={() => save({ frequency: opt.value })}
                    disabled={saving}
                    className="mt-1 accent-[#1f6feb]"
                  />
                  <div>
                    <div className="text-[#e6edf3]">{opt.label}</div>
                    <div className="text-xs text-[#8b949e]">{opt.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Digest schedule */}
          {isDigest && (
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
              <h3 className="font-medium text-[#e6edf3] mb-3">Digest schedule</h3>
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm text-[#8b949e] mb-1">Day of week</label>
                  <select
                    value={prefs.digest_day}
                    onChange={(e) => save({ digest_day: parseInt(e.target.value) })}
                    disabled={saving}
                    className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-[#e6edf3] text-sm"
                  >
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8b949e] mb-1">Time (UTC)</label>
                  <input
                    type="time"
                    value={prefs.digest_time}
                    onChange={(e) => save({ digest_time: e.target.value })}
                    disabled={saving}
                    className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-[#e6edf3] text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Per-event toggles */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
            <h3 className="font-medium text-[#e6edf3] mb-3">Notification events</h3>
            <div className="space-y-3">
              {EVENT_KEYS.map((key) => {
                const ev = EVENT_LABELS[key];
                const val = prefs[key] as boolean;
                return (
                  <label
                    key={key}
                    className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-[#161b22]"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 accent-[#1f6feb]"
                      checked={val}
                      onChange={(e) => save({ [key]: e.target.checked })}
                      disabled={saving}
                    />
                    <div>
                      <div className="text-[#e6edf3] text-sm">{ev.label}</div>
                      <div className="text-xs text-[#8b949e]">{ev.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Custom email address */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
            <h3 className="font-medium text-[#e6edf3] mb-3">Notification email address</h3>
            <input
              type="email"
              value={prefs.email ?? ''}
              placeholder={prefs.email ?? 'your@email.com'}
              onBlur={(e) => save({ email: e.target.value || undefined })}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[#e6edf3] text-sm placeholder-[#484f58]"
            />
            <p className="text-xs text-[#8b949e] mt-2">
              Leave blank to use your account email.
            </p>
          </div>

          {/* Interested skills */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
            <h3 className="font-medium text-[#e6edf3] mb-3">Interested skills</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              You'll only be notified about bounties matching these skills.
            </p>
            <div className="flex flex-wrap gap-2">
              {prefs.interested_skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-[#1f6feb] text-white text-xs px-2 py-0.5 rounded-full"
                >
                  {skill}
                  <button
                    onClick={() =>
                      save({
                        interested_skills: prefs.interested_skills.filter((s) => s !== skill),
                      })
                    }
                    className="text-white/70 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <SkillInput
              existing={prefs.interested_skills}
              onAdd={(skill) =>
                save({ interested_skills: [...prefs.interested_skills, skill] })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

function SkillInput({ existing, onAdd }: { existing: string[]; onAdd: (s: string) => void }) {
  const [value, setValue] = useState('');
  function add() {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !existing.includes(trimmed)) {
      onAdd(trimmed);
    }
    setValue('');
  }
  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && add()}
        placeholder="e.g. python, react, rust"
        className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-[#e6edf3] text-sm placeholder-[#484f58]"
      />
      <button
        onClick={add}
        className="bg-[#238636] text-white text-sm px-4 py-1.5 rounded hover:bg-[#2ea043]"
      >
        Add
      </button>
    </div>
  );
}
