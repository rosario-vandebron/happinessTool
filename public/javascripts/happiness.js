var sad_canvas = document.getElementById("sad");
var happy_canvas = document.getElementById("happy");
var ws = MyWebSocket();
ws.onopen = function() {
 calculateHappiness(document.getElementById("result"), 0.5);
};

makeHappiness(sad_canvas, false);
makeHappiness(happy_canvas, true);

function smile(ctx, level){
  var width = 54
  var x = 95 - width/2
  var hsmooth = 10
  var ysmooth = level*2*hsmooth - hsmooth
  var y = 95 - ysmooth
//  console.log(ysmooth)
//  console.log(y)

  var h = 20
  var xoff = 10
  var t = 3
  var yoff = level*2*h - h

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x + xoff, y + yoff, x + width - xoff, y + yoff, x + width, y);
  ctx.lineWidth = t
  ctx.stroke();
}

function calculateHappiness(canvas, happinessLevel){
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	drawBasicCanvas(context);	
    smile(context, happinessLevel)
}

function makeHappiness(canvas, isHappy){
	var context = canvas.getContext("2d");	
	drawBasicCanvas(context);
    isHappy ? smile(context, 1) : smile(context, 0)
	context.font = "30px Garamond";
	happynessStr = isHappy ? "Do u feel happy?"  : "Do u feel sad?"
	context.fillText(happynessStr,15,175);
}

//should be 1 (happy) or 0 (sad) for now
function sendHappiness(happinessLevel){
	ws.send(happinessLevel);
}

function MyWebSocket() {
	if ("WebSocket" in window)
	{		
		// Let us open a web socket
		var ws = new WebSocket("ws://localhost:9000/ws");

		ws.onmessage = function (evt) 
		{ 
			var received_msg = evt.data;
			console.log("Received Message:" + received_msg);
			var level = JSON.parse(received_msg).level;
			if (level >= 0) {
				calculateHappiness(document.getElementById("result"), level);
			}
		};

		ws.onclose = function() {
			console.log("Connection is closed...");
		};

		return ws;
	}
	else
	{
		alert("WebSocket NOT supported by your Browser!");
	}
}


function drawBasicCanvas(context){
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
}
