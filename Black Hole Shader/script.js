var bgUrl = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1427&q=80'

var blackholeMass = 1500;
var curblackholeMass = 0;

var canvas, gl;
var shaderScript;
var shaderSource;
var vertexShader;
var fragmentShader;
var buffer;

var locationOfTime;
var locationOfResolution;
var locationOfMouse;
var locationOfMass;
var locationOfclickedTime;

var originY = window.innerHeight,
    originX = window.innerWidth;

var mouse;

var startTime = new Date().getTime();
var currentTime = 0;

var clicked = false,
    clickedTime = 0;

$(document).mousedown(function(){
	clicked = true;
});
$(document).mouseup(function(){
	clicked = false;
});

function init(image) {
	canvas = document.getElementById('glscreen');
	gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	canvas.width  = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight;
	canvas.height = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight;

	mouse = {x: originX/2, y: -(originY/2) + canvas.height, moved: false};
	$(document).mousemove(function(e) {
		mouse.x = e.pageX;
		mouse.y = -e.pageY + canvas.height;
		mouse.moved = true;
	});

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(
		gl.ARRAY_BUFFER, 
		new Float32Array([
			-1.0, -1.0, 
			1.0, -1.0, 
			-1.0,  1.0, 
			-1.0,  1.0, 
			1.0, -1.0, 
			1.0,  1.0]), 
		gl.STATIC_DRAW
	);

	shaderScript = document.getElementById("2d-vertex-shader");
	shaderSource = shaderScript.text;
	vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, shaderSource);
	gl.compileShader(vertexShader);

	shaderScript   = document.getElementById("2d-fragment-shader");
	shaderSource   = shaderScript.text;
	fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, shaderSource);
	gl.compileShader(fragmentShader);

	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	locationOfResolution = gl.getUniformLocation(program, "u_resolution");
	locationOfMouse = gl.getUniformLocation(program, "u_mouse");
	locationOfMass = gl.getUniformLocation(program, "u_mass");
	locationOfTime = gl.getUniformLocation(program, "u_time");
	locationOfclickedTime = gl.getUniformLocation(program, "u_clickedTime");

	gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
	gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
	gl.uniform1f(locationOfMass, curblackholeMass*0.00001);
	gl.uniform1f(locationOfTime, currentTime);
	gl.uniform1f(locationOfclickedTime, clickedTime);


	var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

	// provide texture coordinates for the rectangle.
	var texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 		new Float32Array([
		-1.0, -1.0, 
		1.0, -1.0, 
		-1.0,  1.0, 
		-1.0,  1.0, 
		1.0, -1.0, 
		1.0,  1.0]), 
			    gl.STATIC_DRAW);
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	// Create a texture.
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the parameters so we can render any size image.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	// Upload the image into the texture.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	render();
}

function render() {
	var now = new Date().getTime();
	currentTime = (now - startTime) / 1000; // update the current time for animations

	if(curblackholeMass < blackholeMass - 50){
		curblackholeMass += (blackholeMass-curblackholeMass) * 0.03;
	}

	if(clicked){
		clickedTime += 0.03;
	} else if(clickedTime > 0 && clicked == false) {
		clickedTime += -(clickedTime*0.015);
	}

	if(mouse.moved == false){
		mouse.y = (-(originY/2) + Math.sin(currentTime * 0.7) * ((originY * 0.25))) + canvas.height;
		mouse.x = (originX/2) + Math.sin(currentTime * 0.6) * -(originX * 0.35);
	}

	gl.uniform1f(locationOfMass, curblackholeMass*0.00001);
	gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
	gl.uniform1f(locationOfTime, currentTime); // update the time uniform in our shader
	gl.uniform1f(locationOfclickedTime, clickedTime);

	window.requestAnimationFrame(render, canvas); // request the next frame

	positionLocation = gl.getAttribLocation(program, "a_position"); // do stuff for those vertex's
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

window.addEventListener('load', function(event){
	var image = new Image();
  	image.crossOrigin = "Anonymous";
	image.src = bgUrl;
	image.onload = function() {
		init(image);
	}

});

window.addEventListener('resize', function(event){
	// just re-doing some stuff in the init here, to enable resizing.

	canvas.width  = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight;
	canvas.height = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
	locationOfResolution = gl.getUniformLocation(program, "u_resolution");
});