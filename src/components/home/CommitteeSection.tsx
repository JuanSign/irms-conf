"use client";

import { motion } from 'framer-motion';

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
  // Brand specific overrides
  if (institution === "ITB") return "bg-blue-50 text-blue-700 border-blue-200";
  if (institution === "IRMS") return "bg-red-50 text-red-700 border-red-200";

  // Consistent hashing for other institutions
  const palettes = [
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-indigo-50 text-indigo-700 border-indigo-200",
    "bg-cyan-50 text-cyan-700 border-cyan-200",
    "bg-slate-100 text-slate-700 border-slate-300",
    "bg-teal-50 text-teal-700 border-teal-200",
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  ];

  let hash = 0;
  for (let i = 0; i < institution.length; i++) {
    hash = institution.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return palettes[Math.abs(hash) % palettes.length];
};

const CommitteeSection = () => {
  return (
    <section id="committee" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-irms-blue font-bold text-sm tracking-widest uppercase">The Team</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-irms-dark mt-4">Scientific Committee</h2>
        </motion.div>

        {/* Dense Grid Layout for Text-Only Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {scientificCommittee.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-irms-blue/30 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-center items-start group"
            >
              <h3 className="text-lg font-bold text-irms-dark leading-tight mb-3 group-hover:text-irms-blue transition-colors">
                {member.name}
              </h3>
              
              <div className={`mt-auto inline-flex items-center px-3 py-1.5 rounded-md border text-xs font-bold tracking-wide ${getInstitutionColor(member.institution)}`}>
                {member.institution}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CommitteeSection;