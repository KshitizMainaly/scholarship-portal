import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Application {
  _id: string;
  name: string;
  email: string;
  citizenshipNumber: string;
  university: string;
  program: string;
  seeCertificatePath: string;
  plusTwoCertificatePath: string;
  createdAt: string;
}

const Blog = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/applications', {
          headers: {
            'admin-key': import.meta.env.VITE_ADMIN_KEY || 'admin@98049'
          }
        });
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Submitted Applications</h1>
      
      {applications.length === 0 ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
          <p>No applications found in the database.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Citizenship No.</th>
                <th className="py-3 px-6 text-left">University</th>
                <th className="py-3 px-6 text-left">Program</th>
                <th className="py-3 px-6 text-left">SEE Certificate</th>
                <th className="py-3 px-6 text-left">+2 Certificate</th>
                <th className="py-3 px-6 text-left">Date Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{app.name}</td>
                  <td className="py-4 px-6">{app.email}</td>
                  <td className="py-4 px-6">{app.citizenshipNumber}</td>
                  <td className="py-4 px-6">{app.university}</td>
                  <td className="py-4 px-6">{app.program}</td>
                  <td className="py-4 px-6">
                    <a
                      href={`http://localhost:5000/${app.seeCertificatePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      View
                    </a>
                  </td>
                  <td className="py-4 px-6">
                    <a
                      href={`http://localhost:5000/${app.plusTwoCertificatePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      View
                    </a>
                  </td>
                  <td className="py-4 px-6">
                    {new Date(app.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Blog;