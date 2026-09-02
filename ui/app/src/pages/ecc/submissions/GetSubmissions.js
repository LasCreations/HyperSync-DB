import React, { useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { fetchParticipantByEmail } from '../services/participant/GetParticipantByEmail'
import { postExistingParticipant } from '../services/registration/AddExistingParticipantRegistration'
import GetAllCourses from "../services/courses/GetAllCourses";
import GetAllInstructors from "../services/instructors/GetAllInstructors";
import { postNewParticipant } from '../services/registration/AddNewParticipantRegistration'

const GetSubmissions = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [day, setDay] = useState(new Date().getDate());
    const [loading, setLoading] = useState(false);
    const [formattedData, setFormattedData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);


    const { courses, loading: coursesLoading, error: coursesError } = GetAllCourses();
    const { instructors, loading: instructorsLoading, error: instructorsError } = GetAllInstructors();

    // NEW: store fetched participant details
    const [participantData, setParticipantData] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    const daysInMonth = new Date(year, month, 0).getDate();

    // Fetch participant details when a row is selected (before modal opens)
   const handleRowSelect = async (row) => {
    setSelectedRow(row);
    setParticipantData(null);
    setFetchError(null);

    // 1. Resolve courseId and instructorId FIRST so they are available to both try and catch
    let courseId = null;
    let instructorId = null;

    if (courses) {
        const matchedCourse = courses.find(course => course.course_name === row["Course Name"]);
        courseId = matchedCourse ? matchedCourse.id : null;
    }

    if (instructors) {
        const matchedInstructor = instructors.find(instructor => {
            const fullName = `${instructor.first_name} ${instructor.last_name}`.trim();
            return fullName.toLowerCase() === row["Instructor"]?.toString().trim().toLowerCase();
        });
        instructorId = matchedInstructor ? matchedInstructor.id : null;
    }

    // Helper function to close modal on success
    const closeModal = () => {
        const modalElement = document.getElementById("exampleModalCenter");
        if (window.bootstrap) {
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement) 
                || new window.bootstrap.Modal(modalElement);
            modalInstance.hide();
        } else {
            const closeBtn = modalElement?.querySelector('[data-bs-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
        }
    };

    // 2. Attempt fetching the existing participant
    try {
        const data = await fetchParticipantByEmail(row["Email"]);
        console.log("Participant found:", data);
        setParticipantData(data);

        // Existing participant post
        const isSuccess = await postExistingParticipant(data, row, courseId, instructorId);
        if (isSuccess) closeModal();

    } catch (error) {
        console.error("Fetch failed:", error);
        setFetchError("No user found for the provided email.");

        // New participant post (courseId and instructorId are now populated correctly)
        // Pass null or row details for participant data since 'data' failed to fetch
        const isSuccess = await postNewParticipant(null, row, courseId, instructorId);
        if (isSuccess) closeModal();
    }
};

    const handleModalSubmit = async () => {
        if (!selectedRow) return;
        setLoading(true);

        try {
            const cell = "K" + selectedRow["Row Number"];
            const value = "Submitted";
            const response = await fetch(
                `http://192.168.0.67:8080/api/sheets/write/${cell}/${value}`,
                { method: "POST" }
            );

            if (!response.ok) throw new Error("Failed to add Submission.");

            setFormattedData((prevData) =>
                prevData.map((r) =>
                    r["Row Number"] === selectedRow["Row Number"]
                        ? { ...r, Status: "Submitted" }
                        : r
                )
            );
        } catch (err) {
            console.error("Submission failed:", err);
        } finally {
            setLoading(false);
            setSelectedRow(null);
            setParticipantData(null);
        }
    };

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://192.168.0.67:8080/api/sheets/read/${day}/${month}/${year}`
            );
            const data = await response.json();

            if (!data || data.length <= 1) {
                alert("No submissions found for this period.");
                setFormattedData([]);
                return;
            }

            const rows = data.slice(1).map((item) => ({
                "Date": item[0].split(' ')[0],
                "First Name": item[1],
                "Last Name": item[2],
                "Place of Work": item[3],
                "Occupation": item[4],
                "Telephone": item[5],
                "Email": item[6],
                "Course Name": item[7],
                "Instructor": item[9],
                "Row Number": item[10],
                "Status": item[11] || ""
            }));

            setFormattedData(rows);
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3 text-primary">Google Form Submissions</h5>

            <div className="row g-3 align-items-center">
                <div className="col-md-3">
                    <label className="form-label fw-semibold">Select Day</label>
                    <select
                        className="form-select"
                        value={day}
                        onChange={(e) => setDay(Number(e.target.value))}
                    >
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold">Select Month</label>
                    <select
                        className="form-select"
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                    >
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold">Select Year</label>
                    <input
                        type="number"
                        className="form-control"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    />
                </div>

                <div className="col-md-4 d-flex align-items-end mt-4">
                    <button
                        className="btn btn-success w-100"
                        onClick={handleExport}
                        disabled={loading}
                    >
                        <i className="bi bi-file-earmark-excel me-2"></i>
                        {loading ? "Generating..." : "Retrieve Submissions"}
                    </button>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" aria-labelledby="exampleModalCenterTitle">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">Confirm Submission</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedRow ? (
                                <>
                                    <p>
                                        Are you sure you want to mark row <strong>{selectedRow["Row Number"]}</strong> as
                                        submitted for <strong>{selectedRow["First Name"]} {selectedRow["Last Name"]}</strong>?
                                    </p>

                                    <hr />

                                    {fetchError && <p className="text-danger">{fetchError}</p>}

                                    {participantData ? (
                                        <div><p><strong>ID:</strong> {participantData.id}</p>
                                            <p><strong>First Name:</strong> {participantData.first_name}</p>
                                            <p><strong>Last Name:</strong> {participantData.last_name}</p>
                                            <p><strong>Email:</strong> {participantData.email}</p>
                                            <p><strong>Telephone:</strong> {participantData.telephone}</p>
                                            <p><strong>Occupation:</strong> {participantData.occupation}</p>
                                            <p><strong>Workplace:</strong> {participantData.workplace}</p>
                                        </div>
                                    ) : (
                                        !fetchError && <p>Loading participant details...</p>
                                    )}
                                </>
                            ) : (
                                <p>No row selected.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={handleModalSubmit}
                            >
                                Submit Submission
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            {formattedData.length > 0 && (
                <div className="table-responsive mt-4">
                    <table className="table table-striped table-bordered align-middle">
                        <thead>
                            <tr>
                                {Object.keys(formattedData[0]).map((col) => (
                                    <th key={col}>{col}</th>
                                ))}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formattedData.map((row, idx) => {
                                const isSubmitted = row["Row Number"] === "Submitted";
                                return (
                                    <tr key={idx}>
                                        {Object.values(row).map((val, i) => (
                                            <td key={i}>{val}</td>
                                        ))}
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                disabled={isSubmitted}
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModalCenter"
                                                onClick={() => handleRowSelect(row)}
                                            >
                                                {isSubmitted ? "Submitted" : "Submit"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GetSubmissions;