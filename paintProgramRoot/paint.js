$(document).ready(function(){
	var canvas = document.getElementById("paintCanvas"),
		context = canvas.getContext('2d'),
		bufferCanvas = document.createElement('canvas'),
		bufferContext = bufferCanvas.getContext('2d'),
		overLayCanvas = document.getElementById("overLay"),
		overLayContext = overLayCanvas.getContext('2d'),
		paintbrush = new Paintbrush(),
		eraser = new Eraser(),
		pen = new Pen(),
		rect = new Rectangle(),
		circle = new Circle(),
		draw,
		newColor,
		newSize,
		newStroke,
		newWidth,
		mouse = utils.captureMouse(canvas);

	bufferContext.canvas.width = canvas.width;
	bufferContext.canvas.height = canvas.height;

	//Block of code responds to changes in the tool select menu on the left
	$("#toolSelect").change(function(){
		var selected = $('#toolSelect').find(':selected').text();
		//clears any irrelevant event listeners and creates new ones based on the selected option
		remEventListeners();
		remFeatureForms();
		if(selected == 'Pen'){
			canvas.addEventListener('mousedown', penMousedown, false);
			window.addEventListener('mouseup', penMouseup, false);
			document.getElementById('penFeatures').style.display='inline';
		}else if(selected == 'Paintbrush'){
			canvas.addEventListener('mousedown', paintMousedown, false);
			window.addEventListener('mouseup', paintMouseup, false);
			document.getElementById('paintbrushFeatures').style.display='inline';
		}else if(selected == 'Rectangle'){
			canvas.addEventListener('mousedown', rectMousedown, false);
			window.addEventListener('mouseup', rectMouseup, false);
			document.getElementById('rectangleFeatures').style.display='inline';
		}else if(selected == 'Circle'){
			canvas.addEventListener('mousedown', circleMousedown, false);
			window.addEventListener('mouseup', circleMouseup, false);
			document.getElementById('circleFeatures').style.display='inline';
		}else if(selected == 'Eraser'){
			canvas.addEventListener('mousemove', eraserOverlay, false);
			canvas.addEventListener('mousedown', eraserMousedown, false);
			window.addEventListener('mouseup', eraserMouseup, false);
			document.getElementById('eraserFeatures').style.display='inline';
		}else{
			remEventListeners();
		}
	})
	//Event handlers
	function penMousedown(e){
		pen.setParam();
		overLayContext.clearRect(0,0, canvas.width, canvas.height);
		context.fillStyle = pen.penColor;
		context.beginPath();
		context.moveTo(mouse.x,mouse.y);
		context.lineWidth= pen.penSize;
		context.lineJoin = pen.lineJoin;
		context.lineCap = pen.lineCap;
		context.strokeStyle = pen.penColor;
		canvas.addEventListener('mousemove', pen.penDraw,false);	
	}
	function penMouseup(e){
		canvas.removeEventListener('mousemove', pen.penDraw, false);
	}
	function paintMousedown(e){
		paintbrush.setParam();
		overLayContext.clearRect(0,0, canvas.width, canvas.height);
		bufferContext.fillStyle = paintbrush.brushColor;
		draw = setInterval(function(){paintbrush.paintbrushDraw()},1);
	}
	function paintMouseup(e){
		clearInterval(draw);
	}
	function rectMousedown(e){
		rect.setParam();
		rect.x = mouse.x;
		rect.y = mouse.y;
		bufferContext.fillStyle = rect.color;
		bufferContext.strokeStyle = rect.strokeColor;
		bufferContext.lineWidth = rect.strokeWidth;
		draw = setInterval(function(){rect.rectDraw()},10);
	}
	function rectMouseup(e){
		overLayContext.clearRect(0,0,canvas.width,canvas.height);
		context.drawImage(bufferCanvas,0,0);
		bufferContext.clearRect(0,0,canvas.width,canvas.height);
		clearInterval(draw);
	}
	function circleMousedown(e){
		circle.setParam();
		circle.x = mouse.x;
		circle.y = mouse.y;
		bufferContext.fillStyle = circle.color;
		bufferContext.strokeStyle = circle.strokeColor;
		bufferContext.lineWidth = circle.strokeWidth;
		draw = setInterval(function(){circle.circleDraw()},10);
	}
	function circleMouseup(e){
		overLayContext.clearRect(0,0, canvas.width, canvas.height);
		context.drawImage(bufferCanvas, 0,0);
		bufferContext.clearRect(0,0,canvas.width,canvas.height);
		clearInterval(draw);
	}
	function eraserOverlay(e){
			overLayContext.clearRect(0,0,canvas.width,canvas.height);
			eraser.setSize();
			if((mouse.x<canvas.width && mouse.x>=0) && (mouse.y<canvas.height && mouse.y>=0)){
				overLayContext.lineWidth = 1;
				overLayContext.strokeRect(mouse.x-eraser.eraserSize/2, mouse.y-eraser.eraserSize/2, eraser.eraserSize, eraser.eraserSize);
			}
	}
	function eraserMousedown(e){
		draw = setInterval(function(){eraser.erase()}, 10);
	}
	function eraserMouseup(e){
		clearInterval(draw);
	}
	//function that removes event listeners
	var remEventListeners = function(){
		canvas.removeEventListener('mousedown', penMousedown);
		window.removeEventListener('mouseup', penMouseup);
		canvas.removeEventListener('mousedown', paintMousedown);
		window.removeEventListener('mouseup', paintMouseup);
		canvas.removeEventListener('mousedown', rectMousedown);
		window.removeEventListener('mouseup', rectMouseup);
		canvas.removeEventListener('mousedown', circleMousedown);
		window.removeEventListener('mouseup', circleMouseup);
		canvas.removeEventListener('mousemove', eraserOverlay);
		canvas.removeEventListener('mousedown', eraserMousedown);
		window.removeEventListener('mouseup', eraserMouseup);
	}
	var remFeatureForms = function(){
		document.getElementById('penFeatures').style.display='none';
		document.getElementById('paintbrushFeatures').style.display='none';
		document.getElementById('rectangleFeatures').style.display='none';
		document.getElementById('circleFeatures').style.display='none';
		document.getElementById('eraserFeatures').style.display='none';
	}
	//Tool constructors
	function Pen(){
		this.penColor = 'black';
		this.penSize = '2';
		this.lineJoin = 'round';
		this.strokeStyle = 'round';
		this.penDraw = function(){
			context.lineTo(mouse.x,mouse.y);
			context.stroke();
		};
		this.setParam = function(){
			newColor = document.getElementById('penColorInput').value;
			newSize = document.getElementById('penSizeInput').value;
			this.penColor = newColor;
			this.penSize = newSize;
		};
	}
	function Paintbrush(){
		this.brushColor = 'black';
		this.brushSize = '5';
		this.paintbrushDraw = function(){
			bufferContext.clearRect(0,0,canvas.width,canvas.height);
			bufferContext.beginPath();
			bufferContext.arc(mouse.x, mouse.y, this.brushSize, 0, 2*Math.PI, false);
			bufferContext.fill();
			context.drawImage(bufferCanvas, 0, 0);
		};
		this.setParam = function(){
			newColor = document.getElementById('paintbrushColorInput').value;
			newSize = document.getElementById('paintbrushSizeInput').value;
			if(newColor != '')
				this.brushColor = newColor;
			if(newSize != '')
				this.brushSize = newSize;
		};
	}
	function Rectangle(){
		this.x = 0;
		this.y = 0;
		this.strokeColor = '';
		this.strokeWidth = '';
		this.color = '';
		
		this.rectDraw = function(){
			overLayContext.clearRect(0,0,canvas.width,canvas.height);
			bufferContext.clearRect(0,0,canvas.width,canvas.height);
			if(this.color != '')
				bufferContext.fillRect(this.x,this.y,mouse.x-this.x,mouse.y-this.y);
			if(this.strokeColor != ''){
				bufferContext.strokeRect(this.x,this.y,mouse.x-this.x,mouse.y-this.y);
			}
			overLayContext.drawImage(bufferCanvas,0,0);
		};
		this.setParam = function(){
			newColor = document.getElementById('rectangleColorInput').value;
			newStroke = document.getElementById('rectangleStrokeInput').value;
			newWidth = document.getElementById('rectangleSizeInput').value;
			if(newColor != '')
				this.color = newColor;
			else
				this.color = '';
			if(newStroke != '')
				this.strokeColor = newStroke;
			else
				this.strokeColor = '';
			if(newWidth != '')
				this.strokeWidth = newWidth;
		};
	}
	function Circle(){
		this.x = 0;
		this.y = 0;
		this.color = 'black';
		this.circleDraw = function(){
			overLayContext.clearRect(0,0,canvas.width,canvas.height);
			bufferContext.clearRect(0,0,canvas.width,canvas.height);
			bufferContext.beginPath();
			bufferContext.arc(this.x, this.y, Math.sqrt(Math.pow((mouse.x-this.x),2)+Math.pow((mouse.y-this.y),2)), 0, 2*Math.PI, false);
			if(this.color != '')
				bufferContext.fill();
			if(this.strokeColor != '')
				bufferContext.stroke();
			overLayContext.drawImage(bufferCanvas,0,0);
		};
		this.setParam = function(){
			newColor = document.getElementById('circleColorInput').value;
			newStroke = document.getElementById('circleStrokeInput').value;
			newWidth = document.getElementById('circleSizeInput').value;
			if(newColor != '')
				this.color = newColor;
			else
				this.color ='';
			if(newStroke != '')
				this.strokeColor = newStroke;
			else
				this.strokeColor = '';
			if(newWidth != '')
				this.strokeWidth = newWidth;
		};
	}
	function Eraser(){
		this.eraserSize = 10;
		this.erase = function(){
			context.clearRect(mouse.x-this.eraserSize/2, mouse.y-this.eraserSize/2, this.eraserSize, this.eraserSize);
		};
		this.setSize = function(){
			newSize = document.getElementById('eraserSizeInput').value;
			if(newSize != '')
				this.eraserSize = newSize;
		};
	}
})
//Function that clears the canvas
var clearCanvasButton = function(){
	var canvas = document.getElementById("paintCanvas"),
		context = canvas.getContext('2d');
		bufferCanvas = document.createElement('canvas'),
		bufferContext = bufferCanvas.getContext('2d'),
	context.clearRect(0,0,canvas.width,canvas.height);
	bufferContext.clearRect(0,0,canvas.width,canvas.height);
}
var saveCanvas = function(){
	var canvas = document.getElementById('paintCanvas'),
		context = canvas.getContext('2d'),
		dataURL = canvas.toDataURL();
	document.getElementById('canvasImage').src = dataURL;
}