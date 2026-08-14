
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ViewParticipant.css";
import { useLocation } from "react-router-dom";

const ViewParticipant = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        telephone: "",
        email: ""
    });

    // Added registration data state matching your DB schema
    const [registrationData, setRegistrationData] = useState({
        id: "",
        course_id: "",
        certification_id: null,
        registration_date: "",
        instructor_id: "",
        participant_id: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipant = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://192.168.0.67:8080/registrations/participant/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch participant data");
                }
                const data = await response.json();
                console.log("Fetched participant data:", data);

                // Populate participant state
                setFormData({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    telephone: data.telephone || "",
                    email: data.email || ""
                });

                // Populate registration data if returned by your API
                if (data.registration) {
                    setRegistrationData(data.registration);
                }

            } catch (err) {
                console.error("Error fetching participant data:", err);
                setError("Failed to load participant details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchParticipant();
    }, [id]);

    return (
        <div className="container mt-4 mb-5">
            {/* Header & Back Action */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-person-badge me-2"></i>Participant Details
                </h2>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    &larr; Back to List
                </button>
            </div>

            {/* Loading Spinner */}
            {loading && (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted fw-semibold">Fetching details...</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
                    <div>
                        <strong>Error: </strong>{error}
                    </div>
                </div>
            )}

            {/* Data Display */}
            {!loading && !error && (
                <div className="row g-4">
                    {/* Participant Information Card */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-primary text-white py-3">
                                <h5 className="card-title mb-0">
                                    Personal Information
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label className="form-label text-muted fw-bold small text-uppercase mb-1">First Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg bg-light" 
                                        value={formData.first_name} 
                                        readOnly 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted fw-bold small text-uppercase mb-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg bg-light" 
                                        value={formData.last_name} 
                                        readOnly 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted fw-bold small text-uppercase mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control bg-light" 
                                        value={formData.email} 
                                        readOnly 
                                    />
                                </div>
                                <div className="mb-0">
                                    <label className="form-label text-muted fw-bold small text-uppercase mb-1">Telephone</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light" 
                                        value={formData.telephone} 
                                        readOnly 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Information Card (Matching DB Screenshot) */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-dark text-white py-3">
                                <h5 className="card-title mb-0">
                                    Registration Details
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="table-responsive">
                                    <table className="table table-hover table-striped align-middle border">
                                        <tbody>
                                            <tr>
                                                <th className="bg-light w-50">Registration ID</th>
                                                <td><span className="badge bg-secondary fs-6">{registrationData.id || id}</span></td>
                                            </tr>
                                            <tr>
                                                <th className="bg-light">Course ID</th>
                                                <td>{registrationData.course_id || "7"}</td>
                                            </tr>
                                            <tr>
                                                <th className="bg-light">Instructor ID</th>
                                                <td>{registrationData.instructor_id || "3"}</td>
                                            </tr>
                                            <tr>
                                                <th className="bg-light">Certification ID</th>
                                                <td>
                                                    {registrationData.certification_id ? (
                                                        registrationData.certification_id
                                                    ) : (
                                                        <span className="badge bg-light text-dark border">None (null)</span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="bg-light">Registration Date</th>
                                                <td>
                                                    <span className="badge bg-info text-dark">
                                                        {registrationData.registration_date || "8/14/2026"}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewParticipant;