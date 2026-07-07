import React, { useState } from 'react';

function PatientConsult() {
  // Mock Patient Data (In a real app, this would be fetched via API using a patient ID)
  const patient = {
    id: 'PT-89432',
    name: 'Sarah Jenkins',
    age: 34,
    gender: 'Female',
    bloodType: 'A+',
    allergies: 'Penicillin, Peanuts',
    vitals: { bp: '118/76', hr: '72 bpm', temp: '98.4°F', weight: '65 kg' }
  };

  // State for Consultation
  const [notes, setNotes] = useState('');
  
  // State for Prescriptions
  const [prescriptions, setPrescriptions] = useState([]);
  const [medInput, setMedInput] = useState({ name: '', dosage: '', frequency: '', duration: '' });

  // State for Lab Tests
  const [labTests, setLabTests] = useState([]);
  const [testInput, setTestInput] = useState('');

  // Handlers
  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (medInput.name) {
      setPrescriptions([...prescriptions, medInput]);
      setMedInput({ name: '', dosage: '', frequency: '', duration: '' }); // reset
    }
  };

  const handleAddLabTest = (e) => {
    e.preventDefault();
    if (testInput) {
      setLabTests([...labTests, testInput]);
      setTestInput(''); // reset
    }
  };

  const handleSaveRecord = () => {
    const consultationRecord = {
      patientId: patient.id,
      date: new Date().toISOString(),
      notes,
      prescriptions,
      labTests
    };
    
    console.log('Saving Consultation Record to DB:', consultationRecord);
    alert('Consultation saved successfully!');
    // Here you would typically make an API call: axios.post('/api/consultations', consultationRecord)
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* Header / Patient Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
            <p className="text-sm text-gray-500">ID: {patient.id} | {patient.age} Yrs | {patient.gender}</p>
          </div>
          <div className="bg-red-50 text-red-700 px-3 py-1 rounded-md text-sm font-semibold border border-red-100">
            Allergies: {patient.allergies}
          </div>
        </div>
        
        <hr className="my-4 border-gray-100" />
        
        {/* Vitals Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-xs text-blue-500 font-bold uppercase">Blood Pressure</p>
            <p className="text-lg font-semibold text-blue-900">{patient.vitals.bp}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-xs text-blue-500 font-bold uppercase">Heart Rate</p>
            <p className="text-lg font-semibold text-blue-900">{patient.vitals.hr}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-xs text-blue-500 font-bold uppercase">Temperature</p>
            <p className="text-lg font-semibold text-blue-900">{patient.vitals.temp}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-xs text-blue-500 font-bold uppercase">Weight</p>
            <p className="text-lg font-semibold text-blue-900">{patient.vitals.weight}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Notes & Lab Tests */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Consultation Notes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Consultation Notes</h2>
            <textarea 
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Enter symptoms, diagnosis, and observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Request Lab Tests */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Request Lab Tests</h2>
            <form onSubmit={handleAddLabTest} className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="e.g. Complete Blood Count" 
                className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
              />
              <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">
                Add
              </button>
            </form>
            
            {/* Lab Test List */}
            <ul className="space-y-2">
              {labTests.map((test, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="text-sm text-gray-700">{test}</span>
                  <button 
                    onClick={() => setLabTests(labTests.filter((_, i) => i !== index))}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {labTests.length === 0 && <p className="text-sm text-gray-400 italic">No lab tests requested.</p>}
            </ul>
          </div>
        </div>

        {/* Right Column: Prescriptions */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Prescribe Medicine</h2>
            
            <form onSubmit={handleAddMedicine} className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <input 
                type="text" placeholder="Medicine Name" required
                className="col-span-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={medInput.name} onChange={(e) => setMedInput({...medInput, name: e.target.value})}
              />
              <input 
                type="text" placeholder="Dosage (e.g. 500mg)" required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={medInput.dosage} onChange={(e) => setMedInput({...medInput, dosage: e.target.value})}
              />
              <input 
                type="text" placeholder="Frequency (e.g. 1-0-1)" required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={medInput.frequency} onChange={(e) => setMedInput({...medInput, frequency: e.target.value})}
              />
              <input 
                type="text" placeholder="Duration (e.g. 5 Days)" required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={medInput.duration} onChange={(e) => setMedInput({...medInput, duration: e.target.value})}
              />
              <div className="col-span-2 md:col-span-5 flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                  + Add Medicine
                </button>
              </div>
            </form>

            {/* Prescriptions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm">
                    <th className="p-3 rounded-tl-md">Medicine Name</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3 rounded-tr-md">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-6 text-gray-400 italic border-b border-gray-100">
                        No medicines prescribed yet.
                      </td>
                    </tr>
                  ) : (
                    prescriptions.map((med, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-3 font-medium text-gray-800">{med.name}</td>
                        <td className="p-3 text-gray-600">{med.dosage}</td>
                        <td className="p-3 text-gray-600">{med.frequency}</td>
                        <td className="p-3 text-gray-600">{med.duration}</td>
                        <td className="p-3">
                          <button 
                            onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-end gap-4">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition">
          Cancel
        </button>
        <button 
          onClick={handleSaveRecord}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition shadow-md"
        >
          Save Consultation Record
        </button>
      </div>

    </div>
  );
}

export default PatientConsult;