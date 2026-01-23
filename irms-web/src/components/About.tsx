const About = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-irms-blue mb-8">About The Conference</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          The <span className="font-semibold text-gray-900">Indonesian Rock Mechanics Society (IRMS) Conference 2026</span> is a 
          national scientific forum that brings together academics, researchers, practitioners, 
          and stakeholders in the field of rock mechanics and rock engineering.
        </p>
        <div className="mt-8 p-6 bg-irms-light border-l-4 border-irms-red text-left rounded-r-lg">
          <p className="text-gray-700 italic">
            &quot;This conference aims to promote the development and application of safe, efficient, 
            and sustainable rock engineering practices in support of the mining, energy, 
            infrastructure, and disaster mitigation sectors.&quot;
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;