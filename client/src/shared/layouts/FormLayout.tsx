import { useHistory } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, title }) => {
  const history = useHistory();

  return (
    <section className="form-container">
      <div className="form-intro">
        <div className="back-btn">
          <button onClick={() => history.push("/home")}>
            <IoMdArrowBack /> Back
          </button>
        </div>
        <h1>{title}</h1>
      </div>
      {children}
    </section>
  );
};

export default FormLayout;
