import Sidebar from './SideBar';
import Header from './Header';

const Layout = ({ children, headerTitle, backTo, backLabel }) => {
  return (
    <div className="bg-blue-100 min-h-screen">
      <Header title={headerTitle} backTo={backTo} backLabel={backLabel} />
      <main className="ml-[355px] pt-24 px-6">{children}</main>
    </div>
  );
};

export default Layout;
