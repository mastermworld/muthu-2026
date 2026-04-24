import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Mutharaiyar Admin Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Welcome to the central management system. From here you can manage members, donations, and more.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/members" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold text-primary mb-2">Member Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Register, view, and manage member profiles.</p>
        </Link>
        <Link to="/donations" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold text-primary mb-2">Donation Processing</h2>
          <p className="text-gray-600 dark:text-gray-400">Track one-time and recurring donations.</p>
        </Link>
        <Link to="/idcards/generate" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold text-primary mb-2">ID Card Generation</h2>
          <p className="text-gray-600 dark:text-gray-400">Issue and print member ID cards.</p>
        </Link>
        <Link to="/dashboard" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold text-primary mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">View real-time reports and statistics.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
