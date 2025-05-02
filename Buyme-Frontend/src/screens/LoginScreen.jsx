import React, { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import Loader from '../components/Loader';

const LoginScreen = () => {
	const [email,setEmail] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [login, {isLoading,error}] = useLoginMutation();
	const {userInfo} = useSelector(state => state.auth);

	useEffect(()=>{
		if (userInfo){
      toast.success("Login successful!",{
        hideProgressBar: true 
      });
      const timer = setTimeout(() => {
        navigate('/');
      }, 1000);
      return () => clearTimeout(timer);
		}
	}, [navigate, userInfo]);

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const res = await login({email, password}).unwrap();
      const decoded = jwtDecode(res.data); 
      console.log('Decoded Token:', decoded);

      dispatch(setCredentials({
        ...decoded,
        ...res,
      }));
      console.log({...res})
			// navigate('/');
		} catch (err) {
			console.log(err)
			toast.error(err?.data?.message || err.error || 'Something went wrong. Please try again.');
		}
	};

  return (
		<>
		<ToastContainer/>
    <FormContainer>
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        <form onSubmit={submitHandler} className='space-y-6'>
            <div className='flex flex-col'>
                <label htmlFor="email" className='mb-1 font-semibold'>
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-2 border rounded"
                />
            </div>

            <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-semibold">
                Password
            </label>
            <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2 border rounded"
            />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                Sign In
            </button>
        </form>

      {isLoading && <Loader />}

      <div className="py-6 text-center">
        <p>
          New Customer?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>

    </FormContainer>
		</>
  )
}

export default LoginScreen
