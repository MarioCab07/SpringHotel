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
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="text-center relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            {title}
          </h2>
          {showButton && (
            <button
              onClick={onButtonClick}
              className="bg-amber-100 hover:bg-amber-200 text-gray-800 font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-md text-sm"
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

