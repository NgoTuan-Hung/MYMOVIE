import "../../styles/pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];

    // Generate page numbers to display
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">
            {/* Previous Button */}
            <button
                className="page-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                ← Prev
            </button>

            {/* Page Numbers */}
            {startPage > 0 && (
                <>
                    <button className="page-button" onClick={() => onPageChange(0)}>
                        1
                    </button>
                    {startPage > 1 && <span className="page-ellipsis">...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    className={`page-button ${page === currentPage ? "active" : ""}`}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </button>
            ))}

            {endPage < totalPages - 1 && (
                <>
                    {endPage < totalPages - 2 && <span className="page-ellipsis">...</span>}
                    <button className="page-button" onClick={() => onPageChange(totalPages - 1)}>
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next Button */}
            <button
                className="page-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >
                Next →
            </button>
        </div>
    );
}