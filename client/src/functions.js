export const sortBy = (type, postsArray, commentsArray) => {
	if (type === "active") {
		let newestCommentMap = new Map();
		let newestCommentArray = [];

		postsArray.forEach((post) => {
			let commentIDs = post.commentIDs;
			let postComments = [];

			let somethingWasAdded;
			do {
				somethingWasAdded = false;
				for(let c = 0; c < commentsArray.length; c++){
					const comment = commentsArray[c];
					const newCommentID = comment.url.replace("comments/", "");
					if((!postComments.includes(comment)) && (commentIDs.includes(newCommentID))){
						postComments.push(comment);
						somethingWasAdded = true;
					}
					else if((!postComments.includes(comment)) && (postComments.some(parentComment => parentComment.commentIDs.includes(newCommentID)))){
						postComments.push(comment);
						somethingWasAdded = true;
					}
				}
			} while (somethingWasAdded);

			let newestComment = null
			if(postComments.length === 0){
				newestComment = post.postedDate;
			}
			else{
				newestComment = postComments[0].commentedDate;
			}
		
			postComments.forEach((comment) => {
				if (comment.commentedDate >= newestComment) {
					newestComment = comment.commentedDate;
				}
			});
		
			newestCommentMap.set(newestComment, post);
			newestCommentArray.push(newestComment);
		});
		
		newestCommentArray.sort((a, b) => {
			if(b - a === 0){
				let postA = newestCommentMap.get(a);
				let postB = newestCommentMap.get(b);
				return (postA.postedDate <= postB.postedDate) ? a : b;
			}
			return (Date.parse(b) - Date.parse(a));
		});
		
		let finalArray = [];
		newestCommentArray.forEach((date) => {
			finalArray.push(newestCommentMap.get(date));
		});

		return finalArray;
	}
	
	for (let i = 0; i < postsArray.length - 1; i++) {
		let min_idx = i;
		for (let j = i + 1; j < postsArray.length; j++) {
			if (postsArray[j].postedDate < postsArray[min_idx].postedDate) {
				min_idx = j;
			}
		}
		let temp = postsArray[i];
		postsArray[i] = postsArray[min_idx];
		postsArray[min_idx] = temp;
	}

	switch (type) {
		case "newest":
			postsArray.reverse();
			return postsArray;
		case "oldest":
			return postsArray;
		default:
			return null;
	}
}

export const countComments = (postObject, count, comments) => {
	let postCommentIDs = postObject.commentIDs;
	let postCommentObjects = [];
	
	comments.forEach((comment) => {
		if (postCommentIDs.includes(comment.url.replace('comments/', ''))) {
			postCommentObjects.push(comment);
		}
	});
	
	if (postCommentObjects.length === 0) {
		return 0;
	}
	
	count = postCommentObjects.length;
	for (let i = 0; i < postCommentObjects.length; i++) {
		count += countCommentsHelper(postCommentObjects[i], 0, comments);
	}
	return count;
};

export const countCommentsHelper = (comment, depth, comments) => {
	let commentReplyObjects = [];
	comments.forEach((curr) => {
		if (comment.commentIDs.includes(curr.url.replace('comments/', ''))) {
			commentReplyObjects.push(curr);
		}
	});
	if (commentReplyObjects.length === 0) {
		return depth;
	}
	
	for (let i = 0; i < commentReplyObjects.length; i++) {
		depth = countCommentsHelper(commentReplyObjects[i], depth + 1, comments);
	}
	
	return depth;
};

export const sortComments = (array) => {
	for (let i = 0; i < array.length - 1; i++) {
		let min_idx = i;
		for (let j = i + 1; j < array.length; j++) {
			if (array[j].commentedDate < array[min_idx].commentedDate) {
				min_idx = j;
			}
		}
		let temp = array[i];
		array[i] = array[min_idx];
		array[min_idx] = temp;
	}
	return array;
}

export const hyperLink = (text, postPreview) => {
	const newText = [];
	let currentIndex = 0;
	let alertMsg = "";
	while(true){
		const startLinkTextIndex = text.indexOf('[', currentIndex);

		if(startLinkTextIndex > text.indexOf('(', currentIndex) || startLinkTextIndex > text.indexOf(']', startLinkTextIndex)){
			newText.push(text);
			break;
		}

		if(startLinkTextIndex === -1 || ((text.indexOf("]", startLinkTextIndex) !== -1 + text.indexOf("(", text.indexOf("]", startLinkTextIndex))) && (text.substring(text.indexOf("]", startLinkTextIndex) + 1, text.indexOf("(", startLinkTextIndex)).trim() !== ""))){
			newText.push(text.substring(currentIndex));
			break;
		}

		if(startLinkTextIndex > currentIndex){
			newText.push(text.substring(currentIndex, startLinkTextIndex));
		}
		
		const endLinkTextIndex = text.indexOf(']', startLinkTextIndex);
		if(endLinkTextIndex === -1){
			newText.push(text.substring(startLinkTextIndex));
			break;
		}

		const startHrefIndex = text.indexOf('(', endLinkTextIndex);
		const endHrefIndex = text.indexOf(')', startHrefIndex);
		if(startHrefIndex === -1 || endHrefIndex === -1){
			newText.push(text.substring(startLinkTextIndex));
			break;
		}

		const linkText = text.substring(startLinkTextIndex + 1, endLinkTextIndex);
		const linkHref = text.substring(startHrefIndex + 1, endHrefIndex);
		if(linkText === ""){
			alertMsg += "Hyperlink name cannot be blank\n";
		}
		
		if(!linkHref.startsWith("http://") && !linkHref.startsWith("https://")){
			alertMsg += "Hyperlink href must start with http:// or https://\n";
		} 

		if(alertMsg !== ""){
			alert(alertMsg);
		}

		if(postPreview){
			newText.push(linkText);
		}
		else{
			newText.push(<a className="hyperlinks" key={currentIndex} href={linkHref} target="_blank" rel="noreferrer">{linkText}</a>);
		}
		currentIndex = endHrefIndex + 1;
	}
	return newText;
};

export const timestamp = function (postDate) {
	let currDate = new Date();
	let newPostDate = new Date(postDate);
	let difference = new Date(currDate - newPostDate);
	
	let ds = Math.floor(difference / 1000);
	let dm = Math.floor(ds / 60);
	let dh = Math.floor(dm / 60);
	let dd = Math.floor(dh / 24);
	let dmonth = Math.floor(dd / 30);
	let dy = Math.floor(dd / 365);
	
	if (dy > 1) {
		return dy + " years ago";
	} else if (dy === 1) {
		return 1 + " year ago";
	} else if (dmonth > 1) {
		return dmonth + " months ago";
	} else if (dmonth === 1) {
		return 1 + " month ago";
	} else if (dd > 1) {
		return dd + " days ago";
	} else if (dd === 1) {
		return 1 + " day ago";
	} else if (dh > 1) {
		return dh + " hours ago";
	} else if (dh === 1) {
		return 1 + " hour ago";
	} else if (dm > 1) {
		return dm + " minutes ago";
	} else if (dm === 1) {
		return 1 + " minute ago";
	} else if (ds > 1) {
		return ds + " seconds ago";
	} else {
		return 1 + " second ago";
	}
};