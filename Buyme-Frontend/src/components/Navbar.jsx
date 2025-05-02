import { FaSignInAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useState } from 'react';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall({ token: userInfo.data }).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      navigate('/login');
      setDropdownOpen(false)
    }
  };

  return (
    <header className="bg-blue-400 text-white relative">
      <nav className="container mx-0.5 flex items-center justify-between p-4">
        {/* Hamburger for all screens */}
        <button
          className="text-white text-xl mr-4 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <Link to="/" className="text-xl font-bold">
          BUY ME !
        </Link>

        {/* Desktop user section */}
        <div className="hidden md:flex items-center space-x-4">
          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <span>{userInfo?.name}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg py-2 z-50 animate-fade-in">
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

      {/* Drawer-style menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-500 text-white z-40 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="absolute top-10 p-4 space-y-4">
          <Link to="/" className="block" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className="block" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/auctions" className="block" onClick={() => setMenuOpen(false)}>My auctions</Link>
          <Link to="/biddings" className="block" onClick={() => setMenuOpen(false)}>Biddings</Link>

          {/* Conditionally visible routes */}
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
