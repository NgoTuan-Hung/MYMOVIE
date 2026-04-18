
import { useState, useRef, useEffect } from 'react';
import '../styles/multi-select.css';

export default function MultiSelectDropdown({
    label,
    options,   // Array of {id, name}
    selectedIds = [],
    onChange,  // function(selectedIds)
    placeholder = "Select...",
    searchable = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggle = (id) => {
        const newSelection = selectedIds.includes(id)
            ? selectedIds.filter(itemId => itemId !== id)
            : [...selectedIds, id];
        onChange(newSelection);
    };

    const isSelected = (id) => selectedIds.includes(id);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabels = options
        .filter(opt => selectedIds.includes(opt.id))
        .map(opt => opt.name);

    return (
        <div className="multi-select-dropdown" ref={dropdownRef}>
            <label className="multi-select-label">{label}</label>
            <div
                className={`multi-select-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setIsOpen(!isOpen);
                    }
                }}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className="multi-select-value">
                    {selectedLabels.length > 0
                        ? `${selectedLabels.length} selected`
                        : placeholder}
                </span>
                <svg className={`multi-select-arrow ${isOpen ? 'rotated' : ''}`}
                    width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5L6 8L9.5 4.5"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {isOpen && (
                <div className="multi-select-dropdown-menu" role="listbox">
                    {searchable && (
                        <input
                            type="text"
                            className="multi-select-search"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            autoFocus
                        />
                    )}
                    <div className="multi-select-options">
                        {filteredOptions.length === 0 ? (
                            <div className="multi-select-no-options">No options</div>
                        ) : (
                            filteredOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`multi-select-option ${isSelected(option.id) ? 'selected' : ''}`}
                                    onClick={() => handleToggle(option.id)}
                                    role="option"
                                    aria-selected={isSelected(option.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected(option.id)}
                                        readOnly
                                        tabIndex={-1}
                                    />
                                    <span>{option.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}