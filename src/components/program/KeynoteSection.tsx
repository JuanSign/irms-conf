"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const speakers = [
  {
    name: "Okky Chandra Perdana, S.T., M.T.",
    title: "Operational Director",
    organization: "PT. Anggun Permai Tekindo",
    image: "/image/keynote/Okky Chandra.jpg",
    bio: [
      "Okky Chandra Perdana, ST, MT is a seasoned mining engineering professional with over 20 years of experience in coal mining, tunneling, geotechnical, and concrete services. He holds a Bachelor’s and Master’s degree in Mining Engineering from UPN Veteran Yogyakarta, specializing in Geomechanics, as well as a Master’s degree in Strategic Management from Prasetiya Mulya University.",
      "Currently serving as Operational Director of PT Anggun Permai Tekindo and Director of PT Aptekindo Mitra Solusitama, he brings strong leadership, extensive technical expertise, and a solid track record in managing large-scale mining projects across Indonesia, with a firm commitment to professionalism, innovation, and sustainable industry development."
    ]
  },
  {
    name: "Neal Harries",
    title: "Director - Mine Monitoring APAC",
    organization: "Hexagon Geosystems",
    image: "/image/keynote/Neal Harries.jpeg",
    bio: [
      "As Senior Director of Hexagon Mine Monitoring, Neal Harries leads the mine monitoring business across the Asia Pacific region, spanning from Armenia through to New Zealand.",
      "Neal holds a PhD in Rock Mechanics from The University of Queensland, completed under the supervision of Prof. E.T. Brown between 1995 and 2001. Following his studies, he held several roles as a senior research engineer in geotechnics and as a consulting geotechnical engineer across both civil and mining projects.",
      "Since joining Hexagon in January 2011, Neal has held a number of senior leadership positions, including leading Product Management teams, driving New Business initiatives (including Technology Partnerships and Autonomous Mining Strategy), and overseeing the North American Mining business.",
      "With over 30 years of experience in the mining industry, Neal remains passionate about supporting the sector in effectively managing geotechnical hazards at operational mines, and continues to be inspired by the critical role monitoring plays in improving safety and performance."
    ]
  },
  {
    name: "Dr. techn. Indra Noer Hamdan, S.T., M.T.",
    title: "Expert Team Member / Head of NGC",
    organization: "Road Safety and Road Tunnels Commission / ITENAS",
    image: "/image/keynote/Indra Noer.jpeg",
    bio: [
      "Dr. techn. Indra Noer Hamdhan, S.T., M.T. is the Head of the National Geotechnics Center (NGC) at the Institut Teknologi Nasional (ITENAS), Bandung, Indonesia, and a full-time faculty member in the Department of Civil Engineering. He is a geotechnical engineering expert with extensive academic and professional experience in soil mechanics, engineering geology, foundation engineering, slope stability, numerical modeling, and underground construction, with particular expertise in tunnel engineering.",
      "Dr. techn. Indra Noer Hamdhan received his Bachelor's and Master's degrees in Civil Engineering from the Bandung Institute of Technology (ITB), Indonesia, and earned his Doctor of Technical Sciences (Dr. techn.) from Graz University of Technology (TU Graz), Austria, one of Europe's leading universities in engineering and applied sciences.",
      "In addition to his academic responsibilities, Dr. techn. Indra Noer Hamdhan serves as a Bentley Channel Partner in Indonesia, supporting the implementation of advanced engineering software for education, research, and professional engineering practice. His research interests include geotechnical engineering, tunnel engineering, soil–structure interaction, finite element analysis, deep excavations, and performance-based geotechnical design."
    ]
  },
  {
    name: "Lufi Rachmad M.Eng",
    title: "Managing Director and Principal",
    organization: "GEOMINE Mining",
    image: "/image/keynote/Lufi Rachmad.jpeg",
    bio: ["To Be Announced (TBA)"]
  },
  {
    name: "Alessandro Maggioni",
    title: "Product Manager Soil and Rock Equipment",
    organization: "CONTROLS Group",
    image: "/image/keynote/Alessandro Maggioni.jpeg",
    bio: ["To Be Announced (TBA)"]
  }
];

const KeynoteSection = () => {
  return (
    <section className="py-24 bg-irms-light relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-irms-blue font-bold text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="w-8 h-px bg-irms-blue"></span> Eminent Voices
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-irms-dark mt-4">Keynote Speakers</h2>
        </motion.div>

        <div className="flex flex-col gap-12">
          {speakers.map((speaker, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-8 md:gap-12"
            >
              {/* Speaker Image */}
              <div className="w-48 h-48 md:w-64 md:h-64 relative shrink-0 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-md mx-auto md:mx-0">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Speaker Details */}
              <div className="flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-irms-dark leading-tight mb-2 text-center md:text-left">
                    {speaker.name}
                  </h3>
                  <p className="text-irms-blue font-bold text-lg mb-1 text-center md:text-left">
                    {speaker.title}
                  </p>
                  <p className="text-slate-500 font-medium text-center md:text-left">
                    {speaker.organization}
                  </p>
                </div>

                <div className="w-full h-px bg-slate-100 mb-6"></div>

                {/* Biography */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Biography</h4>
                  {speaker.bio.map((paragraph, i) => (
                    <p key={i} className={`text-slate-600 leading-relaxed ${paragraph.includes('TBA') ? 'italic' : ''}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeynoteSection;