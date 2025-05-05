// // ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// // ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
// import './stylesheets/App.css';
// import Phreddit from './components/phreddit.js'
// import Welcome from './components/welcome.jsx'
// import RegisterUser from './components/registerUser.jsx';
// import LoginUser from './components/loginUser.jsx';
// import {BrowserRouter, Route, Routes} from 'react-router-dom'
// import {useState, useEffect} from 'react'

// function App() {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   })

//   useEffect(() => {
//     localStorage.setItem('user', JSON.stringify(user));
//   }, [user]);
  
//   if(!navigator.onLine){
//     return <h1>GET SOME INTERNET!</h1>;
//   }
  
//   return (
//     <BrowserRouter>
//       <section className="phreddit">
//         <Routes>
//           <Route path='/' element={<Welcome setUser={setUser}/>}/>
//           <Route path='/phreddit' element={<Phreddit user={{user, setUser}}/>}/>
//           <Route path='/register' element={<RegisterUser/>}/>
//           <Route path='/login' element={<LoginUser setUser={setUser}/>}/>
//         </Routes>
//       </section>
//     </BrowserRouter>
//   );
// }

// export default App;







// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import Phreddit from './components/phreddit.js'
import Welcome from './components/welcome.jsx'
import RegisterUser from './components/registerUser.jsx';
import LoginUser from './components/loginUser.jsx';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {UserContextProvider} from './userContext.jsx'

function App() {
  if(!navigator.onLine){
    return <h1>GET SOME INTERNET!</h1>;
  }
  
  return (
    <UserContextProvider>
      <BrowserRouter>
        <section className="phreddit">
          <Routes>
            <Route path='/' element={<Welcome/>}/>
            <Route path='/phreddit' element={<Phreddit/>}/>
            <Route path='/register' element={<RegisterUser/>}/>
            <Route path='/login' element={<LoginUser/>}/>
          </Routes>
        </section>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
