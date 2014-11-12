var videos = {};

videos.loadJSON = function()
{
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var JSONObject = JSON.parse(xmlhttp.responseText);
			videos.write(JSONObject);
		}
	}
	xmlhttp.open("GET","http://academy.tutoky.com/api/json.php",true);
	xmlhttp.send();
}

videos.time = function(date) {
	var d = new Date(date);
	var weekday = new Array(7);
	weekday[0]=  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

	var day = weekday[d.getDay()]; 
	var dayDate = d.getDate();
	var month = d.getMonth()+1;
	var year = d.getFullYear();
	return day + ", " + dayDate + ". " + month +  ". " + year;
}

videos.write = function(JSONObject)
{


	var item = "";
	var i;
	var body = "";

	for(i=0; i<12; i++)
	{
		item += '<article>';
		item += '<div class="play-container">';
		item += '<p>'+JSONObject[i].title+'</p>';
		item += '<img src="play.png" class="play">';
		item += '<img src="placeholder.jpg" class="placeholder">';
		item += '</div>';
		item += '<h1>'+JSONObject[i].title+'</h1>';
		item += '<time datetime="'+JSONObject[i].timestamp+'">'+videos.time(JSONObject[i].timestamp*1)+'</time>';
		item += '</article>';
		body += item;
		item = "";
	}
	document.getElementById("container").innerHTML = body;
}
videos.loadJSON();