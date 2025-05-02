import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { setCredentials } from '../slices/authSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';

const RegisterScreen = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  // const { userInfo } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate('/');
  //   }
  // }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do no match. Please try again !');
    } else {
      try {
        const res = await register({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          phone,
          countrycode: countryCode
        }).unwrap();

        toast.success("Registration is successful!",{
          hideProgressBar: true 
        });
        const timer = setTimeout(() => {
          navigate('/login');
        }, 1000);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }

  return (
    <FormContainer>
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="firstName" className="mb-1 font-semibold">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastName" className="mb-1 font-semibold">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-semibold">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-1 font-semibold">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="countryCode" className="mb-1 font-semibold">
            Country Code
          </label>
          <input
            id="countryCode"
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="p-2 border rounded"
            required
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
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="mb-1 font-semibold">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Register
        </button>

        {isLoading && <Loader />}
      </form>

      <div className="py-6 text-center">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;