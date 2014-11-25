//load JSON from url
function load(url, callback) {

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = ensureReadiness;

  function ensureReadiness() {
    if(xhr.readyState < 4) {
      return;
    }
    if(xhr.status !== 200) {
      return;
    }
    // all is well 
    if(xhr.readyState === 4) {
      JSONObject = JSON.parse(xhr.responseText);
      callback(JSONObject);
    }          
  }
  xhr.open('GET', url, true);
  xhr.send('');
}

(function(window,document,undefined) {
  'use strict';
  var paginator  = window.paginator = {
    settings: {
      itemsPerPage: 12,           
      actualPage : 1, 
      actualItem: 0,
      actualLastItem: 12,
      numberOfPages: 0,
      container: "container"
    },

    // save data to this.data, init pagination and render articles
    init:function(data){
      this.data = data;
      this.settings.numberOfPages = Math.ceil(this.data.length / this.settings.itemsPerPage);
      this.renderArticles(paginator.data);
      this.paginate();
    },

    // hide/show previous/next button, render pagination
    paginate: function() {
      document.getElementById("pages").innerHTML = "";
      if (paginator.settings.actualPage === 1) {
        document.getElementById("previous").style.display = "none";
      }
      else {
        document.getElementById("previous").style.display = "inline";
      }
      if (paginator.settings.actualPage === paginator.settings.numberOfPages) {
        document.getElementById("next").style.display = "none";
      }
      else {
        document.getElementById("next").style.display = "inline";
      }
      for (var i = 1; i < this.settings.numberOfPages + 1; i++) {
        var a = document.createElement("a");   
        a.href= "#";
        a.textContent = i;
        a.data_id = i;
        document.getElementById('pages').appendChild(a);
      }
    },

    // render articles on current page from json object, call paginate function
    renderArticles : function() {
      var i;   
      var fragment = document.createDocumentFragment(); 
      for(i=this.settings.actualItem; i<this.settings.actualLastItem; i++) {
        var article = document.createElement("article");      
        article.id = i;
        var div = document.createElement("div");              
        div.className = "play-container";

        var div_hover = document.createElement("div");    
        div_hover.id = "hover";
        var p_hover = document.createElement("p");
        p_hover.textContent = this.data[i].title;  
        var p_categories = document.createElement("p");
        
        var categories = (this.data[i].categories).toString();
        categories = categories.replace(/,/g , ", ")
        p_categories.textContent = categories; 

        var img_play = document.createElement("img");         
        img_play.className = "play";
        img_play.src = "playbutton.png";

        var img_placeholder = document.createElement("img");  
        img_placeholder.className = "placeholder";
        img_placeholder.src = "placeholder.jpg";

        var h1 = document.createElement("h1");                         
        h1.textContent = this.data[i].title; 

        var time = document.createElement("time");   
        time.datetime = this.data[i].timestamp;
        time.textContent = paginator.show_time(this.data[i].timestamp);  

        article.appendChild(div); 
        article.appendChild(div_hover);
        div.appendChild(img_play);
        div.appendChild(img_placeholder);
        article.appendChild(h1);
        article.appendChild(time);
        div_hover.appendChild(p_hover);
        div_hover.appendChild(p_categories);

        fragment.appendChild(article);    // save article to document fragment
      }
      document.getElementById(this.settings.container).appendChild(fragment);   // load all articles from document fragment
      this.paginate();     
    },

    // parse date from json timestamp to readable output
    show_time: function(date) {
      date = parseInt(date);
      var d = new Date(date);
      return d.toDateString();
    },

    nextPage: function() {
      paginator.settings.actualPage++;
      document.getElementById("container").innerHTML = "";
      if ((paginator.settings.actualLastItem + paginator.settings.itemsPerPage) > paginator.data.length) {
        var lastPage = paginator.data.length - paginator.settings.actualLastItem;
        paginator.settings.actualLastItem += lastPage;
        console.log(paginator.settings.actualLastItem);
      }
      else {
        paginator.settings.actualLastItem += paginator.settings.itemsPerPage;
      }
      paginator.settings.actualItem += paginator.settings.itemsPerPage;
      console.log(paginator.settings.actualItem);
      paginator.renderArticles(paginator.data);
    },

    previousPage: function() {
      paginator.settings.actualPage--;
      document.getElementById("container").innerHTML = "";
      console.log(paginator.data.length);
      if (paginator.settings.actualLastItem === paginator.data.length) {
        var lastPage = paginator.settings.actualLastItem - paginator.settings.actualItem;
        paginator.settings.actualLastItem -= lastPage;
      }
      else {
        paginator.settings.actualLastItem -= paginator.settings.itemsPerPage; 
      }
      paginator.settings.actualItem -= paginator.settings.itemsPerPage;
      paginator.renderArticles(paginator.data);
    },

    concretePage: function() {
    }
  }
} (window, document))

load("http://academy.tutoky.com/api/json.php", paginator.init.bind(paginator));

// pagination listeners
document.getElementById("next").addEventListener("click", paginator.nextPage);
document.getElementById("previous").addEventListener("click", paginator.previousPage);

var links = document.getElementById("pages").getElementsByTagName("a");   // this works, it targets all "a" in "div"
console.log(links);
links.addEventListener("click", paginator.concretePage);    // how to set event listener on "a" in "div"?
