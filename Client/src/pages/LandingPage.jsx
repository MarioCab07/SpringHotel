import { useState } from "react";
import logo from "../assets/Logo.png";
import LandingBg from "../assets/backgrounds/LandingBg.jpg";
import divider from "../assets/divider.png";
import {
  AiFillFacebook,
  AiOutlineTwitter,
  AiOutlineUserAdd,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { GrPinterest } from "react-icons/gr";
import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";

const LandingPage = () => {
  const role = sessionStorage.getItem("role");
  console.log("Role:", role);
  const navItems = [
    { label: "Home", hasDropdown: false },
    { label: "About Us", hasDropdown: true },
    { label: "Events", hasDropdown: true },
    { label: "Services", hasDropdown: true },
    { label: "Gallery", hasDropdown: true },
    { label: "Blog", hasDropdown: true },
    { label: "Contact", hasDropdown: true },
  ];

  const handleNavigate = () => {
    if (role) {
      window.location.href = "/rooms";
    } else {
      window.location.href = "/login";
    }
  };

  const handleScroll = (id) => (e) => {
    e.preventDefault();
    const section = document.querySelector("section");
    const target = section.querySelector("#" + id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <section className="flex flex-col h-screen overflow-y-auto scroll-smooth">
        <article
          className="w-full flex-none min-h-5/6 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${LandingBg})` }}
        >
          <header className="bg-black/25 p-4 flex items-center justify-between">
            <div className="flex-1 flex items-center ">
              <img src={logo} alt="Logo Hotel Spring" className="h-30 w-30" />
            </div>
            <div className="w-1/3 flex items-center text-white justify-center gap-10">
              <a
                className="hover:text-pink-400 transition duration-300"
                target="blank"
                href="https://es-la.facebook.com/"
              >
                {" "}
                <AiFillFacebook size={25} />{" "}
              </a>
              <a
                className="hover:text-pink-400 transition duration-300"
                target="blank"
                href="https://twitter.com/"
              >
                {" "}
                <AiOutlineTwitter size={25} />{" "}
              </a>
              <a
                className="hover:text-pink-400 transition duration-300"
                target="blank"
                href="https://www.pinterest.com/"
              >
                {" "}
                <GrPinterest size={25} />{" "}
              </a>

              {!role && (
                <>
                  <Link
                    to="/register"
                    className="bg-pink-500 rounded-2xl py-2 px-4 hover:bg-white hover:text-pink-500 cursor-pointer transition duration-300 font-bold"
                  >
                    {" "}
                    Registrarse
                  </Link>
                  <Link
                    className="bg-white text-pink-500 rounded-2xl py-2 px-4 hover:bg-pink-500 hover:text-white cursor-pointer transition duration-300 font-bold"
                    to="/login"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </header>
          <div className="w-full flex justify-center items-center mt-8">
            <nav className="flex items-center bg-white shadow-lg w-1/2">
              <ul className="flex">
                {navItems.map(({ label, hasDropdown }) => {
                  const slug = label.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <li key={slug}>
                      <a
                        href={`#${slug}`}
                        onClick={handleScroll(slug)} // ← aquí
                        className={`
              block px-5 py-3 text-gray-700 hover:text-pink-600
              ${label === "Home" ? "text-pink-600 font-semibold" : ""}
            `}
                      >
                        <span className="inline-flex items-center">
                          {label}
                          {hasDropdown && (
                            <span
                              className="inline-block ml-1
                              w-2 h-2
                              border-t-2 border-r-2 border-current
                              transform rotate-45"
                            />
                          )}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Spacer flexible */}
              <div className="flex-1" />

              {/* Botón “BOOK NOW” */}

              <a
                onClick={handleNavigate}
                className="
    px-8 py-3 font-semibold
    bg-[#ec1c4f]       
    text-white         
    hover:bg-gray-100     
    hover:text-[#ec1c4f] 
    transition duration-300
    cursor-pointer
  "
                style={{
                  clipPath: "polygon(6% 0, 100% 0, 100% 100%, 0 100%)",
                }}
              >
                BOOK NOW
              </a>
            </nav>
          </div>

          <div className="h-1/2 w-full flex flex-col  items-center justify-center  font-bold">
            <h1
              className="
    inline-block 
    bg-black/40 
    px-6 py-8 
    rounded
    text-center 
    text-white 
    text-8xl 
     font-vibes
  "
            >
              Spring Hotel
            </h1>

            {/* Líneas + Subtítulo */}
            <div className="flex items-center mb-8 space-x-4">
              <span className="block h-px w-20 bg-white/50" />
              <span className="uppercase tracking-wider text-sm text-white">
                The place where you looking to
              </span>
              <span className="block h-px w-20 bg-white/50" />
            </div>

            {/* Botón */}
            <button
              className="
          inline-flex items-center
          bg-white text-gray-800
          px-6 py-3
          font-medium rounded
          drop-shadow-md
          hover:drop-shadow-lg
          transition
            duration-300
            hover:bg-gray-400
            cursor-pointer
            hover:text-white
        "
            >
              <span>Explore Now</span>
              <AiOutlineArrowRight className="ml-2 text-pink-500" size={20} />
            </button>
          </div>
        </article>

        <article className="w-full flex-none p-8" id="home">
          <div className="flex flex-col items-center mb-8 w-full ">
            <h2 className="text-3xl font-bold mb-4">WELCOME TO HOTEL</h2>
            <img src={divider} className="w-30 h-30" alt="" />
            <p className="max-w-2xl mb-8 text-center">
              Spring Hotel es un oasis de descanso y confort, ubicado en un
              entorno natural único, donde cada detalle ha sido pensado para su
              absoluta satisfacción. Disfrute de nuestras amplias habitaciones,
              exquisita gastronomía local y exclusivos tratamientos de spa para
              vivir una experiencia inolvidable.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <img
              src="https://media.istockphoto.com/id/173587041/photo/hotel-bedroom.jpg?s=612x612&w=0&k=20&c=mzbT-i0sbivf2hK4aAJi0mdYVTUca8o5vij0bJq97Ks="
              alt=""
              className="w-1/4 h-auto object-cover rounded-lg shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww"
              alt=""
              className="w-1/4 h-auto object-cover rounded-lg shadow-lg"
            />
            <img
              src="https://img.freepik.com/free-photo/interior-modern-comfortable-hotel-room_1232-1822.jpg?semt=ais_items_boosted&w=740"
              alt=""
              className="w-1/4 h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="flex justify-center">
            <button className="rounded-md bg-[#EC1C4F] text-white px-4 py-2 cursor-pointer hover:bg-pink-700 transition duration-300 mt-8">
              View All
            </button>
          </div>
        </article>

        <article id="about-us" className="w-full flex-none p-8 bg-black/90 ">
          <div className="flex flex-col items-center mb-8 w-full ">
            <h2 className="text-3xl font-bold mb-4 text-white text-center">
              WHY TO CHOOSE US?
            </h2>
            <img src={divider} className="w-30 h-30 filter invert" alt="" />
            <ul className="flex text-gray-500 text-lg font-light mt-4 gap-4 justify-center">
              <li>ALL</li>
              <li>DESSERT</li>
              <li>COFFEE</li>
              <li>CATERING</li>
              <li>SERVICES</li>
            </ul>
            <div className="grid grid-cols-3 gap-4 p-4">
              {[
                "https://th.bing.com/th/id/R.d8e6446972ee039e083a4893ed563653?rik=ZUgUawA0V8k%2feA&riu=http%3a%2f%2fisinglassinc.com%2fwp-content%2fuploads%2f2015%2f03%2frestaurant-food-01.jpg&ehk=QafWM00446%2fmdvb3O9HtydCp7Jh0C1PQqThGAit8OlE%3d&risl=&pid=ImgRaw&r=0",
                "https://th.bing.com/th/id/R.4675b45372cb962cebf0c8b13fea74e6?rik=yACssNBFzpsUwQ&pid=ImgRaw&r=0",
                "https://sankalpdigitalsolution.com/wp-content/uploads/2024/01/501-02.jpg",
                "https://eatbook.sg/wp-content/uploads/2017/08/seafood-buffet-window-on-the-park.jpg",
                "https://www.thehoteltrotter.com/wp-content/uploads/2018/05/Blueberry-Sarah-and-Allen-Hemberger.jpg",
                "https://th.bing.com/th/id/R.ffbf209c30e467a4a90e871002993569?rik=wDValFiORzf2Mg&riu=http%3a%2f%2fwww.aquatravel.ro%2falanya%2fdelphin-deluxe-resort-alanya-pool.jpg&ehk=NpIXb0Ts7FbQ70%2fDX8PUV%2fxvKBmhEhbv9N1Gj5380Pc%3d&risl=&pid=ImgRaw&r=0",
              ].map((src, idx) => (
                <div key={idx} className="overflow-hidden shadow-md">
                  <img
                    src={src}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </article>
        <article id="events" className="w-full flex-none p-8 bg-white ">
          <div className="flex flex-col items-center justify-center">
            <h3 className="flex flex-col items-center ">
              <span className="text-gray-400 text-2xl">Upcoming</span>
              <span className="text-4xl">Events</span>
            </h3>
            <img src={divider} className="w-30 h-30" alt="" />
          </div>

          <div className="grid grid-cols-3 gap-6 p-4">
            {/* Card 1 */}
            <div className="bg-white shadow-md  overflow-hidden">
              <img
                src="https://novoxinc.com/cdn/shop/articles/novox_7_event_setup_styles_for_hotel_and_mice_hero_image_1024x576px_1024x.jpg?v=1657957442"
                alt="Evento 1"
                className="w-full h-48 object-cover"
              />
              <div className="flex">
                <div className="bg-[#ec1c4f] text-white flex flex-col items-center justify-center px-4 py-6">
                  <span className="text-2xl font-bold leading-none">25</span>
                  <span className="uppercase text-xs leading-none">APRIL</span>
                </div>
                <div className="p-4 flex-1">
                  <p className="text-gray-700 text-sm">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-md  overflow-hidden">
              <img
                src="https://www.jaypeehotels.com/blog/wp-content/uploads/2023/01/Blog-dec-5.jpg"
                alt="Evento 2"
                className="w-full h-48 object-cover"
              />
              <div className="flex">
                <div className="bg-[#ec1c4f] text-white flex flex-col items-center justify-center px-4 py-6">
                  <span className="text-2xl font-bold leading-none">22</span>
                  <span className="uppercase text-xs leading-none">JUNE</span>
                </div>
                <div className="p-4 flex-1">
                  <p className="text-gray-700 text-sm">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-md  overflow-hidden">
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/575978703.jpg?k=1272b5ac8b462c7fe8f0daadacab6e999278949a8ec16ff30b08ba6518960229&o=&hp=1"
                alt="Evento 3"
                className="w-full h-48 object-cover"
              />
              <div className="flex">
                <div className="bg-[#ec1c4f] text-white flex flex-col items-center justify-center px-4 py-6">
                  <span className="text-2xl font-bold leading-none">15</span>
                  <span className="uppercase text-xs leading-none">MAY</span>
                </div>
                <div className="p-4 flex-1">
                  <p className="text-gray-700 text-sm">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
        <footer id="contact" className="bg-black text-white py-12">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* ADDRESS */}
            <div>
              <h3 className="text-lg font-semibold uppercase mb-4">Address</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MdLocationOn size={18} /> Hotel in Jaipur
                </li>
                <li className="flex items-center gap-2">
                  <MdPhone size={18} /> 50123456789
                </li>
                <li className="flex items-center gap-2">
                  <MdEmail size={18} /> hotel@gmail.com
                </li>
              </ul>
            </div>

            {/* INFORMATION */}
            <div>
              <h3 className="text-lg font-semibold uppercase mb-4">
                Information
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/about" className="hover:text-pink-500 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/delivery"
                    className="hover:text-pink-500 transition"
                  >
                    Delivery Information
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-pink-500 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-pink-500 transition">
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a href="/sitemap" className="hover:text-pink-500 transition">
                    Site Map
                  </a>
                </li>
              </ul>
            </div>

            {/* MY ACCOUNT */}
            <div className="md:border-l md:border-gray-700 md:pl-6">
              <h3 className="text-lg font-semibold uppercase mb-4">
                My Account
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/account" className="hover:text-pink-500 transition">
                    My Account
                  </a>
                </li>
                <li>
                  <a href="/orders" className="hover:text-pink-500 transition">
                    Order History
                  </a>
                </li>
                <li>
                  <a
                    href="/wishlist"
                    className="hover:text-pink-500 transition"
                  >
                    Wish List
                  </a>
                </li>
                <li>
                  <a
                    href="/newsletter"
                    className="hover:text-pink-500 transition"
                  >
                    Newsletter
                  </a>
                </li>
                <li>
                  <a href="/returns" className="hover:text-pink-500 transition">
                    Returns
                  </a>
                </li>
              </ul>
            </div>

            {/* NEWS LETTER */}
            <div>
              <h3 className="text-lg font-semibold uppercase mb-4">
                News Letter
              </h3>
              <p className="text-sm mb-4">
                Subscribe to our newsletter for latest news, tips, and advice.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-md text-black focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#ec1c4f] px-6 rounded-r-md font-semibold"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="mt-12 text-center text-sm text-gray-400">
            © 2018 . Hotel. All rights.
          </div>
        </footer>
      </section>
    </>
  );
};

export default LandingPage;
