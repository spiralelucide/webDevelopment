var utils = {};

utils.captureMouse = function(element){
	var mouse = {x: 0, y: 0};

	element.addEventListener('mousemove', function(e){
		var x, y;
		if(e.pageX || e.pageY){
			x = e.pageX;
			y = e.pageY;
		}else{
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x -= element.offsetLeft;
		y -= element.offsetTop;

		mouse.x = x;
		mouse.y = y;
	}, false);

	return mouse;
};

utils.detectDragAndDrop = function(){
	if(navigator.appName == 'Microsoft Internet Explorer'){
		var ua = navigator.userAgent;
		var re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
		if (re.exec(ua) != null){
			var rv = parseFloat(RegExp.$1);
			if(rv >= 6.0)
				return true;
		}
		return false;
	}
	if('draggable' in document.createElement('span'))
		return true;
	return false;
};

utils.handleDragover = function(e){
	if(e.preventDefault)
		e.preventDefault;
	return false;
};