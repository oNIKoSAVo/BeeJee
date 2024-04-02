import { useNavigate } from "react-router-dom";

const SortPanel = ({ sortBy, order, onSortBy, onSortOrder }) => {
  // Список опций для сортировки
  const sortOptions = ["user_name", "email", "title", "id"];

  return (
    <div className="app-header-component">
      
      <div className=" dropdown ">
        <div style={{color:"black", margin: "0.25em 0.25em"}}>
        <span >Сортировка:</span>
        </div>
      
        <select value={sortBy} onChange={(e) => onSortBy(e.target.value)}>
          {sortOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
        <button className = "btn btn--icon" onClick={onSortOrder}>
        {order === "asc" ? "⬇" : "⬆"}
      </button>
      </div>

      
    </div>
  );
};
export default SortPanel;
