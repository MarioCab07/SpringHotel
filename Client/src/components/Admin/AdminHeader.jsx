const AdminHeader = ({ showProfile = false }) => {
  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="w-full bg-white px-6 md:px-8 lg:px-10 py-5 md:py-6 flex justify-between items-center">
      <h1 className="text-lg md:text-xl font-serif text-gray-900">
        LUMÉ HOTEL & SUITES
      </h1>
      {showProfile ? (
        <button
          onClick={() => {
            // Navegar a perfil si es necesario
          }}
          className="text-gray-700 hover:text-gray-900 hover:underline transition-all text-sm md:text-base font-serif"
        >
          Profile
        </button>
      ) : (
        <button
          onClick={handleSignOut}
          className="text-gray-700 hover:text-gray-900 hover:underline transition-all text-sm md:text-base font-serif"
        >
          Sign Out
        </button>
      )}
    </div>
  );
};

export default AdminHeader;

