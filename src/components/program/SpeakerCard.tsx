"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpeakerCard({ speaker }: { speaker: any }) {
  const [activeTab, setActiveTab] = useState<'bio' | 'session'>('bio');
  const [isExpanded, setIsExpanded] = useState(false);

  const content = activeTab === 'bio' ? speaker.bio : speaker.sessionOverview;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[70vh] justify-center snap-center my-8"
    >
      <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start shrink-0">
        <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-2xl overflow-hidden border-4 border-slate-50 shadow-md mb-6">
          <Image
            src={speaker.image}
            alt={speaker.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-irms-dark leading-tight mb-2 text-center lg:text-left">
          {speaker.name}
        </h3>
        <p className="text-irms-blue font-bold text-lg mb-1 text-center lg:text-left">
          {speaker.title}
        </p>
        <p className="text-slate-500 font-medium text-center lg:text-left">
          {speaker.organization}
        </p>
      </div>

      <div className="flex-1 flex flex-col w-full h-full">
        <div className="flex border-b border-slate-200 mb-6 w-full">
          <button
            onClick={() => setActiveTab('bio')}
            className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${
              activeTab === 'bio' ? 'text-irms-blue' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Biography
            {activeTab === 'bio' && (
              <motion.div layoutId={`tab-indicator-${speaker.name}`} className="absolute bottom-0 left-0 right-0 h-0.5 bg-irms-blue" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('session')}
            className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${
              activeTab === 'session' ? 'text-irms-blue' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Session Overview
            {activeTab === 'session' && (
              <motion.div layoutId={`tab-indicator-${speaker.name}`} className="absolute bottom-0 left-0 right-0 h-0.5 bg-irms-blue" />
            )}
          </button>
        </div>

        <div className="relative flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {activeTab === 'session' && speaker.sessionTitle && (
                <p className="text-irms-dark font-bold leading-relaxed text-lg mb-4">
                  {speaker.sessionTitle}
                </p>
              )}
              
              <div className={`space-y-4 ${!isExpanded ? 'line-clamp-4 md:line-clamp-6' : ''}`}>
                {content.map((paragraph: string, i: number) => (
                  <p key={i} className={`text-slate-600 leading-relaxed ${paragraph.includes('TBA') ? 'italic' : ''}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {(!content[0].includes('TBA')) && (
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