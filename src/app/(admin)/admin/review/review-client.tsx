"use client";

import { useState } from "react";
import { saveScores, addComment, uploadAnnotation, updateStatus } from "./actions";

type Assignment = {
  abstractId: string;
  adminId: string;
  isReviewed: boolean;
  scoreClarity: number | null;
  scoreQuality: number | null;
  scoreCompleteness: number | null;
  scoreInteresting: number | null;
  abstract: {
    id: string;
    title: string;
    topic: string;
    status: string;
    fileName: string;
    path: string;
    comments: { id: string; content: string; createdAt: Date }[];
    reviews: { id: string; fileName: string | null; filePath: string; createdAt: Date }[];
  };
};

export default function ReviewClient({ assignments, adminId }: { assignments: Assignment[], adminId: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Safely find the assignment. If selectedId is null, this naturally returns undefined.
  const activeAssignment = assignments.find(a => a.abstractId === selectedId);

  // Generic handler to wrap all our server actions
  const handleAction = async (
    e: React.FormEvent<HTMLFormElement>, 
    actionName: string, 
    actionFn: (data: FormData) => Promise<{error?: string, success?: boolean}>
  ) => {
    e.preventDefault();
    
    // DEFENSIVE GUARD: Stop execution if nothing is selected or the assignment is missing
    if (!selectedId || !activeAssignment) return;

    setActiveAction(actionName);
    
    const formData = new FormData(e.currentTarget);
    formData.append("adminId", adminId);
    
    // SAFE EXTRACTION: Use selectedId directly instead of reading from activeAssignment
    formData.append("abstractId", selectedId);

    const res = await actionFn(formData);
    
    if (res?.error) {
      alert(res.error);
    } else if (actionName === "comment" || actionName === "upload") {
      (e.target as HTMLFormElement).reset(); 
    }
    
    setActiveAction(null);
  };

  const ScoreRow = ({ label, name, defaultValue }: { label: string, name: string, defaultValue: number | null }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <span className="text-sm font-bold text-gray-900">{label}</span>
      <div className="flex space-x-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <label key={num} className="flex flex-col items-center cursor-pointer group">
            <span className="text-xs text-gray-400 mb-1">{num}</span>
            <input 
              type="radio" 
              name={name} 
              value={num} 
              defaultChecked={defaultValue === num}
              required 
              className="w-4 h-4 text-blue-600 border-gray-300" 
            />
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* GRID OF ABSTRACTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.abstractId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4 gap-2">
               <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-bold ${assignment.isReviewed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {assignment.isReviewed ? "Reviewed" : "Pending"}
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                Status: {assignment.abstract.status}
              </span>
            </div>
            
            <h3 className="font-bold text-gray-900 mb-2 leading-snug">{assignment.abstract.title}</h3>
            
            <div className="mt-auto pt-4">
               <button
                onClick={() => setSelectedId(assignment.abstractId)}
                className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
              >
                Open Workspace
              </button>
            </div>
          </div>
        ))}

        {assignments.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900">No Assignments Yet</h3>
            <p className="text-gray-500 mt-1 text-center">You have no assigned abstracts to review at the moment.</p>
          </div>
        )}
      </div>

      {/* WORKSPACE MODAL - Double check that activeAssignment exists */}
      {activeAssignment && selectedId && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b bg-gray-50 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Review Workspace</h3>
                <p className="text-sm font-medium text-gray-600 mt-2 line-clamp-1 border-l-4 border-blue-500 pl-3">
                  {activeAssignment.abstract.title}
                </p>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-600">
                ✕ Close
              </button>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              
              {/* LEFT COLUMN: Scores & Status */}
              <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r bg-white space-y-8">
                
                {/* Status Updater */}
                <form onSubmit={(e) => handleAction(e, "status", updateStatus)} className="bg-gray-50 p-4 rounded-lg border">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Decision / Status</label>
                  <div className="flex gap-2">
                    <select name="status" defaultValue={activeAssignment.abstract.status} className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border">
                      <option value="Under Review">Under Review</option>
                      <option value="Revision Required">Revision Required</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button type="submit" disabled={activeAction === "status"} className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900 disabled:opacity-50">
                      {activeAction === "status" ? "..." : "Update"}
                    </button>
                  </div>
                </form>

                {/* Score Form */}
                <form onSubmit={(e) => handleAction(e, "scores", saveScores)}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-900">Grading Rubric</h4>
                    <span className="text-xs text-gray-400">1 (Poor) - 5 (Excellent)</span>
                  </div>
                  <div className="space-y-1 bg-white border p-4 rounded-lg shadow-sm">
                    <ScoreRow label="Clarity & Relevance" name="scoreClarity" defaultValue={activeAssignment.scoreClarity} />
                    <ScoreRow label="Language Quality" name="scoreQuality" defaultValue={activeAssignment.scoreQuality} />
                    <ScoreRow label="Completeness" name="scoreCompleteness" defaultValue={activeAssignment.scoreCompleteness} />
                    <ScoreRow label="Global Interest" name="scoreInteresting" defaultValue={activeAssignment.scoreInteresting} />
                  </div>
                  <button type="submit" disabled={activeAction === "scores"} className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {activeAction === "scores" ? "Saving..." : "Save Scores & Mark Reviewed"}
                  </button>
                </form>
              </div>

              {/* RIGHT COLUMN: Original File, Comments & Annotations */}
              <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-gray-50 space-y-8">
                
                {/* Original File */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Original Submission</h4>
                  <a href={activeAssignment.abstract.path} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-white border rounded-lg text-sm text-blue-600 hover:bg-blue-50 shadow-sm transition-colors">
                    📄 Download Original PDF
                  </a>
                </div>

                {/* Comments Section */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Feedback Discussion</h4>
                  <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                    {activeAssignment.abstract.comments.length === 0 && <p className="text-sm text-gray-400 italic">No comments yet.</p>}
                    {activeAssignment.abstract.comments.map(c => (
                      <div key={c.id} className="bg-white p-3 rounded-lg border text-sm text-gray-700 shadow-sm">
                        {c.content}
                      </div>
                    ))}
                  </div>
                  <form onSubmit={(e) => handleAction(e, "comment", addComment)} className="flex gap-2">
                    <input type="text" name="content" required placeholder="Add a comment..." className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
                    <button type="submit" disabled={activeAction === "comment"} className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 disabled:opacity-50">
                      {activeAction === "comment" ? "..." : "Post"}
                    </button>
                  </form>
                </div>

                {/* Uploads Section */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Annotated Files</h4>
                  <ul className="space-y-2 mb-4">
                    {activeAssignment.abstract.reviews.length === 0 && <p className="text-sm text-gray-400 italic">No files uploaded.</p>}
                    {activeAssignment.abstract.reviews.map(r => (
                      <li key={r.id}>
                        <a href={r.filePath} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                          📎 {r.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={(e) => handleAction(e, "upload", uploadAnnotation)} className="bg-white p-4 rounded-lg border shadow-sm">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Upload marked-up document</label>
                    <div className="flex gap-2">
                      <input type="file" name="annotatedFile" required className="flex-1 text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                      <button type="submit" disabled={activeAction === "upload"} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
                        {activeAction === "upload" ? "..." : "Upload"}
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}