import { useState, useEffect } from "react";
import "./GetAllParticipants.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SEARCH_FIELDS = [
    { label: "ID", value: "id" },
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Telephone", value: "telephone" },
    { label: "Email", value: "email" },
];

const GetAllParticipants = () => {
    const navigate = useNavigate();

    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchField, setSearchField] = useState("id");

    useEffect(() => {
        fetch("http://192.168.0.67:8080/participants/fetch/all")
            .then(response => response.json())
            .then(data => {
                setParticipants(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching participants:", error);
                setError("Failed to load participants.");
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {


        try {
            const response = await fetch(`http://192.168.0.67:8080/certifications/delete/participant/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                try {
                    const response = await fetch(`http://192.168.0.67:8080/registrations/delete/participant/${id}`, {
                        method: "DELETE",
                    });
                    if (response.ok) {
                        try {
                            const response = await fetch(`http://192.168.0.67:8080/participants/delete/${id}`, {
                                method: "DELETE",
                            });
                            if (response.ok) {
                                setParticipants(prev => prev.filter(p => String(p.id) !== String(id)));
                            } else {
                                console.error("Failed to delete participant:", response.statusText);
                            }
                        } catch (error) {
                            console.error("Error deleting participant:", error);
                        }
                    }
                    else {
                        console.error("Failed to delete regsitrations linked to participant:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error deleting registrations:", error);
                }
            } else {
                console.error("Failed to delete regsitrations linked to participant:", response.statusText);
            }

        } catch (error) {
            console.error("Error deleting registrations:", error);
        }





    };

    const handleUpdate = (id) => {
        navigate(`/participant/UpdateParticipant/${id}`);
    }

    const handleRegistration = (id) => {
        navigate(`/participant/RegisterParticipant/${id}`);
    }

    const handleView = (id) => {
        navigate(`/participant/ViewParticipant/${id}`);
    }

    const filteredParticipants = searchQuery.trim() === ""
        ? participants
        : participants.filter(p =>
            String(p[searchField] ?? "")
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase())
        );

    const activeLabel = SEARCH_FIELDS.find(f => f.value === searchField)?.label;

    return (
        <div className="participants-container">
            <h1 className="participants-title">All Participants</h1>

            {/* Search Bar */}
            <div className="search-bar">

                <select
                    className="search-select"
                    value={searchField}
                    onChange={(e) => {
                        setSearchField(e.target.value);
                        setSearchQuery("");
                    }}
                >
                    {SEARCH_FIELDS.map(field => (
                        <option key={field.value} value={field.value}>
                            {field.label}
                        </option>
                    ))}
                </select>

                <input
                    type={searchField === "id" ? "number" : "text"}
                    placeholder={`Search by ${activeLabel}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                {searchQuery && (
                    <button className="clear-btn" onClick={() => setSearchQuery("")}>✕</button>
                )}
            </div>

            <p className="participants-count">
                {filteredParticipants.length} participant{filteredParticipants.length !== 1 ? "s" : ""}
                {searchQuery && ` matching "${searchQuery}" in ${activeLabel}`}
            </p>

            {loading && <p className="status-msg">Loading...</p>}
            {error && <p className="status-msg error">{error}</p>}

            {!loading && !error && filteredParticipants.length === 0 && (
                <p className="status-msg">
                    No participants found with {activeLabel} matching "{searchQuery}".
                </p>
            )}

            {!loading && !error && filteredParticipants.length > 0 && (
                <div className="table-wrapper">
                    <table className="participants-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Telephone</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParticipants.map((participant) => (
                                <tr key={participant.id}>
                                    <td>{participant.id}</td>
                                    <td>{participant.first_name}</td>
                                    <td>{participant.last_name}</td>
                                    <td>{participant.email}</td>
                                    <td>{participant.telephone}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-success"
                                                onClick={() => handleRegistration(participant.id)}
                                            >
                                                Register
                                            </Button>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => handleView(participant.id)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => handleUpdate(participant.id)}
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => handleDelete(participant.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GetAllParticipants;