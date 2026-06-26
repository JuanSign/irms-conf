"use client";

import { Users, GraduationCap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const organizingCommittee = [
  { id: 1, name: "Yudhidya Wicaksana", institution: "ITB" },
  { id: 2, name: "Ganda Marihot Simangunsong", institution: "ITB" },
  { id: 3, name: "Rachmat Musa", institution: "GroundProbe Indonesia" },
  { id: 4, name: "Cyrillus Arthur Saputra", institution: "APTEKINDO" },
  { id: 5, name: "Novandri Kusuma Wardana", institution: "Geomine Bara Studio" },
  { id: 6, name: "Tri Karian", institution: "ITB" },
  { id: 7, name: "Danu Putra", institution: "Universitas Trisakti" },
  { id: 8, name: "Yuga Maulana", institution: "Universitas Trisakti" },
  { id: 9, name: "Abdul Salam Munir", institution: "UMI Makassar" },
  { id: 10, name: "Habibie Anwar", institution: "UMI Makassar" },
  { id: 11, name: "Yuliadi", institution: "Universitas Islam Bandung" },
  { id: 12, name: "Risto Salia Zakri", institution: "Universitas Negeri Padang" },
  { id: 13, name: "Antonina Pri Martireni", institution: "BRIN" },
  { id: 14, name: "Bagaraja Sirait", institution: "tekMIRA" },
  { id: 15, name: "Lusitania", institution: "Universitas Sriwijaya" },
  { id: 16, name: "Tommy Trides", institution: "Universitas Mulawarman" },
  { id: 17, name: "Romla Noor Hakim", institution: "Universitas Lambung Mangkurat" },
  { id: 18, name: "Dylan Gema Kurniawan", institution: "ITB" },
  { id: 19, name: "Inzagi Suhendar", institution: "ITB" },
  { id: 20, name: "Semmy Andrew A.D.T.", institution: "ITB" },
  { id: 21, name: "Bonifacio Bondan Satryojati", institution: "ITB" },
  { id: 22, name: "Diva Faizah Hanuun", institution: "ITB" },
  { id: 23, name: "Kharis Novianto Nugroho", institution: "ITB" },
  { id: 24, name: "M. Lefrand Reyva Reynaldi", institution: "ITB" },
  { id: 25, name: "Raisa Priscilia", institution: "ITB" },
  { id: 26, name: "Anindya Nada Arinal Haque", institution: "ITB" },
  { id: 27, name: "Ahmad Wildan Hafidh", institution: "ITB" },
];

const scientificCommittee = [
  { id: 1, name: "Simon Heru Prassetyo", institution: "ITB" },
  { id: 2, name: "Made Astawa Rai", institution: "IRMS" },
  { id: 3, name: "Irwandy Arif", institution: "IRMS" },
  { id: 4, name: "Suseno Kramadibrata", institution: "IRMS" },
  { id: 5, name: "Budi Sulistianto", institution: "ITB" },
  { id: 6, name: "Nuhindro Priagung Widodo", institution: "ITB" },
  { id: 7, name: "Eman Widijanto", institution: "Freeport Indonesia" },
  { id: 8, name: "Barlian Dwinagara", institution: "UPN Veteran Yogyakarta" },
  { id: 9, name: "Singgih Saptono", institution: "UPN Veteran Yogyakarta" },
  { id: 10, name: "Yan Ardiansyah", institution: "Gorontalo Mineral" },
  { id: 11, name: "Pantjanita Novi Hartami", institution: "Universitas Trisakti" },
  { id: 12, name: "Supandi", institution: "Institut Teknologi Nasional Yogyakarta" },
  { id: 13, name: "Imam Sadisun", institution: "ITB" },
  { id: 14, name: "Andhika Sahadewa", institution: "ITB" },
  { id: 15, name: "Aswin Lim", institution: "Universitas Katolik Parahyangan" },
  { id: 16, name: "Purwanto", institution: "Universitas Hasanuddin" },
  { id: 17, name: "Nirmana Fiqra Qaidahiyani", institution: "Seoul National University" },
  { id: 18, name: "Doandy Mangunsong", institution: "Brierley Associates" },
  { id: 19, name: "Sari Melati", institution: "Universitas Lambung Mangkurat" },
  { id: 20, name: "Fauzan Yudho Pratomo", institution: "University of Adelaide" },
];

// Helper to assign consistent tag colors based on institution name
const getInstitutionColor = (institution: string) => {
  if (institution === "ITB") return "bg-blue-50 text-blue-700 border-blue-200";
  if (institution === "IRMS") return "bg-red-50 text-red-700 border-red-200";

  const palettes = [
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-indigo-50 text-indigo-700 border-indigo-200",
    "bg-cyan-50 text-cyan-700 border-cyan-200",
    "bg-slate-100 text-slate-700 border-slate-300",
    "bg-teal-50 text-teal-700 border-teal-200",
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    "bg-rose-50 text-rose-700 border-rose-200"
  ];

  let hash = 0;
  for (let i = 0; i < institution.length; i++) {
    hash = institution.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return palettes[Math.abs(hash) % palettes.length];
};

export default function CommitteePage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="mb-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-irms-blue transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-irms-red font-bold text-sm tracking-widest uppercase flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-irms-red"></span> The Foundation
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-irms-dark tracking-tight mb-6">
              Conference <span className="text-irms-blue">Committees</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
              Meet the dedicated professionals, academics, and industry leaders working behind the scenes to make IRMS 2026 a premier scientific event.
            </p>
          </motion.div>
        </div>

        <div className="space-y-24">
          
          {/* Organizing Committee Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200"
            >
              <div className="p-3 bg-irms-blue/10 rounded-xl text-irms-blue shrink-0">
                <Users size={28} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-irms-dark">Organizing Committee</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Executing the vision and logistics of IRMS 2026</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {organizingCommittee.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-irms-blue/30 hover:shadow-xl hover:shadow-irms-blue/5 transition-all duration-300 flex flex-col justify-center items-start group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-irms-blue transition-colors"></div>
                  <h3 className="text-lg font-bold text-irms-dark leading-tight mb-4 group-hover:text-irms-blue transition-colors">
                    {member.name}
                  </h3>
                  <div className={`mt-auto inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wide ${getInstitutionColor(member.institution)}`}>
                    {member.institution}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Scientific Committee Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200"
            >
              <div className="p-3 bg-irms-red/10 rounded-xl text-irms-red shrink-0">
                <GraduationCap size={28} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-irms-dark">Scientific Committee</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Ensuring academic excellence and research integrity</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {scientificCommittee.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-irms-red/30 hover:shadow-xl hover:shadow-irms-red/5 transition-all duration-300 flex flex-col justify-center items-start group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-irms-red transition-colors"></div>
                  <h3 className="text-lg font-bold text-irms-dark leading-tight mb-4 group-hover:text-irms-red transition-colors">
                    {member.name}
                  </h3>
                  <div className={`mt-auto inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wide ${getInstitutionColor(member.institution)}`}>
                    {member.institution}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}