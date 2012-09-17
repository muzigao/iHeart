var allPictures = [];
var tabUrl;


$(document).ready(function(){	localStorage.clear();
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},function(activeTabs) {
      chrome.tabs.executeScript(activeTabs[0].id, {file: 'getPictures.js'});
			tabUrl = activeTabs[0].url;
    });
  });

});

chrome.extension.onMessage.addListener(
  function(picList, sender, sendResponse) {
    for (var i in picList) {
		  allPictures.push(picList[i]);
		}
		allPictures.sort(function(a,b){
			return a.size - b.size;
		});
		allPictures.reverse();

		showPictures();

		selectPicture();
		
});

function showPictures(){
	alert(localStorage["mysetting"]);

	var picNum = allPictures.length >= 8? 8:allPictures.length;
	for(var i=0; i<picNum; i++){
		$('#pictures_container').append('<li></li>');
		$('#pictures_container li').last().append('<img src="' + allPictures[i].srcUrl + '"/>' +
																							'<div class="clear"></div>');
		if(i==3){
			$('#pictures_container').append('<div class="clear"></div>');
		}
	}
}

function selectPicture(){
	var heartItem = {
		picSrc: "",
		itemLink: tabUrl,
		prompt: ""
	};

	$('#pictures_container li').each(function(){
		$(this).click(function(){
			$(this).addClass('selected');
			$(this).siblings().removeClass('selected');

			heartItem.picSrc = $(this).children('img').attr("src");

			localStorage["mysetting"] = "myvalue";
			$('#current_url').text(localStorage["mysetting"]);
		});
	});
	
	saveItem(heartItem);
}

function saveItem(heartitem){
	$('#save').click(function(){
		if($('#price').val() == "" ){
			alert("Please enter something as prompt! (e.g price)");
		}
		else{
			heartitem.prompt = $('#price').val();

			//var heartItemList = localStorage["heartItems"];
			//heartItemList.push(heartitem);

			/*

			var heartItemList;

			if(localStorage.getItem('heartItems') == null){
				heartItemList = {"items": []};
			}
			else{
				heartItemList = JSON.parse(localStorage.getItem('heartItems'));
			}

			heartItemList.items.push(heartitem);
			localStorage.setItem('heartItems', JSON.stringify(heartItemList));


			//alert(localStorage.getItem('heartItems'));
			*/

		}
	});

}
