import { Link } from "react-router-dom";

const Header = () => {
  // const dispatch = useAuthDispatch()

  // useEffect(() => {
  //   if (localStorage.getItem("at")) {
  //     dispatch({
  //       type: "LOGIN",
  //       payload
  //     })
  //   }
  // }, [])

  return (
    <header>
      <nav>
        <h1>Melodia</h1>
        <ul>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
