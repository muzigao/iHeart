var allPictures = []; //store pictures extracted from getPictures.js
var tabUrl;						//get url from current tab

$(document).ready(function(){
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},function(activeTabs) {
      chrome.tabs.executeScript(activeTabs[0].id, {file: 'getPictures.js'});
			tabUrl = activeTabs[0].url;
    });
  });

	$('#to_display').toggle(function(){
		$('#display_heartitems').show();
	},function(){
		$('#display_heartitems').hide();
	});

	$('#to_select').toggle(function(){
		$('#select_pictures').show();
	},function(){
		$('#select_pictures').hide();
	});

	//To clear all items stored in iHeart package
	//and refresh user interface
	$('#to_clear').click(function(){
		var is_clear = confirm("Do you want to clear all items?");
		if (is_clear){
			localStorage.clear();

			$('#heartitems_container li').remove();
			$('#heartitems_container').append('<li class="noitem"><p>No heart items</p></li>');
		}
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

		showHeartItems();
		showPictures();
		selectPicture();
});


//To display all items in iHeart package
function showHeartItems(){
	if(localStorage.getItem('heartItems') == null ||
		JSON.parse(localStorage.getItem('heartItems')).items.length == 0){
		$('#heartitems_container').append('<li class="noitem"><p>No heart items</p></li>');
	}
	else{

		$('#heartitems_container li').remove();

		var allItems = JSON.parse(localStorage.getItem('heartItems')).items;
		for(var i=0; i<allItems.length; i++){
			$('#heartitems_container').append('<li></li>');
			$('#heartitems_container li').last().append(
					'<div class="delete">X</div>' + 
					'<img src="' + allItems[i].picSrc + '"/>' +
					'<div class="prompt">' + allItems[i].prompt + '</div>' +
					'<div class="clear"></div>');

			$('#heartitems_container li:last').attr('data-url',allItems[i].itemLink);
			$('#heartitems_container li:last').attr('data-id',allItems[i].id);
			$('#heartitems_container li:last').attr('title',"Go to " + allItems[i].itemLink);
			if((i!=0) && (i%3 == 0) ){
				$('#heartitems_container').append('<div class="clear"></div>');
			}
		}

		$('#heartitems_container li').each(function(){
			$(this).hover(function(){
				$(this).children('.delete:first').show();
				$(this).children('.prompt:first').show();
			},function(){
				$(this).children('.delete:first').hide();
				$(this).children('.prompt:first').hide();
			});

			$(this).children('img:first').click(function(){
				window.open($(this).parents('li:first').attr('data-url'));
			});
			
			$(this).children('.delete:first').click(function(){
				var is_delete = confirm("Do you really want to delete this item?");
				
				if(is_delete){
					$(this).parents('li:first').remove();

					var _index = $(this).parents('li:first').attr('data-id');
					deleteItem(_index);
				}
			});
		});
	}	
}

//To delete one item from iHeart package
function deleteItem(value){
	var heartItemList = JSON.parse(localStorage.getItem('heartItems'));
	var _index;
	for(var i=0; i<heartItemList.items.length; i++){
		if(heartItemList.items[i].id == value){
			_index = i;
		}
	}

	heartItemList.items.splice(_index,1);

	localStorage.setItem('heartItems',JSON.stringify(heartItemList));
	showHeartItems();
}

//To extract images from current web page
//Only display first 8 (sorted by size)
function showPictures(){
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

//To select one and save to localStorage
function selectPicture(){
	var heartItem = {
		id: -1,
		picSrc: "",
		itemLink: tabUrl,
		prompt: ""
	};

	$('#pictures_container li').each(function(){
		$(this).click(function(){
			$(this).addClass('selected');
			$(this).siblings().removeClass('selected');

			heartItem.picSrc = $(this).children('img').attr("src");
		});
	});

	saveItem(heartItem);
}

//To store one item(id, image src, item link, and optional prompt) in localStorage['heartItems']
function saveItem(heartitem){
	$('#save').click(function(){

		var flag = false;
		if($('#prompt').val() == ""){
			var is_prompt_empty = confirm("Do you really want to leave the prompt empty?");
			if(is_prompt_empty){
				flag = true;
			}
		}
		
		if($('#prompt').val() != "" || flag){
		
			heartitem.prompt = $('#prompt').val();
			heartitem.id = generateIndex();
	
			var heartItemList;
			if(localStorage.getItem('heartItems') == null){
				heartItemList = {"items": []};
			}
			else{
				heartItemList = JSON.parse(localStorage.getItem('heartItems'));
			}

			heartItemList.items.push(heartitem);
			localStorage.setItem('heartItems', JSON.stringify(heartItemList));

			showHeartItems();
			$('#prompt').val("");
		}
	});
}

//To generate id for each item
function generateIndex(){
	if(localStorage.getItem('heartItems') == null ||
		 JSON.parse(localStorage.getItem('heartItems')).items.length == 0){
		return 1;
	}
	else{
		var heartItemList;
		heartItemList = JSON.parse(localStorage.getItem('heartItems'));

		var index = heartItemList.items[0].id;
		for(var i=0; i<heartItemList.items.length; i++){
			if(index < heartItemList.items[i].id){
				index = heartItemList.items[i].id;
			}
		}
		return index+1;
	}
}


