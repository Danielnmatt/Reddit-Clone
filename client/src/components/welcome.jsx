import {Link} from 'react-router-dom'
import '../stylesheets/App.css'
import '../stylesheets/Welcome.css'
const Welcome = (props) => {
    
    return(
        <div id="welcome-parent">
            <div id="welcome-container">
                <h1 id="welcome-text" className="h1-fixer">Welcome</h1>
                <div id="welcome-div">
                    <Link to="/register" className="welcome-link clickables_group3">
                        <h2 className="welcome-options">Register as a new user</h2>
                    </Link>
                    <Link to="/login" className="welcome-link clickables_group3">
                        <h2 className="welcome-options">Login</h2>
                    </Link>
                    <Link to="/phreddit" className="welcome-link clickables_group3">
                        <h2 className="welcome-options">Continue as guest</h2>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Welcome;