import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./ViewParticipant.css";
import GetAllCourses from "../services/courses/GetAllCourses";
import GetAllInstructors from "../services/instructors/GetAllInstructors";

const ViewParticipant = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { courses, loading: coursesLoading, error: coursesError } = GetAllCourses();
    const { instructors, loading: instructorsLoading, error: instructorsError } = GetAllInstructors();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        telephone: "",
        email: ""
    });

    const [registrations, setRegistrations] = useState([]);
    const [certifications, setCertifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCourseName = (courseId) => {
        const course = courses?.find(
            (course) => String(course.id) === String(courseId)
        );
        return course ? course.course_name : "Unknown Course";
    };

    const getInstructorName = (instructorId) => {
        const instructor = instructors?.find(
            (instructor) => String(instructor.id) === String(instructorId)
        );
        if (!instructor) return "Unknown Instructor";
        return `${instructor.first_name || ""} ${instructor.last_name || ""}`.trim();
    };

    // Helper with robust property fallback matching
    const getCertificationByRegistrationId = (registrationId) => {
        return certifications.find((cert) => 
            String(cert.registrationId || cert.registration_id || cert.id) === String(registrationId)
        );
    };

    // 1. Fetch Certification View Data
    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const response = await fetch(`http://192.168.0.67:8080/certification/fetch/participant/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch certification data");
                }
                const data = await response.json();
                console.log(data);
                setCertifications(Array.isArray(data) ? data : data ? [data] : []);
            } catch (err) {
                console.error("Error fetching certification data:", err);
            }
        };

        if (id) fetchCertifications();
    }, [id]);

    // 2. Fetch Participant Information
    useEffect(() => {
        const fetchParticipant = async () => {
            try {
                const response = await fetch(`http://192.168.0.67:8080/participants/fetch/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch participant data");
                }
                const data = await response.json();
                setFormData(data);
            } catch (err) {
                console.error("Error fetching participant data:", err);
                setError("Failed to load participant data.");
            }
        };

        if (id) fetchParticipant();
    }, [id]);

    // 3. Fetch Registrations
    useEffect(() => {
        const fetchRegistrations = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://192.168.0.67:8080/registrations/participant/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch registration data");
                }
                const data = await response.json();

                if (Array.isArray(data)) {
                    setRegistrations(data);
                } else if (data) {
                    setRegistrations([data]);
                } else {
                    setRegistrations([]);
                }
            } catch (err) {
                console.error("Error fetching registration data:", err);
                setError("Failed to load participant details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRegistrations();
    }, [id]);

    const formatDate = (dateValue) => {
        if (!dateValue) return "N/A";
        return String(dateValue);
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-person-badge me-2"></i>
                    Participant Details
                </h2>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                >
                    &larr; Back to List
                </button>
            </div>

            {loading && (
                <div className="text-center my-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{ width: "3rem", height: "3rem" }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted fw-semibold">Fetching details...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
                    <div>
                        <strong>Error: </strong>
                        {error}
                    </div>
                </div>
            )}

            {!loading && !error && (
                <div className="row g-4">
                    {/* Participant Information */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-primary text-white py-3">
                                <h5 className="card-title mb-0">Personal Information</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label className="form-label text-muted fw-bold small text-uppercase mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg bg-light"
                                        value={formData.first_name || ""}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-muted fw-bold small text-uppercase mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg bg-light"
                                        value={formData.last_name || ""}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-muted fw-bold small text-uppercase mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control bg-light"
                                        value={formData.email || ""}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-0">
                                    <label className="form-label text-muted fw-bold small text-uppercase mb-1">
                                        Telephone
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        value={formData.telephone || ""}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Information */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">Registration Details</h5>
                                <span className="badge bg-light text-dark">
                                    {registrations.length} Registration{registrations.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="card-body p-4">
                                {registrations.length === 0 ? (
                                    <div className="alert alert-info mb-0">
                                        No registrations found for this participant.
                                    </div>
                                ) : (
                                    registrations.map((registration, index) => {
                                        const matchCert = getCertificationByRegistrationId(registration.id);

                                        return (
                                            <div key={registration.id || index} className="mb-4">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6 className="fw-bold text-muted mb-0">
                                                        Registration #{index + 1}
                                                    </h6>
                                                    <span className="badge bg-secondary">
                                                        ID: {registration.id || "N/A"}
                                                    </span>
                                                </div>

                                                <div className="table-responsive">
                                                    <table className="table table-hover table-striped align-middle border">
                                                        <tbody>
                                                            <tr>
                                                                <th className="bg-light w-50">Registration ID</th>
                                                                <td>
                                                                    <span className="badge bg-secondary fs-6">
                                                                        {registration.id || "N/A"}
                                                                    </span>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="bg-light">Course</th>
                                                                <td>
                                                                    {coursesLoading ? (
                                                                        <span className="text-muted">Loading course...</span>
                                                                    ) : coursesError ? (
                                                                        <span className="text-danger">Error loading course</span>
                                                                    ) : registration.course_id ? (
                                                                        getCourseName(registration.course_id)
                                                                    ) : (
                                                                        "N/A"
                                                                    )}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="bg-light">Instructor</th>
                                                                <td>
                                                                    {instructorsLoading ? (
                                                                        <span className="text-muted">Loading instructor...</span>
                                                                    ) : instructorsError ? (
                                                                        <span className="text-danger">Error loading instructor</span>
                                                                    ) : registration.instructor_id ? (
                                                                        getInstructorName(registration.instructor_id)
                                                                    ) : (
                                                                        "N/A"
                                                                    )}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="bg-light">Registration Date</th>
                                                                <td>
                                                                    <span className="badge bg-info text-dark">
                                                                        {formatDate(registration.registration_date)}
                                                                    </span>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="bg-light">Issue Date</th>
                                                                <td>
                                                                    {matchCert?.issueDate || matchCert?.issue_date || "N/A"}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="bg-light">Expiration Date</th>
                                                                <td>
                                                                    {matchCert?.expirationDate || matchCert?.expiration_date || "N/A"}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="bg-light">Certification Status</th>
                                                                <td>
                                                                    {matchCert ? (
                                                                        <span
                                                                            className={`badge ${
                                                                                (matchCert.computedStatus || matchCert.computed_status) === "active"
                                                                                    ? "bg-success"
                                                                                    : "bg-danger"
                                                                            }`}
                                                                        >
                                                                            {matchCert.computedStatus || matchCert.computed_status}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="badge bg-secondary">N/A</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewParticipant;