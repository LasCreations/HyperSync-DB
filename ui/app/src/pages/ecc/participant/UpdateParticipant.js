import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigate
import "./UpdateParticipant.css";
import { useParams } from "react-router-dom"; // Added to get the participant ID from the URL
import { useEffect } from "react"; // Added to fetch participant data on mount

// 1. Capitalized function name to follow React component rules
const UpdateParticipant = () => {
    const { id } = useParams(); // Added to get the participant ID from the URL
    const navigate = useNavigate(); // Added navigate hook

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        telephone: "",
        email: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://192.168.0.67:8080/participants/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error("Failed to update participant");
            }
            setLoading(false);
            navigate("/participants");
        } catch (error) {
            console.error("Error updating participant:", error);
            setError("Failed to update participant.");
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch the participant data by ID when the component mounts
        const fetchParticipant = async () => {
            try {
                const response = await fetch(`http://192.168.0.67:8080/participants/fetch/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch participant data");
                }
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error("Error fetching participant data:", error);
                setError("Failed to load participant data.");
            }
        };

        fetchParticipant();
    }, [id]);

    

    return (
        <div className="form-container">
            <div className="form-card">
                <div className="form-header">
                    <h1>Update Participant</h1>
                    <p>Fill in the details below to update the participant's information.</p>
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

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Submitting..." : "Update Participant"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 2. Capitalized default export
export default UpdateParticipant;