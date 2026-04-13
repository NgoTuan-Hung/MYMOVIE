import Pagination from '../filter/Pagination';
import '../../styles/movie-list.css';

export default function AdminPagination({ page, totalPages, totalElements, onPageChange }) {
    const size = 10;

    return (
        <div className="admin-pagination">
            <span className="admin-pagination-info">
                Showing {page * size + 1} - {Math.min((page + 1) * size, totalElements)} of {totalElements}
            </span>
            <div className="admin-pagination-controls-wrapper">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}