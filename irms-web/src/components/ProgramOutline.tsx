import React from 'react';

export default function ProgramOutline() {
  const scheduleData = [
    {
      date: "Sun, Nov 22, 2026",
      reg: "Registration",
      program: ["ISRM Board Meeting", "Workshop", "Short Course"],
      exhibit: "",
      social: ""
    },
    {
      date: "Mon, Nov 23, 2026",
      reg: "Registration",
      program: ["ISRM Commission Meetings", "ISRM Council Meeting", "Workshop", "Short Course"],
      exhibit: "",
      social: "Welcome Reception"
    },
    {
      date: "Tue, Nov 24, 2026",
      reg: "Registration",
      program: ["Opening Ceremony", "ISRM Rocha Medal Award", "ISRM Franklin Lecture", "Oral Sessions", "Poster Session"],
      exhibit: "Exhibition",
      social: ""
    },
    {
      date: "Wed, Nov 25, 2026",
      reg: "Registration",
      program: ["Keynote Lectures", "Oral Sessions"],
      exhibit: "Exhibition",
      social: "Banquet"
    }
  ];

  return (
    <section className="w-full min-h-screen flex flex-col items-center bg-white text-gray-800 py-20 px-4 md:px-10">

      <div className='text-4xl md:text-6xl font-bold mb-12 tracking-tight text-center text-[#04233A]'>
        Program Outline
      </div>

      <div className='w-full max-w-7xl overflow-x-auto shadow-lg rounded-lg'>
        <table className='w-full border-collapse bg-white text-left text-sm md:text-base text-gray-800'>

          <thead className='bg-[#C71F2D] text-white uppercase tracking-wider'>
            <tr>
              <th className='p-5 border-r-2 border-white/30'>Date</th>
              <th className='p-5 border-r-2 border-white/30'>Registration</th>
              <th className='p-5 border-r-2 border-white/30'>Scientific Program</th>
              <th className='p-5 border-r-2 border-white/30'>Exhibition</th>
              <th className='p-5'>Social Events</th>
            </tr>
          </thead>

          <tbody className='divide-y-2 divide-gray-200'>
            {scheduleData.map((item, index) => (
              <tr key={index} className="hover:bg-[#FCEECB]/30 transition-colors">

                <td className='p-4 border-r-2 border-gray-200 font-bold bg-transparent text-[#04233A] align-top w-1/6'>
                  {item.date}
                </td>

                <td className='p-4 border-r-2 border-gray-200 align-top w-1/6'>
                  {item.reg && (
                    <ul className="list-disc list-inside">
                        <li>{item.reg}</li>
                    </ul>
                  )}
                </td>

                <td className='p-4 border-r-2 border-gray-200 align-top w-2/6'>
                  <ul className='list-disc list-inside space-y-1'>
                    {item.program.map((prog, i) => (
                      <li key={i}>{prog}</li>
                    ))}
                  </ul>
                </td>

                <td className='p-4 border-r-2 border-gray-200 align-top w-1/6'>
                   {item.exhibit && (
                    <ul className="list-disc list-inside">
                        <li>{item.exhibit}</li>
                    </ul>
                  )}
                </td>

                <td className='p-4 align-top w-1/6 font-bold text-[#C71F2D]'>
                   {item.social && (
                    <ul className="list-disc list-inside">
                        <li>{item.social}</li>
                    </ul>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
}