"use client";

import React, { useState, useTransition, useMemo } from "react";
import { createAdmin, assignAbstract, updateAbstractStatus, updateRegistrationStatus, updateIopStatus, updateSlideStatus } from "./actions";
import { Search, ChevronDown, ChevronUp, Download, ExternalLink, CheckCircle2, Clock, FileText, CheckCircle, Ticket, Banknote, Users, BookOpen, PenTool, BarChart3, ArrowUpDown, UserCog, AlertCircle, MoreHorizontal } from "lucide-react";
import { UserDetail, AdminDetail, AbstractDetail, EventRegistrationDetail, IopDetail, SlideDetail, DashboardStats } from "./types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

function StatusSelect({
  id, currentStatus, options, onUpdate, colors
}: {
  id: string, currentStatus: string, options: string[], onUpdate: (id: string, val: string) => Promise<any>, colors: Record<string, string>
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(currentStatus);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setOptimistic(val);
    startTransition(async () => { await onUpdate(id, val); });
  };

  const currentClass = colors[optimistic] || 'border-gray-200 bg-gray-50 text-gray-700';

  return (
    <div className={`relative inline-flex items-center rounded-lg border-2 ${isPending ? 'opacity-60 cursor-not-allowed' : ''} ${currentClass}`}>
      <select
        value={optimistic}
        onChange={handleChange}
        disabled={isPending}
        className="appearance-none bg-transparent w-full pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer disabled:cursor-not-allowed"
      >
        {options.map(o => <option key={o} value={o} className="text-gray-900 bg-white">{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-2 pointer-events-none opacity-50" />
    </div>
  );
}

function SearchableSelect({ options, placeholder, label, name }: { options: { id: string, label: string }[], placeholder: string, label: string, name: string }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string, label: string } | null>(null);

  const filtered = useMemo(() => {
    return query === "" ? options : options.filter(opt => opt.label.toLowerCase().includes(query.toLowerCase()));
  }, [query, options]);

  return (
    <div className="relative flex-1 w-full min-w-0">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input type="hidden" name={name} value={selected?.id || ""} required />

      {selected ? (
        <div className="flex items-center justify-between w-full rounded-lg border border-blue-200 bg-blue-50 py-2.5 px-3 text-sm shadow-sm transition-colors min-w-0">
          <span className="font-medium text-blue-800 truncate pr-2 block">{selected.label}</span>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-blue-500 hover:text-blue-700 shrink-0"
            title="Clear selection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border-gray-300 pl-10 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors border bg-gray-50 focus:bg-white"
            placeholder={placeholder}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
          {isOpen && (
            <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-gray-500 text-center">No results found.</li>
              ) : (
                filtered.map((opt) => (
                  <li
                    key={opt.id}
                    className="relative cursor-pointer select-none px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSelected(opt);
                      setQuery("");
                      setIsOpen(false);
                    }}
                  >
                    {opt.label}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

const abstractColors: Record<string, string> = { 'Submitted': 'border-purple-200 bg-purple-50 text-purple-700', 'Under Review': 'border-blue-200 bg-blue-50 text-blue-700', 'Revision Required': 'border-orange-200 bg-orange-50 text-orange-700', 'Accepted': 'border-green-200 bg-green-50 text-green-700', 'Rejected': 'border-red-200 bg-red-50 text-red-700' };
const paymentColors: Record<string, string> = { 'Pending Payment': 'border-gray-200 bg-gray-50 text-gray-600', 'Verification Pending': 'border-yellow-200 bg-yellow-50 text-yellow-700', 'Verified': 'border-green-200 bg-green-50 text-green-700', 'Rejected': 'border-red-200 bg-red-50 text-red-700' };
const slideColors: Record<string, string> = { 'Under Review': 'border-blue-200 bg-blue-50 text-blue-700', 'Accepted': 'border-green-200 bg-green-50 text-green-700', 'Rejected': 'border-red-200 bg-red-50 text-red-700' };
const dotColors: Record<string, string> = { 'Submitted': 'bg-purple-500', 'Under Review': 'bg-blue-500', 'Revision Required': 'bg-orange-500', 'Accepted': 'bg-green-500', 'Rejected': 'bg-red-500' };

export function OverviewTab({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Total Revenue", val: formatCurrency(stats.verifiedRevenue), icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Total Registrations", val: stats.totalRegistrations, icon: Ticket, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Abstracts Accepted", val: stats.statusBreakdown.accepted || 0, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Reviews Completed", val: `${stats.reviews.completed} / ${stats.reviews.total}`, icon: FileText, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className={`p-4 rounded-xl ${c.bg} ${c.color}`}><c.icon size={26} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{c.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{c.val}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RegistrationsTab({ registrations }: { registrations: EventRegistrationDetail[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-gray-500">Attendee</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-500">Category & Info</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-500">Payment</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {registrations.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{r.user.name}</div>
                <div className="text-gray-500 text-xs">{r.user.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className="font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">{r.category}</span>
                {r.isIrmsMember && <div className="text-xs text-emerald-600 font-semibold mt-1">IRMS: {r.irmsMemberId}</div>}
              </td>
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900">{formatCurrency(r.amount)}</div>
                {r.paymentProofUrl ? (
                  <a href={r.paymentProofUrl} target="_blank" className="text-blue-600 hover:underline text-xs flex items-center mt-1"><ExternalLink size={12} className="mr-1"/> Proof</a>
                ) : <span className="text-gray-400 text-xs italic">No file</span>}
              </td>
              <td className="px-6 py-4">
                <StatusSelect
                  id={r.id} currentStatus={r.status} options={['Pending Payment', 'Verification Pending', 'Verified', 'Rejected']}
                  onUpdate={updateRegistrationStatus} colors={paymentColors}
                />
              </td>
            </tr>
          ))}
          {registrations.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No registrations found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function IopTab({ iopPublications }: { iopPublications: IopDetail[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-gray-500 w-[40%]">Abstract</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-500">Proof of Payment</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-500">Publication Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {iopPublications.map(i => (
            <tr key={i.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900 leading-snug">{i.abstract.title}</div>
                <div className="text-gray-500 text-xs mt-1">By: {i.abstract.author.name}</div>
              </td>
              <td className="px-6 py-4">
                {i.paymentProofUrl ? (
                  <a href={i.paymentProofUrl} target="_blank" className="inline-flex bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 transition"><Download size={14} className="mr-1.5"/> Download</a>
                ) : <span className="text-gray-400 text-xs">Awaiting upload</span>}
              </td>
              <td className="px-6 py-4">
                <StatusSelect
                  id={i.id} currentStatus={i.status} options={['Pending Payment', 'Verification Pending', 'Verified', 'Rejected']}
                  onUpdate={updateIopStatus} colors={paymentColors}
                />
              </td>
            </tr>
          ))}
          {iopPublications.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-gray-500">No IOP publications requested.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function SlidesTab({ slides }: { slides: SlideDetail[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-gray-500 w-[40%]">Abstract</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-500">Presentation Deck</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-500">Review Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {slides.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900 leading-snug">{s.abstract.title}</div>
                <div className="text-gray-500 text-xs mt-1">By: {s.abstract.author.name}</div>
              </td>
              <td className="px-6 py-4">
                <a href={s.fileUrl} target="_blank" className="inline-flex bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-100 transition"><ExternalLink size={14} className="mr-1.5"/> View Deck</a>
              </td>
              <td className="px-6 py-4">
                <StatusSelect
                  id={s.id} currentStatus={s.status} options={['Under Review', 'Accepted', 'Rejected']}
                  onUpdate={updateSlideStatus} colors={slideColors}
                />
              </td>
            </tr>
          ))}
          {slides.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-gray-500">No presentation slides submitted.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function AbstractsTab({ abstracts }: { abstracts: AbstractDetail[] }) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [progressSort, setProgressSort] = useState<'asc' | 'desc' | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const sortedAbstracts = useMemo(() => {
    if (!progressSort) return abstracts;
    return [...abstracts].sort((a, b) => {
      const getScore = (ab: AbstractDetail) => {
        const total = ab.assignments.length;
        if (total === 0) return -1;
        return ab.assignments.filter(x => x.isReviewed).length / total;
      };
      const scoreA = getScore(a);
      const scoreB = getScore(b);
      if (scoreA < scoreB) return progressSort === 'asc' ? -1 : 1;
      if (scoreA > scoreB) return progressSort === 'asc' ? 1 : -1;
      return 0;
    });
  }, [abstracts, progressSort]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12"></th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[45%]">Paper & Author</th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4 cursor-pointer hover:bg-gray-200/50 transition-colors group select-none"
                onClick={() => setProgressSort(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc')}
              >
                <div className="flex items-center space-x-1.5">
                  <span>Review Progress</span>
                  <div className="text-gray-400 group-hover:text-gray-700 transition-colors">
                    {progressSort === 'asc' ? <ChevronUp size={14} /> : progressSort === 'desc' ? <ChevronDown size={14} /> : <ArrowUpDown size={14} opacity={0.5} />}
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status & Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sortedAbstracts.map((ab) => {
              const completed = ab.assignments.filter(a => a.isReviewed).length;
              const total = ab.assignments.length;
              const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
              const isExpanded = expandedRows.has(ab.id);

              return (
                <React.Fragment key={ab.id}>
                  <tr className={`hover:bg-gray-50/50 transition-colors group ${isExpanded ? 'bg-blue-50/20' : ''}`}>
                    <td className="px-6 py-5 cursor-pointer" onClick={() => toggleRow(ab.id)}>
                      <button className="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-colors">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 leading-snug wrap-break-word mb-1">{ab.title}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="font-medium text-gray-700 mr-1">{ab.author.name}</span>
                            <span className="text-gray-400">({ab.author.email})</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      {total === 0 ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <MoreHorizontal size={14} />
                          <span>Unassigned</span>
                        </span>
                      ) : (
                        <div className="w-full max-w-50">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className={`font-medium ${completed === total ? 'text-green-600' : 'text-gray-600'}`}>
                              {completed} of {total} Reviewed
                            </span>
                            <span className="text-gray-400 font-medium">{progressPercent}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full transition-all duration-500 ${completed === total ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progressPercent}%` }}></div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top">
                      <StatusSelect
                        id={ab.id} currentStatus={ab.status} options={['Submitted', 'Under Review', 'Revision Required', 'Accepted', 'Rejected']}
                        onUpdate={updateAbstractStatus} colors={abstractColors}
                      />
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={4} className="bg-gray-50/80 px-8 py-6 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center"><BookOpen size={16} className="mr-2 text-blue-600" /> Submitted File</h4>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
                              <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="bg-red-100 text-red-600 p-2 rounded-md"><FileText size={20} /></div>
                                <span className="text-sm font-medium text-gray-700 truncate">{ab.fileName}</span>
                              </div>
                              <a
                                href={ab.path}
                                download={ab.fileName}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center space-x-1.5 bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                              >
                                <Download size={14} /> <span>Download</span>
                              </a>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center"><BarChart3 size={16} className="mr-2 text-purple-600" /> Review Results</h4>
                            {ab.assignments.length === 0 ? (
                              <div className="text-sm text-gray-500 italic bg-white border border-gray-200 rounded-lg p-4">No reviewers assigned yet.</div>
                            ) : (
                              <div className="space-y-3">
                                {ab.assignments.map((asgn, idx) => (
                                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                      <span className="text-sm font-semibold text-gray-900">{asgn.admin.name}</span>
                                      {asgn.isReviewed ? (
                                        <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200"><CheckCircle2 size={12} className="mr-1" /> Reviewed</span>
                                      ) : (
                                        <span className="inline-flex items-center text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200"><Clock size={12} className="mr-1" /> Pending</span>
                                      )}
                                    </div>

                                    {asgn.isReviewed && (
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                        <div className="flex justify-between border-b border-gray-50 pb-1">
                                          <span className="text-gray-500">Clarity:</span>
                                          <span className="font-medium text-gray-900">{asgn.scoreClarity ?? '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-1">
                                          <span className="text-gray-500">Quality:</span>
                                          <span className="font-medium text-gray-900">{asgn.scoreQuality ?? '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-1">
                                          <span className="text-gray-500">Completeness:</span>
                                          <span className="font-medium text-gray-900">{asgn.scoreCompleteness ?? '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-1">
                                          <span className="text-gray-500">Interesting:</span>
                                          <span className="font-medium text-gray-900">{asgn.scoreInteresting ?? '-'}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UsersTab({ users }: { users: UserDetail[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[25%]">Author Profile</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[35%]">Lead Author Contributions</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">Co-Author Contributions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 align-top">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-inner">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.affiliation && (
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 wrap-break-word">
                          {user.affiliation}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 align-top">
                  {user.abstracts.length === 0 ? (
                    <span className="text-sm text-gray-400 italic">No primary submissions</span>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {user.abstracts.map((ab) => {
                        const dotClass = dotColors[ab.status] || 'bg-gray-500';
                        return (
                          <div key={ab.id} className="flex items-start space-x-2 bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                            <PenTool className="w-3.5 h-3.5 text-blue-500 mt-1 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-800 font-medium leading-relaxed wrap-break-word">{ab.title}</p>
                              <div className="flex items-center mt-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${dotClass} mr-1.5`}></span>
                                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{ab.status}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 align-top">
                  {user.coauthoredAbstracts.length === 0 ? (
                    <span className="text-sm text-gray-400 italic">No co-authored papers</span>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {user.coauthoredAbstracts.map((ca) => {
                        const dotClass = dotColors[ca.abstract.status] || 'bg-gray-500';
                        return (
                          <div key={ca.abstract.id} className="flex items-start space-x-2 bg-gray-50 border border-gray-100 rounded-lg p-3">
                            <Users className="w-3.5 h-3.5 text-gray-400 mt-1 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-700 leading-relaxed wrap-break-word">{ca.abstract.title}</p>
                              <div className="flex items-center mt-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${dotClass} mr-1.5 opacity-50`}></span>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{ca.abstract.status}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminsTab({ admins, abstracts }: { admins: AdminDetail[], abstracts: AbstractDetail[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError("");
    const formData = new FormData(e.currentTarget);
    const res = await createAdmin(formData);
    if (res?.error) setError(res.error);
    else (e.target as HTMLFormElement).reset();
    setLoading(false);
  }

  async function handleAssign(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await assignAbstract(formData.get("adminId") as string, formData.get("abstractId") as string);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 animate-in fade-in duration-300">
      <div className="xl:col-span-2 space-y-6">
        <div className="rounded-2xl border border-blue-100 border-l-4 border-l-blue-500 bg-white p-6 shadow-sm relative">
          <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center"><FileText className="mr-2 h-5 w-5 text-blue-500" /> Assign Paper to Reviewer</h3>
          <form onSubmit={handleAssign} className="flex flex-col lg:flex-row gap-5 items-start lg:items-end w-full min-w-0">
            <SearchableSelect label="Select Reviewer" name="adminId" placeholder="Search by name..." options={admins.map(a => ({ id: a.id, label: `${a.name} (${a.role})` }))} />
            <SearchableSelect label="Select Abstract" name="abstractId" placeholder="Search by title..." options={abstracts.map(a => ({ id: a.id, label: a.title }))} />
            <button type="submit" disabled={loading} className="w-full lg:w-auto bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm shrink-0">
              Assign
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Profile</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignments & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-700 font-bold shadow-inner">
                          {getInitials(admin.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">@{admin.username}</div>
                          <span className="mt-1.5 inline-block rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700 uppercase tracking-wide">
                            {admin.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      {admin.assignments.length === 0 ? <span className="text-sm text-gray-400 italic">No active assignments</span> : (
                        <div className="space-y-2">
                          {admin.assignments.map((asgn) => (
                            <div key={asgn.abstract.id} className="flex flex-col text-sm border border-gray-100 bg-gray-50 rounded-lg p-3">
                              <span className="font-medium text-gray-800 line-clamp-1 mb-2">{asgn.abstract.title}</span>
                              <div className="flex items-center space-x-2">
                                {asgn.isReviewed ? (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md border border-green-200 flex items-center font-medium"><CheckCircle2 size={14} className="mr-1.5" /> Review Completed</span>
                                ) : (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md border border-yellow-200 flex items-center font-medium"><Clock size={14} className="mr-1.5" /> Pending Review</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit sticky top-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center"><UserCog className="mr-2 h-5 w-5 text-purple-500" /> Create Reviewer / Admin</h3>
        {error && <div className="mb-5 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200 flex items-start"><AlertCircle size={16} className="mt-0.5 mr-2 shrink-0" /> {error}</div>}
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input type="text" name="name" required className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white shadow-sm border p-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <input type="text" name="username" required className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white shadow-sm border p-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" name="password" required className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white shadow-sm border p-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <select name="role" required className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white shadow-sm border p-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors">
              <option value="Reviewer">Reviewer</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors font-medium mt-6 shadow-sm">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}