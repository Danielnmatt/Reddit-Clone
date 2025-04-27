import Navbar from './navbar.jsx'
import Content from './content/content.jsx'

//App.js->phreddit.js->main.jsx
const Main = (props) => {
    
    return (
        <div id="main">
            {/* Navbar */}
            <Navbar 
                allData={props.allData}
                allUpdaters={props.allUpdaters}
                allOpeners={props.allOpeners} 
                allPageViews={props.allPageViews}
            />

            {/*Content*/}
            <Content 
                allData={props.allData}
                allUpdaters={props.allUpdaters}
                selectedPost={props.selectedPost}
                selectedComment={props.selectedComment}
                allOpeners={props.allOpeners} 
                allPageViews={props.allPageViews}
            />
        </div>
    );
};
export default Main;