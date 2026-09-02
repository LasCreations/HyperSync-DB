import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExpiringReportGenerator = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);



    const exportToExcel = (data, fileName) => {
        // 1. Create worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        // 2. Generate Excel buffer
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        // 3. Create Blob with explicit MIME type
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        // 4. Trigger download using HTML5 anchor tag
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${fileName}.xlsx`);
        document.body.appendChild(link);
        link.click();

        // 5. Cleanup DOM and Object URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleExport = async () => {
        try {
            const response = await fetch(
                `http://192.168.0.67:8080/reports/expiring?month=${month}&year=${year}`
            );
            const data = await response.json();
            console.log("Fetched data:", data);
            if (!data || data.length === 0) {
                alert("No expiring certificates found for this period.");
                return;
            }

            const formattedData = data.map((item) => ({
                "First Name": item.firstName,
                "Last Name": item.lastName,
                "Email": item.email,
                "Expiration Date":item.CourseName,
                "Course Name":  item.expirationDate
            }));

            // Execute download helper
            exportToExcel(formattedData, `Expiring_Certificates_${month}_${year}`);
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    return (
        <div className="card p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3 text-primary">Generate Expiring Certificates Report</h5>
            <div className="row g-3 align-items-center">
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
                        {loading ? "Generating..." : "Export Excel Report"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpiringReportGenerator;