import {useNavigate} from 'react-router-dom'
import '../stylesheets/App.css'
import '../stylesheets/LoginUser.css'
import {useState} from 'react'
import axios from 'axios'

const LoginUser = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        
        let tmpErrors = "";
        let userID = "";
        
        if(!email || !password){
            tmpErrors += "Email and password must be entered.\n";
        }
        else{
            try {
                
                const res = await axios.post("http://127.0.0.1:8000/users/login/", {email: email, password: password});
                if(!res.data){
                    tmpErrors += "Incorrect email or password.\n";
                }

                /*
                
                try {
                    const token = req.cookies.token;
                    if (!token) {
                        return res.status(401).json({errorMessage: "Unauthorized"})
                    }
                    const verified = jwt.verify(token, process.env.JWT_SECRET)
                    // IF AN EXCEPTION ISN’T THROWN THEN THAT MEANS THE USER HAS BEEN VERIFIED
                    // WE CAN NOW LET THEM DO WHAT THEY WANT LIKE CRUD OPERATIONS BUT WE MUST
                    // ALSO MAKE SURE THEY HAVE PERMISSION TO USE THE RESOURCES THEY WANT TO USE
                }
                catch (err) {
                    return res.status(401).json({errorMessage: "Unauthorized"})
                }
                
                
                */
                // if (!res.data || res.data.length == 0) {//incorrect email
                //     tmpErrors += "Incorrect email or password.\n";
                // }
                // else{
                //     const user = res.data[0];
                //     userID = user.url.replace("users/", "");

                //     try{
                //         const res2 = await axios.post(`http://127.0.0.1:8000/users/comparepassword/${userID}`, {password: password});
                //         if(!res2.data){//incorrect password
                //             tmpErrors += "Incorrect email or password.\n";
                //         }
                //         else{
                            
                //         }
                //     }
                //     catch(e){
                //         console.error(e);
                //     }
                // }

            }
            catch (e){
                console.error(e);
            }
        }
        
        if (tmpErrors) {
            tmpErrors = (tmpErrors.slice(-1) === '\n') ? (tmpErrors.substring(0, tmpErrors.length - 1)) : tmpErrors;
            setErrors(tmpErrors);
            return;
        }
        else{
            props.userHandlers.setUserID(userID);
            navigate('/phreddit');
        }
        
    };
    
    return(
        <div id="login-parent">
            <div id="login-container">
                <h1 id="login-text" className="h1-fixer">LOGGING IN USER</h1>
                <div id="login-div">
                    <form id="login-user-form">
                        <div className="user-input-container">
                            <label htmlFor="email-input">Email&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setEmail(e.target.value)} type="text" id="email-input" className="user-input-field" placeholder="johncena@johnny.com..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="password-input">Password&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setPassword(e.target.value)} type="text" id="password-input" className="user-input-field" placeholder="ucantCme123..." maxLength="40" required />
                        </div>
                        <p id="error-msgs">{errors}</p>
                        <button onClick={login} id="login-button" type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default LoginUser;