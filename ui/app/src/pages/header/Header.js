import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Header.css";

const Header = () => {
    const [eccOpen, setEccOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setEccOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="hdr">
            <Link to="/" className="hdr-brand">🗄️ HFJ DBMS</Link>

            <nav className="hdr-nav">
                <div className="hdr-dropdown" ref={dropdownRef}>
                    <button className="hdr-btn" onClick={() => setEccOpen(o => !o)}>
                        ECC {eccOpen ? "▴" : "▾"}
                    </button>
                    {eccOpen && (
                        <div className="hdr-dropdown-menu">
                            <Link to="/registration" className="hdr-dropdown-item" onClick={() => setEccOpen(false)}>Registration</Link>
                            <Link to="/participants" className="hdr-dropdown-item" onClick={() => setEccOpen(false)}>Participants</Link>
                            <Link to="/submissions" className="hdr-dropdown-item" onClick={() => setEccOpen(false)}>Google Form Submissions</Link>
                            <Link to="/upload" className="hdr-dropdown-item" onClick={() => setEccOpen(false)}>Upload</Link>
                            <hr className="hdr-divider" />
                            <Link to="/delete" className="hdr-dropdown-item hdr-danger" onClick={() => setEccOpen(false)}>Delete</Link>
                        </div>
                    )}
                </div>
                <Link to="/sponsors" className="hdr-btn">Sponsors</Link>
                <Link to="/events" className="hdr-btn">Events</Link>
                <Link to="/reports" className="hdr-btn">Reports</Link>
            </nav>
        </header>
    );
};

export default Header;