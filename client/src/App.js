// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import Phreddit from './components/phreddit.js'
import Welcome from './components/welcome.jsx'
import RegisterUser from './components/registerUser.jsx';
import LoginUser from './components/loginUser.jsx';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {UserContextProvider} from './userContext.jsx'
import {useState} from 'react';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));

  if(!isOnline){
    return <h1>GET SOME INTERNET!</h1>;
  }
  
  return (
    <UserContextProvider>
      <BrowserRouter>
        <section className="phreddit">
          <Routes>
            <Route path='/' element={<Welcome/>}/>
            <Route path='/phreddit' element={<Phreddit setIsOnline={setIsOnline}/>}/>
            <Route path='/register' element={<RegisterUser/>}/>
            <Route path='/login' element={<LoginUser/>}/>
          </Routes>
        </section>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
