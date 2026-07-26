'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { complaintService } from '@/services/complaintService';

const CATEGORIES = ['Maintenance', 'Noise', 'Cleanliness', 'Security', 'Roommate', 'Other'];

interface ComplaintFormProps {
  onSubmitted?: () => void;
}

export default function ComplaintForm({ onSubmitted }: ComplaintFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await complaintService.create({ title, description, category });
      toast.success('Complaint submitted');
      setTitle('');
      setCategory('');
      setDescription('');
      onSubmitted?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white/70 backdrop-blur-sm ' +
    'text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 ' +
    'focus:ring-indigo-500 focus:border-transparent transition-shadow';

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3"
    >
      <h2 className="text-sm font-semibold text-slate-700">Submit a New Complaint</h2>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of the issue"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe what happened..."
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded-lg text-white text-sm font-medium
          bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90
          disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </motion.form>
  );
}