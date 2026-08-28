import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigate
import "./RegisterParticipant.css";
import { useParams } from "react-router-dom"; // Added to get the participant ID from the URL
import { useEffect } from "react"; // Added to fetch participant data on mount
import GetAllCourses from "../course/GetAllCourses";
import GetAllInstructors from "../instructor/GetAllInstructors";


const RegisterParticipant = () => {
    const { id } = useParams(); // Added to get the participant ID from the URL
    const navigate = useNavigate(); // Added navigate hook

    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer); // Cleanup interval
    }, []);
    
    const [formData, setFormData] = useState({
        course_id: "",
        instructor_id: "",
        participant_id: id, // Set the participant_id to the ID from the URL
        registration_date: time.toLocaleDateString(), // Default to today's date
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { courses, loading: coursesLoading, error: coursesError } = GetAllCourses();
    const { instructors, loading: instructorsLoading, error: instructorsError } = GetAllInstructors();

    const [courseSelectedId, setCourseSelectedId] = useState("");


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

         try {
            
            const registrationResponse = await fetch("http://192.168.0.67:8080/registrations/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!registrationResponse.ok) throw new Error("Failed to add registration.");

            const registrationData = await registrationResponse.json();
            console.log("Registration added successfully:", registrationData);

            // 3. Add Certification
            const isoDate = new Date().toISOString().split('T')[0];
            const certPayload = {
                registration_id: registrationData.id,
                participant_id: id,
                issue_date: isoDate
            };
            console.log("STEP 3 - certPayload:", certPayload);

            const certificationRaw = await fetch("http://192.168.0.67:8080/certification/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(certPayload)
            });

            const certificationText = await certificationRaw.text();
            console.log(certificationRaw.status);
            console.log(certificationText);

            if (!certificationRaw.ok) throw new Error(`Failed to add certification: ${certificationText}`);

            console.log("All steps succeeded.");

            //Navigate after BOTH requests succeed
            navigate("/participants");

        } catch (err) {
            console.error("Error during submission:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    

    return (
        <div className="form-container">
            <div className="form-card">
                <div className="form-header">
                    <h2>{formData.first_name} {formData.last_name}</h2>

                    <p>Fill in the registration details.</p>
                </div>
                {error && <div className="form-error">{error}</div>}
                <form onSubmit={handleSubmit} className="student-form">
                    

                     {/* ── Course Dropdown ── */}
                    <div className="mb-3">
                        <label htmlFor="course_id" className="form-label fw-bold">
                            Course <span className="text-danger">*</span>
                        </label>

                        {/* Loading State */}
                        {coursesLoading && (
                            <div className="d-flex align-items-center gap-2 text-muted small">
                                <div className="spinner-border spinner-border-sm" role="status" />
                                <span>Loading courses...</span>
                            </div>
                        )}

                        {/* Error State */}
                        {coursesError && (
                            <div className="text-danger small mt-1">{coursesError}</div>
                        )}

                        {/* Dropdown Select */}
                        {!coursesLoading && !coursesError && (
                            <select
                                id="course_id"
                                name="course_id"
                                className="form-select"
                                value={formData.course_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>
                                    -- Select a course --
                                </option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.course_name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="instructor_id" className="form-label fw-bold">
                            Instructor <span className="text-danger">*</span>
                        </label>

                        {/* Loading State */}
                        {instructorsLoading && (
                            <div className="d-flex align-items-center gap-2 text-muted small">
                                <div className="spinner-border spinner-border-sm" role="status" />
                                <span>Loading instructors...</span>
                            </div>
                        )}

                        {/* Error State */}
                        {instructorsError && (
                            <div className="text-danger small mt-1">{instructorsError}</div>
                        )}

                        {/* Dropdown Select */}
                        {!instructorsLoading && !instructorsError && (
                            <select
                                id="instructor_id"
                                name="instructor_id"
                                className="form-select"
                                value={formData.instructor_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>
                                    -- Select an instructor --
                                </option>
                                {instructors.map((instructor) => (
                                    <option key={instructor.id} value={instructor.id}>
                                        {instructor.first_name} {instructor.last_name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/participants")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Submitting..." : "Register Participant"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterParticipant;