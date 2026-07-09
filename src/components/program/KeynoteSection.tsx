"use client";

import { motion } from 'framer-motion';
import SpeakerCard from './SpeakerCard';

const speakers = [
  {
    name: "Okky Chandra Perdana, S.T., M.T.",
    title: "Operational Director",
    organization: "PT. Anggun Permai Tekindo",
    image: "/image/keynote/Okky Chandra.jpg",
    bio: [
      "Okky Chandra Perdana, ST, MT is a seasoned mining engineering professional with over 20 years of experience in coal mining, tunneling, geotechnical, and concrete services. He holds a Bachelor’s and Master’s degree in Mining Engineering from UPN Veteran Yogyakarta, specializing in Geomechanics, as well as a Master’s degree in Strategic Management from Prasetiya Mulya University.",
      "Currently serving as Operational Director of PT Anggun Permai Tekindo and Director of PT Aptekindo Mitra Solusitama, he brings strong leadership, extensive technical expertise, and a solid track record in managing large-scale mining projects across Indonesia, with a firm commitment to professionalism, innovation, and sustainable industry development."
    ],
    sessionOverview: ["To Be Announced (TBA)"]
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
    ],
    sessionOverview: ["To Be Announced (TBA)"]
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
    ],
    sessionOverview: ["To Be Announced (TBA)"]
  },
  {
    name: "Lufi Rachmad M.Eng",
    title: "Managing Director and Principal",
    organization: "GEOMINE Mining",
    image: "/image/keynote/Lufi Rachmad.jpeg",
    bio: [
      "Lufi has 29 years of experience in geotechnical, mine design, mine operation, and mine management. He graduated from Institut Teknologi Bandung, majoring in Mining Engineering in 1996 (cum laude), and earned his Master's degree from Colorado School of Mines (CSM) in 1997.",
      "He worked at PT Freeport Indonesia, Freeport McMoran New Orleans, BHP Nickel West, St Barbara Gwalia, and Baramulti Coal group with various technical and senior management position before establishing a consulting company, GEOMINE Mining and Geotechnical Consultant.",
      "Lufi earned the KCMI Competent Person Indonesia, JORC Competent Person and is a Fellow Member of AusIMM. He has been actively contributing to the PERHAPI organization and is the past chairman of Kombers KCMI IAGI PERHAPI. He has been the Indonesian representative for CRIRSCO (Committee for Mineral Reserves International Reporting Standards) since 2017 and has been elected as the CRIRSCO Executive Secretary from 2023-2026."
    ],
    sessionTitle: "Rock Mechanics in the Era of Deeper Mining, Emerging Technologies, and Sustainable Resource Development",
    sessionOverview: [
      "The mining industry is undergoing rapid transformation, driven by increasing demand for critical minerals, deeper ore deposits, more complex geological conditions, and higher sustainability expectations. These changes require geotechnical engineering to become more predictive, integrated, and technology-driven.",
      "Rock mechanics has evolved beyond ensuring excavation stability. It now plays a strategic role in improving mine safety, operational resilience, and sustainable resource development through a better understanding of rock mass behaviour and geotechnical risks.",
      "This keynote discusses the major challenges associated with deeper mining, including high-stress environments, rockburst, and tailings management. It also highlights how emerging technologies such as numerical modeling, AI, machine learning, and real-time monitoring are transforming geotechnical engineering practices.",
      "By integrating engineering fundamentals with advanced technologies and risk-informed decision-making, rock mechanics continues to evolve in response to the changing mining landscape. This session provides insights into how rock mechanics is supporting the future of deeper, safer, and more sustainable mining."
    ]
  },
  {
    name: "Alessandro Maggioni",
    title: "Product Manager Soil and Rock Equipment",
    organization: "CONTROLS Group",
    image: "/image/keynote/Alessandro Maggioni.jpeg",
    bio: [
      "Alessandro Maggioni serves as the Product Manager of the Soil Mechanics business unit at CONTROLS Group, a position he has held since November 2011. He specializes in testing equipment for the construction industries, managing both standard and advanced equipment for soil mechanics laboratories.",
      "He holds a Master of Science and a Bachelor of Science in Civil Engineering from the Politecnico di Milano. His foundational education includes a Scientific High School Degree from the Istituto Statale di Istruzione Superiore “Leonardo da Vinci” in Cologno Monzese."
    ],
    sessionTitle: "Rock Testing for Uniaxial and Triaxial",
    sessionOverview: ["To Be Announced (TBA)"]
  }
];

export default function KeynoteSection() {
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

        <div className="flex flex-col h-full snap-y snap-mandatory scroll-p-24 overflow-y-visible">
          {speakers.map((speaker, idx) => (
            <SpeakerCard key={idx} speaker={speaker} />
          ))}
        </div>
      </div>
    </section>
  );
}