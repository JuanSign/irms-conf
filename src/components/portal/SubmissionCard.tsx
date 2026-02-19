import { useState } from 'react';
import { Clock, MoreVertical, FileText, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AbstractSubmission } from '@/types/submission';

interface SubmissionCardProps {
  sub: AbstractSubmission;
}

export default function SubmissionCard({ sub }: SubmissionCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const formattedDate = new Date(sub.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(sub.path);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${sub.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error("Failed to download file.");
      window.open(sub.path, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mb-4 group">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock size={12} /> {sub.status}
              </span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-1.5 leading-tight group-hover:text-irms-blue transition-colors">
              {sub.title}
            </h4>
            <p className="text-sm text-gray-500 font-medium">
              Topic: <span className="text-gray-700">{sub.topic}</span>
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      <div className="bg-slate-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <div className="text-gray-500 font-medium flex items-center gap-1.5">
          <FileText size={14} /> Submitted on {formattedDate}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:text-irms-blue hover:border-irms-blue/30 transition-all disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading ? 'Downloading...' : 'PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}