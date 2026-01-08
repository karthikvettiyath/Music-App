
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name}</h1>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-2">My Courses</h3>
                    <p className="text-gray-600 mb-4">View your enrolled causes or teaching list.</p>
                    <Link to="/courses" className="text-blue-600 hover:underline">Go to Courses &rarr;</Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-2">My Classes</h3>
                    <p className="text-gray-600 mb-4">Check upcoming classes and sessions.</p>
                    <Link to="/live" className="text-blue-600 hover:underline">Join Live Class &rarr;</Link>
                </div>

                {user?.role === 'teacher' && (
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
                        <h3 className="text-xl font-semibold mb-2">Teacher Actions</h3>
                        <p className="text-gray-600 mb-4">Schedule new classes and manage students.</p>
                        <Link to="/courses" className="text-indigo-600 hover:underline">Manage Courses &rarr;</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
