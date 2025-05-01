// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import Phreddit from './components/phreddit.js'
import Welcome from './components/welcome.jsx'
import RegisterUser from './components/registerUser.jsx';
import LoginUser from './components/loginUser.jsx';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {useState} from 'react'

function App() {
  const [userID, setUserID] = useState(null);
  return (
    <BrowserRouter>
      <section className="phreddit">
        <Routes>
          <Route path='/' element={<Welcome userHandlers={{userID, setUserID}}/>}/>
          <Route path='/phreddit' element={<Phreddit userHandlers={{userID, setUserID}}/>}/>
          <Route path='/register' element={<RegisterUser userHandlers={{userID, setUserID}}/>}/>
          <Route path='/login' element={<LoginUser userHandlers={{userID, setUserID}}/>}/>
          
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;
