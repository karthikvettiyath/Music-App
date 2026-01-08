
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Courses = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', price: '' });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            // Fetching "my" courses for now. Can be toggled to all courses.
            const res = await axios.get('http://localhost:5000/api/courses/my');
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/courses', newCourse);
            setNewCourse({ title: '', description: '', price: '' });
            fetchCourses();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Courses</h1>

            {user.role === 'teacher' && (
                <div className="mb-8 p-6 bg-white rounded shadow">
                    <h3 className="text-xl font-bold mb-4">Create New Course</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Course Title"
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={newCourse.price}
                            onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Create Course</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {courses.map(course => (
                    <div key={course.course_id} className="p-4 bg-white border rounded shadow">
                        <h3 className="text-xl font-bold">{course.title}</h3>
                        <p className="text-gray-600">{course.description}</p>
                        <p className="font-semibold text-green-600 mt-2">₹{course.price}</p>
                    </div>
                ))}
                {courses.length === 0 && <p>No courses found.</p>}
            </div>
        </div>
    );
};

export default Courses;
