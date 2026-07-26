'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AnnouncementFeed from '@/features/announcements/AnnouncementFeed';
import { announcementService, type Announcement } from '@/services/announcementService';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementService
      .getAll()
      .then((res) => setAnnouncements(res.data.data))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load announcements'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Announcements</h1>
        <p className="text-slate-500 text-sm mt-1">
          Updates and notices from the hostel administration.
        </p>
      </div>

      <AnnouncementFeed announcements={announcements} loading={loading} />
    </div>
  );
}