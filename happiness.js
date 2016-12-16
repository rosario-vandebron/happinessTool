// Set up!
var sad_canvas = document.getElementById("sad");
var happy_canvas = document.getElementById("happy");
makeHappiness(sad_canvas, false);
makeHappiness(happy_canvas, true);


function makeHappiness(canvas, isHappy){
	var context = canvas.getContext("2d");
	// Draw the face
	context.fillStyle = "yellow";
	context.beginPath();
	context.arc(95, 85, 40, 0, 2*Math.PI);
	context.closePath();
	context.fill();
	context.lineWidth = 2;
	context.stroke();
	context.fillStyle = "black";

	// Draw the left eye
	context.beginPath();
	context.arc(75, 75, 5, 0, 2*Math.PI);
	context.closePath();
	context.fill();

	// Draw the right eye
	context.beginPath();
	context.arc(114, 75, 5, 0, 2*Math.PI);
	context.closePath();
	context.fill();

	// Draw the mouth
	context.beginPath();
	if(!isHappy)
		context.arc(95, 110, 26, Math.PI, 2*Math.PI, false); //sad
	else
		context.arc(95, 90, 26, Math.PI, 2*Math.PI, true); // happy

	//Normal
	// context.moveTo(80, 95);
	// context.lineTo(110, 95);

	// context.closePath();
	// context.fill();
	context.stroke();

	// Write "Hello, World!"
	context.font = "30px Garamond";
	happynessStr = isHappy ? "Do u feel happy?"  : "Do u feel sad?"
	context.fillText(happynessStr,15,175);
}