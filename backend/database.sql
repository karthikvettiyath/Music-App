


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('student', 'teacher', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    teacher_id INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(course_id),
    title VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    duration INTEGER, -- in minutes
    meeting_id VARCHAR(255), -- Agora channel name or token
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    course_id INTEGER REFERENCES courses(course_id),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(class_id),
    student_id INTEGER REFERENCES users(user_id),
    join_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
