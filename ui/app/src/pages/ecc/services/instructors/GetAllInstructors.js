
import  { useState, useEffect } from 'react';


const GetAllInstructors = () => {


    
        const [instructors, setInstructors] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
        fetch("http://192.168.0.67:8080/instructors/fetch/all")
            .then(response => response.json())
            .then(data => {
                setInstructors(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching instructors:", error);
                setError("Failed to load instructors.");
                setLoading(false);
            });
    }, []);

  return {instructors, loading, error};
};

export default GetAllInstructors;