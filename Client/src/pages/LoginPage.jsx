import bg from "../assets/backgrounds/newbg.png";
import logo from "../assets/Logo.png";
import LoginForm from "../components/Auth/LoginForm";

const LoginPage = () => {
  return (
    <section
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-xl rounded-xl overflow-hidden shadow-2xl">
        <div className="flex-1 bg-zinc-950/40 backdrop-invert backdrop-opacity-10 p-8 rounded-r-xl">
          <LoginForm />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
