import { useNavigate } from "react-router-dom";

const Navbar = ({
  loggedIn,
  onLogout,
  sortBy,
  order,
  onSortBy,
  onSortOrder,
}) => {
  const navigate = useNavigate();
  // Список опций для сортировки
  const sortOptions = ["user_name", "email", "title", "id"];

  return (
    <div>
      <span>Вы вошли в систему</span>
      {loggedIn ? (
        <button onClick={onLogout}>Выйти</button>
      ) : (
        <button onClick={() => navigate("/login")}>Войти</button>
      )}
      <br />
      <br />
      <span>Сортировка:</span>
      <select value={sortBy} onChange={(e) => onSortBy(e.target.value)}>
        {sortOptions.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
      <button onClick={onSortOrder}>
        {order === "asc" ? "По возрастанию" : "По убыванию"}
      </button>
    </div>
  );
};
export default Navbar;
