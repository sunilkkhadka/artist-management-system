import { useAuth } from "../hooks/useAuth";
import { useGetUsers } from "../hooks/useFetchUsers";

const Home = () => {
  const { data } = useGetUsers();

  const auth = useAuth();
  console.log(auth);

  console.log(data);

  return <div>Home</div>;
};

export default Home;
