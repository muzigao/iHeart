/*
 * Get pictures from current tab.
 *
 */


/*
 * Class: picture
 */

var Picture = function(){
	this.srcUrl = "";
	this.size = 0;
}


/*
 * Get all pictures (.jpg, .png, .gif)
 * Return an array of Pictures, sorted by size (width * height)
 */
var images = document.getElementsByTagName('img');
var picList = [];
for (var i=0; i < images.length; i++ ){
	if(isSrcUrlValid(images[i]) && isSizeValid(images[i])){
		var pic = new Picture();
		pic.srcUrl = images[i].src;
		pic.size = images[i].clientWidth * images[i].clientHeight;
		picList.push(pic);
	}
}

/*
 * Sorting all pictures by size in descending order
 */

picList.sort(function(a,b){
	return a.size - b.size;
});
picList.reverse();

/*
 * TEST
 
for (var i=0; i < picList.length; i++){
	console.log(picList[i].srcUrl);
}
*/


/*
 * Check valid src (.jpg, .png, .gif)
 * If img src ends with .jpg/.png/.gif, return true
 */
function isSrcUrlValid (image) {
	var endingStr = image.src.substr(-4);
	if(endingStr == ".jpg" ||
		 endingStr == ".png" ||
     endingStr == ".gif"){
		return true;
	}
	else{
		return false;
	}
}

function isSizeValid (image) {
	var w = image.width;
	var h = image.height;
	var ratio = w/h;

	if ((ratio > 0.5) && (ratio < 2)){
		return true;
	}
	else{
		return false;
	}
}

//chrome.extension.sendRequest(picList);
chrome.extension.sendMessage(picList);
