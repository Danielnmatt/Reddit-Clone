import '../../stylesheets/Content.css'
import '../../stylesheets/App.css'

//App.js->phreddit.js->main.jsx->content.jsx->contentHeader.jsx
const ContentHeader = (props) => {
    if(props.visibility === false){
        return null;
    }
    
    const localClickHelper = (buttID) => () => {
        props.allUpdaters.setSelectedSortButton(buttID);
    }
    
    return (
        <div id="content-header">
            <div id="selected-community-info">
                <h1 id="all-posts-text" className='h1-fixer'>{props.communityHeaderInfo[0]}</h1>
                <h1 id="selected-community-description" className='h1-fixer'>{props.communityHeaderInfo[1]}</h1>
                <h1 id="selected-community-age" className='h1-fixer'>{props.communityHeaderInfo[2]}</h1>
                <h1 id="selected-community-member-count" className='h1-fixer'>{props.communityHeaderInfo[3]}</h1>
            </div>
            <div id="content-buttons-div">
                <button className="content-buttons clickables_group1" type="button" id="newest-button" onClick={localClickHelper("newest-button")} style={{backgroundColor: props.allData.selectedSortButton === "newest-button" ? "#FF5700" : "#E5EBEE"}}>Newest</button>
                <button className="content-buttons clickables_group1" type="button" id="oldest-button" onClick={localClickHelper("oldest-button")} style={{backgroundColor: props.allData.selectedSortButton === "oldest-button" ? "#FF5700" : "#E5EBEE"}}>Oldest</button>
                <button className="content-buttons clickables_group1" type="button" id="active-button" onClick={localClickHelper("active-button")} style={{backgroundColor: props.allData.selectedSortButton === "active-button" ? "#FF5700" : "#E5EBEE"}}>Active</button>
            </div>
        </div>
    );
};
export default ContentHeader;