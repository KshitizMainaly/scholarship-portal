import React from "react";
import studentImg from "../assets/student.jpeg";

const ScholarshipBanner: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-red-100 to-pink-200 p-8 md:p-12 rounded-3xl shadow-2xl mt-8 mb-10 border border-red-200">
      <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-10">
        <img
          src={studentImg}
          alt="Student"
          className="w-64 h-64 object-cover rounded-2xl shadow-md"
        />
      </div>

      <div className="flex flex-col justify-center max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug mb-4">
          Unlock your future — Get a scholarship for your dream university in Nepal.
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Scholarships are not just for academic toppers. Explore opportunities that match your potential and passion.
        </p>

        <div className="flex flex-wrap gap-3">
          {[
            "Kathmandu University",
            "Pokhara University",
            "Tribhuvan University",
            "Purbanchal University",
          ].map((uni) => (
            <span
              key={uni}
              className="bg-white/70 border border-gray-300 text-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-white transition-all"
            >
              🏛️ {uni}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipBanner;
