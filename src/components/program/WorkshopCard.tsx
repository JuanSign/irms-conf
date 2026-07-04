"use client";

import { useState } from 'react';
import { BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkshopCard({ workshop, index }: { workshop: any, index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isTBA = typeof workshop.overview === 'string' && workshop.overview.includes('TBA');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 lg:gap-12"
    >
      {/* Left Column: Workshop Identity */}
      <div className="md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-8">
        <div className="text-irms-blue bg-irms-blue/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          {workshop.icon}
        </div>
        <h3 className="text-2xl font-extrabold text-irms-dark leading-snug mb-6">
          {workshop.title}
        </h3>
        <div className="mt-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Presented By</p>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {workshop.logos.map((logoPath: string, i: number) => (
              <img key={i} src={logoPath} alt="Presenter Logo" className="h-10 max-w-[120px] object-contain" />
            ))}
          </div>
          <div className="border-l-2 border-irms-red pl-3 mt-4">
            {workshop.presenterNode}
          </div>
        </div>
      </div>

      {/* Right Column: Content */}
      <div className="md:w-2/3 flex flex-col">
        {/* Constrained Height Container */}
        <div className={`relative transition-all duration-500 ease-in-out ${!isExpanded && !isTBA ? 'max-h-[300px] overflow-hidden' : ''}`}>
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Workshop Overview
              </h4>
              <p className={`text-slate-600 leading-relaxed ${isTBA ? 'italic' : ''}`}>
                {workshop.overview}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Presenter Background
              </h4>
              <div className={`text-slate-600 leading-relaxed ${typeof workshop.presenterInfo === 'string' && workshop.presenterInfo.includes('TBA') ? 'italic' : ''}`}>
                {workshop.presenterInfo}
              </div>
            </div>
          </div>

          {/* Fade out gradient when collapsed */}
          {!isExpanded && !isTBA && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Action Button */}
        {!isTBA && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 self-start text-irms-blue font-semibold text-sm hover:underline flex items-center gap-1"
          >
            {isExpanded ? 'Show Less ↑' : 'Read More ↓'}
          </button>
        )}
      </div>
    </motion.div>
  );
}