import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ title, backTo, backLabel }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
  className={`fixed top-0 left-[355px] right-0 z-30 transition-all duration-800 ease-in-out
    ${scrolled ? "bg-blue-100 shadow-md h-16" : "bg-blue-100 backdrop-blur-md h-24"}
    px-6 flex flex-col justify-center`}
>
      {backTo && (
        <button
          onClick={() => navigate(backTo)}
          className="text-sm text-gray-500 hover:underline flex items-center gap-1 mb-1"
        >
          <span className="text-xl font-light">&larr;</span>
          {backLabel}
        </button>
      )}
      <h1 className={`font-bold text-gray-800 transition-all duration-800 
        ${scrolled ? "text-2xl" : "text-4xl"}`}>
        {title}
      </h1>
    </header>
  );
};

export default Header;
