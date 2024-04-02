import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
    return (
        <div>
            <button className = "btn btn--icon" onClick={() => onPageChange(page - 1)} disabled={page === 1}>⬅</button>
            <span>Страница {page} из {totalPages}</span>
            <button className = "btn btn--icon" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>➡</button>
        </div>
    );
}

export default Pagination;