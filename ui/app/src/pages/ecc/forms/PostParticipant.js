import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostParticipant.css";
import GetAllCourses from "../course/GetAllCourses";
import GetAllInstructors from "../instructor/GetAllInstructors";
import { useEffect } from "react";

const PostParticipant = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        telephone: "",
        email: "",
        occupation: "",
        workplace: "",
        course_id: "",
        instructor_id: ""
    });


    const { courses, loading: coursesLoading, error: coursesError } = GetAllCourses();
    const { instructors, loading: instructorsLoading, error: instructorsError } = GetAllInstructors();

    const [courseSelectedId, setCourseSelectedId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer); // Cleanup interval
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const isoDate = new Date().toISOString().split('T')[0];

            // 1. Add Participant
            const participantRaw = await fetch("http://192.168.0.67:8080/participants/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const participantText = await participantRaw.text();
            console.log("Participant raw response:", participantText);

            if (!participantRaw.ok) throw new Error(`Failed to add participant: ${participantText}`);

            const participantData = JSON.parse(participantText);

            if (!participantData.id) throw new Error("Participant was created but no 'id' was returned. Check backend response.");

            // 2. Add Registration
            const registrationPayload = {
                course_id: Number(formData.course_id),
                instructor_id: Number(formData.instructor_id),
                participant_id: participantData.id,
                registration_date: isoDate
            };
            console.log("STEP 2 - registrationPayload:", registrationPayload);

            const registrationRaw = await fetch("http://192.168.0.67:8080/registrations/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registrationPayload)
            });

            const registrationText = await registrationRaw.text();
            console.log( registrationRaw.status);
            console.log( registrationText);

            if (!registrationRaw.ok) throw new Error(`Failed to add registration: ${registrationText}`);

            const registrationData = JSON.parse(registrationText);
            console.log("STEP 2 - registrationData.id:", registrationData.id);

            if (!registrationData.id) throw new Error("Registration was created but no 'id' was returned. Check backend response.");

            // 3. Add Certification
            const certPayload = {
                registration_id: registrationData.id,
                participant_id: participantData.id,
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
            navigate("/participants");

        } catch (err) {
            console.error("Error during submission:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="form-container">
            <div className="form-card">
                <div className="form-header">
                    <h1>Register New Participant</h1>
                    <p>Fill in the details below to register a new participant.</p>
                </div>

                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit} className="student-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                id="first_name"
                                type="text"
                                name="first_name"
                                placeholder="e.g. John"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                id="last_name"
                                type="text"
                                name="last_name"
                                placeholder="e.g. Doe"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="telephone">Telephone</label>
                        <input
                            id="telephone"
                            type="text"
                            name="telephone"
                            placeholder="e.g. +1 555 000 0000"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="e.g. john@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="occupation">Occupation</label>
                        <input
                            id="occupation"
                            type="text"
                            name="occupation"
                            placeholder="e.g. Engineer"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="workplace">Workplace</label>
                        <input
                            id="workplace"
                            type="text"
                            name="workplace"
                            placeholder="e.g. Tech Corp"
                            value={formData.workplace}
                            onChange={handleInputChange}
                            required
                        />
                    </div>


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
                        <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Submitting..." : "Add Participant"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostParticipant;