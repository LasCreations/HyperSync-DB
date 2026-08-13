import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
const GetAllCourses = () => {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://192.168.0.67:8080/courses/fetch/all")
            .then(response => response.json())
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
                setError("Failed to load courses.");
                setLoading(false);
            });
    }, []);

    return {courses, loading, error};
}

export default GetAllCourses;