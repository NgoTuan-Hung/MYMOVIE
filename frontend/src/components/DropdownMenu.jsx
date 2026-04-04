import { useState, useRef, useEffect } from "react";
import "../styles/navbar.css";

export default function DropdownMenu({ triggerLabel, items, onItemClick, ariaLabel }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    let closeTimeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(closeTimeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    const handleItemClick = (item) => {
        setIsOpen(false);
        onItemClick(item);
    };

    // Close dropdown on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => clearTimeout(closeTimeoutRef.current);
    }, []);

    return (
        <div
            className="genres-dropdown-container"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className={`nav-link genres-trigger ${isOpen ? "active" : ""}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label={ariaLabel}
            >
                {triggerLabel}
                <svg
                    className={`dropdown-arrow ${isOpen ? "rotated" : ""}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2.5 4.5L6 8L9.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="genres-dropdown"
                    role="menu"
                    aria-label={ariaLabel}
                >
                    <div className="genres-grid">
                        {items.map((item) => (
                            <button
                                key={item}
                                className="genre-item"
                                role="menuitem"
                                onClick={() => handleItemClick(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}