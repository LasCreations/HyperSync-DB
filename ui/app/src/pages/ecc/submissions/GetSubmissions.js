import React, { useState } from "react";

const GetSubmissions = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [day, setDay] = useState(new Date().getDate());
    const [loading, setLoading] = useState(false);
    const [formattedData, setFormattedData] = useState([]);

    const daysInMonth = new Date(year, month, 0).getDate();

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://192.168.0.67:8080/api/sheets/read/${day}/${month}/${year}`
            );
            const data = await response.json();
            console.log("Fetched data:", data);

            if (!data || data.length <= 1) {
                alert("No submissions found for this period.");
                setFormattedData([]);
                return;
            }

            const rows = data.slice(1).map((item) => ({
                "Date": item[0],
                "First Name": item[1],
                "Last Name": item[2],
                "Place of Work": item[3],
                "Occupation": item[4],
                "Telephone": item[5],
                "Email": item[6],
                "Course Name": item[7],
                "Instructor": item[9]
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

            {formattedData.length > 0 && (
                <div className="table-responsive mt-4">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                {Object.keys(formattedData[0]).map((col) => (
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {formattedData.map((row, idx) => (
                                <tr key={idx}>
                                    {Object.values(row).map((val, i) => (
                                        <td key={i}>{val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GetSubmissions;