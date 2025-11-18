import adminCard from "../../assets/admin_pic.jpg";

const AdminBanner = ({ title, showButton = false, buttonText = "", onButtonClick }) => {
  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden mb-4 h-[140px] md:h-[160px]"
      style={{ 
        backgroundImage: `url(${adminCard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay oscuro */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="text-center relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg">
            {title}
          </h2>
          {showButton && (
            <button
              onClick={onButtonClick}
              className="bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out text-sm mt-2"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBanner;

