import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
    return (
        <div>
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Назад</button>
            <span>Страница {page} из {totalPages}</span>
            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Вперед</button>
        </div>
    );
}

export default Pagination;