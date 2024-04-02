import { useNavigate } from "react-router-dom";

const Navbar = ({ loggedIn, onLogout }) => {
  const navigate = useNavigate();
  return (
    <div className="app-header-component">

      {loggedIn ? (
        <>
          <span>Вы вошли в систему</span>
          <button className = "btn btn-normal" onClick={onLogout}>Выйти</button>
        </>
      ) : (
        <>
          <span>Вы не вошли в систему</span>
          <button className = "btn btn-normal" onClick={() => navigate("/login")}>Войти</button>
        </>
      )}
    </div>
  );
};
export default Navbar;
