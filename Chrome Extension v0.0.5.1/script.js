window.setTimeout(setup, 6000); //ensures page is fully loaded before executing functions

window.onresize = function(event){

	console.log("RESIZE CAPTURED");
    var div1 = document.getElementById('div1');
	var div2 = document.getElementById('div2');
	var div3 = document.getElementById('div3');
	
	const rightsidebar = document.getElementById("rightsidebar");
	const txtcht = document.getElementById("textchat");
	const chatbox = document.getElementById("textchat-input");
	
	rightsidebar.style.display = "block";

	div1.style.height = "10%";
	div1.style.borderStyle = "none";
	div1.style.borderColor = "red";
	div1.style.marginTop = "3px";
	div1.style.top = "0px";
	div1.style.display = "block";
	
	div1.append(chatbox);
	chatbox.style.width = "95%";
	chatbox.style.zIndex = "auto";
	chatbox.style.position = "relative";
	chatbox.style.left = "5px";
	
	div2.style.height = "50%";
	div2.style.borderStyle = "none";
	div2.style.borderColor = "green";
	div2.style.top = "0px";
	div2.style.display = "block";
	
	div2.append(txtcht);
	txtcht.style.height = "100%";
	txtcht.style.top = "0px";
	
	div3.style.height = "35%";
	div3.style.borderStyle = "none";
	div3.style.borderColor = "blue";
	div3.style.top = "15px";
	div3.style.display = "block";
	
	var iframe = document.getElementById("dynamiciframe");
	iframe.style.height = "98%";
	iframe.style.width = "100%";
	div3.append(iframe);
	
}


function setup(){
	getElement();
	addwindow();
}

function addwindow(){
	
	const banneriframe= document.createElement('iframe');
	banneriframe.setAttribute("src", "https://charmscheck.com/6324-2/"); 
	banneriframe.scrolling="no";
	document.body.append(banneriframe);
	banneriframe.style.position="absolute";
	banneriframe.style.top="40px";
	banneriframe.style.left="65px";
	banneriframe.style.height="40px";
	banneriframe.style.width="80px";
	banneriframe.overflow="hidden";
	console.log(banneriframe);
	
	const charsheet = document.createElement('iframe');
	charsheet.setAttribute('id', 'charsheet');
	charsheet.setAttribute("src", "https://charmscheck.com/extension-homepage-2/"); 
	charsheet.style.height = "65%";
	charsheet.style.width = "65%";
	charsheet.style.position="absolute";
	charsheet.style.top="85px";
	charsheet.style.left="65px";
	charsheet.style.display="flex";
	document.body.append(charsheet);
	
}

function togglecharsheet(){
	let charsheet = document.getElementById("charsheet");
	if(charsheet.style.display=="none"){
		charsheet.style.display="flex";
	}else{
		charsheet.style.display="none";
	}
}

function callfunction(msg){
	switch(msg){
	case "resize":
		console.log("resize");
		resettextchatarea();
	break;
	case "test":
		console.log("test");
		postToChat("Charms Check Extension is ready!");
	break;
	case "reload":
	reload();
	break;
	case "toggle":
		togglecharsheet();
	break;
	default:
		postToChat(msg);
	break;
	}
	
}

const postToChat = (msg) => {

  const chatInputElement = document.querySelector('#textchat-input textarea'),
    chatButtonElement = document.querySelector('#textchat-input .btn');
	
  if (chatInputElement && chatButtonElement) {
    const activeText = chatInputElement.value;
    chatInputElement.value = msg;
    chatButtonElement.click();
    if (activeText) setTimeout(() => chatInputElement.value = activeText, 10);
  }
}

function getElement(){
	
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// Listen to message from child window
eventer(messageEvent,function(e) {
    var key = e.message ? "message" : "data";
    var data = e[key];
	
	if(data!="dispatchCoroutine"&&data!="[object Object]"&&data!="toggle"){
		callfunction(data);
	}
},false);

}