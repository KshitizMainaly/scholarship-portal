import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApplyNow = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    citizenshipNumber: '',
    ethnicity: '',
    paymentMethod: '',
    university: '',
    program: ''
  });
  const [seeCertificate, setSeeCertificate] = useState<File | null>(null);
  const [plusTwoCertificate, setPlusTwoCertificate] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const universities = [
    "Tribhuvan University",
    "Kathmandu University",
    "Pokhara University",
    "Purbanchal University",
    "Mid-West University",
    "Far-Western University"
  ];
  
  const programs = ['Computer Science', 'Business', 'Engineering', 'Medicine', 'Law'];
  const ethnicities = ['Janjati', 'Dalit', 'Disabled','women' , 'Others'];
  const paymentMethods = ['eSewa', 'Khalti', 'Bank Transfer', 'PayPal'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'see' | 'plusTwo') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError(`${type === 'see' ? 'SEE' : '+2'} certificate must be less than 5MB`);
        return;
      }
      if (type === 'see') {
        setSeeCertificate(file);
      } else {
        setPlusTwoCertificate(file);
      }
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.citizenshipNumber || 
        !formData.ethnicity || !formData.paymentMethod ||
        !formData.university || !formData.program || 
        !seeCertificate || !plusTwoCertificate) {
      setError('Please fill in all required fields and upload both certificates');
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (seeCertificate) formDataToSend.append('seeCertificate', seeCertificate);
      if (plusTwoCertificate) formDataToSend.append('plusTwoCertificate', plusTwoCertificate);

      const response = await axios.post('http://localhost:5000/api/applications', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Application submitted:', response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">University Application</h1>
      
      {/* Service Fee Notice */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-blue-700">
          <strong>Note:</strong> A service fee of NPR 500 will be charged for processing your application.
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Citizenship Number *</label>
              <input
                type="text"
                name="citizenshipNumber"
                value={formData.citizenshipNumber}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="e.g. 123-456-789"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Ethnicity *</label>
              <select
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">-- Select Ethnicity --</option>
                {ethnicities.map((eth) => (
                  <option key={eth} value={eth}>{eth}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Certificate Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">SEE Certificate *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'see')}
                  required
                  className="w-full"
                />
                {seeCertificate && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {seeCertificate.name} ({Math.round(seeCertificate.size / 1024)} KB)
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 5MB)</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">+2 Certificate *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'plusTwo')}
                  required
                  className="w-full"
                />
                {plusTwoCertificate && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {plusTwoCertificate.name} ({Math.round(plusTwoCertificate.size / 1024)} KB)
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Education Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Select University *</label>
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">-- Select University --</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Select Program *</label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">-- Select Program --</option>
                {programs.map((prog) => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Payment Method *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method} className="flex items-center">
                      <input
                        id={`payment-${method}`}
                        name="paymentMethod"
                        type="radio"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        required
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor={`payment-${method}`} className="ml-2 block text-sm text-gray-700">
                        {method}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              A service fee of NPR 500 will be required after form submission.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-md ${
                isLoading ? 'bg-yellow-700' : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-green-50 border border-green-200 rounded-md">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Application Submitted!</h2>
          <p className="text-green-700 mb-4">Thank you for your application. We'll review your information and get back to you soon.</p>
          
          <div className="bg-blue-50 p-4 rounded mb-4">
            <h3 className="font-medium text-blue-800 mb-2">Payment Instructions</h3>
            <p className="text-blue-700">
              Please complete your NPR 500 payment via {formData.paymentMethod} to:
            </p>
            <ul className="list-disc pl-5 mt-2 text-blue-700">
              <li>Account: Scholarship Portal</li>
              <li>Reference: Your Email ({formData.email})</li>
            </ul>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Return Home
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplyNow;