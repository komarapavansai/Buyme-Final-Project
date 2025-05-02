import { FaSignInAlt, FaSignOutAlt, FaBars, FaTimes, FaBell, FaUserCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useEffect, useState } from 'react';
import { useGetNotificationsQuery, useNotifyBidMutation } from '../slices/notificationApiSlice';
import { AttentionSeeker, Fade } from 'react-awesome-reveal';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifyBid] = useNotifyBidMutation();
  const shouldAnimateOnRouteChange = location.pathname === '/';

  const { data: notifData, refetch } = useGetNotificationsQuery(undefined, {
    skip: !userInfo,
  });

  useEffect(() => {

    const sendNotification = async () => {
      try {
        await notifyBid();
      } catch (err) {
        console.error('Notification API error:', err);
      }
    };
  
    if (userInfo) {
      sendNotification();
      refetch();
    }
  }, [location,navigate, userInfo,notifOpen, refetch]);

  const notifications = notifData?.data?.slice(-10).reverse() || [];

  const logoutHandler = async () => {
    try {
      console.log('Logging out....')
      console.log(userInfo)
      await logoutApiCall({ token: userInfo.data }).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      navigate('/login');
      setDropdownOpen(false);
    }
  };

  return (
    <header className="bg-blue-400 text-white relative">
      <nav className="container mx-0.5 flex items-center justify-between p-4">
        <button className="text-white text-xl mr-4 z-50" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <Link to="/" className="text-xl font-bold">BUY ME !</Link>

        <div className="hidden md:flex items-center space-x-4">
          {userInfo ? (
            <div className="relative flex items-center">
              <div className="relative">
              <AttentionSeeker key={shouldAnimateOnRouteChange ? location.pathname : 'static'} effect="bounce" triggerOnce={false}>
                <FaBell
                  size={18}
                  className="cursor-pointer mr-4"
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setDropdownOpen(false);
                  }}
                />
              </AttentionSeeker> 

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-md shadow-lg py-2 z-50 animate-fade-in max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <Fade direction="down" duration={300} triggerOnce>
                        <div
                          key={notif.id}
                          className="px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                        >
                          <p className="text-xs text-gray-400 mb-1">Notification Type: <span className="font-semibold text-red-500">{notif.topic}</span></p>
                          <p className="text-sm font-semibold text-blue-600">{notif.title}</p>
                          <p className="text-xs text-gray-700 mt-1">{notif.description}</p>
                        </div>
                      </Fade>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotifOpen(false);
                  }}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <FaUserCircle size={20} />
                  <span>{userInfo?.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-md shadow-lg py-2 z-50 animate-fade-in">
                    <div className="flex items-center px-4 py-2 border-b">
                      <img
                        src="https://placehold.co/40"
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold">{userInfo?.first_name ? `Hi ${userInfo.first_name} !` : 'Hi User !'}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-2 hover:underline">
                <FaSignInAlt />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-2 hover:underline">
                <FaSignOutAlt />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </nav>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-500 text-white z-40 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="absolute top-10 p-4 space-y-4">
          <Link to="/" className="block" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className="block" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/auctions" className="block" onClick={() => setMenuOpen(false)}>Auctions</Link>
          <Link to="/my-auctions" className="block" onClick={() => setMenuOpen(false)}>My Auctions</Link>
          <Link to="/biddings" className="block" onClick={() => setMenuOpen(false)}>Biddings</Link>
          <Link to="/notifications" className="block" onClick={() => setMenuOpen(false)}>Notifications</Link>
          <Link to="/alerts" className="block" onClick={() => setMenuOpen(false)}>Create Alerts</Link>
          <Link to="/admin" className="block" onClick={() => setMenuOpen(false)}>Admin's Portal</Link>

          {userInfo?.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className="block" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              <Link to="/admin/users" className="block" onClick={() => setMenuOpen(false)}>Manage Users</Link>
            </>
          )}

          {userInfo ? (
            <>
              <Link to="/profile" className="block" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={logoutHandler} className="block text-left w-full">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="block" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
