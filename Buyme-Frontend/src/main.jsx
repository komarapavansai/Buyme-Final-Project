import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen.jsx';
import store from './store.jsx';
import { Provider } from 'react-redux';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import AuctionsScreen from './screens/AuctionsScreen.jsx';
import AuctionDetailScreen from './screens/AuctionDetailScreen.jsx';
import MyAuctionsScreen from './screens/MyAuctionsScreen.jsx';
import CreateAuctionScreen from './screens/CreateAuctionScreen.jsx';
import EditAuctionScreen from './screens/EditAuctionScreen.jsx';
import MyAuctionDetailScreen from './screens/MyAuctionDetailScreen.jsx';
import NotificationsPage from './screens/NotificationsPage.jsx';
import MyBiddingsScreen from './screens/MyBiddingsScreen.jsx';
import QuestionAndAnswerScreen from './screens/QuestionAndAnswerScreen.jsx';
import AdminScreen from './screens/AdminScreen.jsx';
import AlertsScreen from './screens/AlertsScreen.jsx';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App/>} >
    <Route index={true} path='/' element={<HomeScreen/>} />
    <Route path='/login' element={<LoginScreen />} />
    <Route path='/register' element={<RegisterScreen />} />

    {/* Private Routes */}
    <Route path='' element={<PrivateRoute />}>
      <Route path='/profile' element={<ProfileScreen />} />
      <Route path='/auctions' element={<AuctionsScreen />} />
      <Route path='/my-auctions' element={<MyAuctionsScreen />} />
      <Route path='/my-auctions/:id' element={<MyAuctionDetailScreen />} />
      <Route path='/create-auction' element={<CreateAuctionScreen />} />
      <Route path='/auction/:id/edit' element={<EditAuctionScreen />} />
      <Route path='/auction/:id' element={<AuctionDetailScreen />} />
      <Route path='/biddings' element={<MyBiddingsScreen />} />
      <Route path='/notifications' element={<NotificationsPage />} />
      <Route path='/admin' element={<AdminScreen />} />
      <Route path='/qna' element={<QuestionAndAnswerScreen />} />
      <Route path='/alerts' element={<AlertsScreen />} />
    </Route>
  </Route>
))
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  </Provider>
)
