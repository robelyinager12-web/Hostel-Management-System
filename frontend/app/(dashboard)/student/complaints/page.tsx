'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import ComplaintForm from '@/features/complaints/ComplaintForm';
import ComplaintList from '@/features/complaints/ComplaintList';
import { complaintService, type Complaint } from '@/services/complaintService';

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = useCallback(() => {
    setLoading(true);
    complaintService
      .getMine()
      .then((res) => setComplaints(res.data.data))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load complaints'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Complaints</h1>
        <p className="text-slate-500 text-sm mt-1">
          Report an issue or check the status of your past complaints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <ComplaintForm onSubmitted={fetchComplaints} />
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Your Complaints</h2>
          <ComplaintList complaints={complaints} loading={loading} />
        </div>
      </div>
    </div>
  );
}