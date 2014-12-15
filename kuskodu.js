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
  var Paginator = function(options) {
    this.resize_toggle = true;
    this.paginationShowed = false;
    this.data = [];
    this.favorites = {};
    this.filteredData = [];
    this.actualPage = 1;
    this.actualItem = 0;
    this.actualLastItem = 12;
    this.numberOfPages = 0;
    this.videos = "videos";

    this.settings = {
      itemsPerPage: options.itemsPerPage || 12,
      container: options.container || "container",
      url: options.url || "http://academy.tutoky.com/api/json.php"
    }
  }

  // save empty object to localStorage if it's null
  Paginator.prototype.initFavorites = function() {
    if (localStorage.getItem('favorites') === null) {
      localStorage['favorites'] = JSON.stringify({items: []});
    }
    return JSON.parse(localStorage['favorites'])
  };

  // save data to Paginator.data, init pagination and render articles
  Paginator.prototype.init = function(data){
    this.favorites = this.initFavorites();
    this.data = data;
    this.filteredData = data;   // used when data array is overwritten by filter function
    this.showHeader();
    this.renderLayout();
    this.renderArticles();    
  };

  // render layout for videos
  Paginator.prototype.renderLayout = function() {
    var div_video_c = document.createElement("div");
    div_video_c.className = "video-container";
    var div_videos = document.createElement("div");
    div_videos.className = "videos";
    div_video_c.appendChild(div_videos);
    document.getElementById(this.settings.container).appendChild(div_video_c);
  }

  // hide/show previous/next button, render pagination
  Paginator.prototype.paginate = function() {
    // document.getElementsByClassName("pagin")[0].innerHTML = "";
    if (this.paginationShowed === false) {
      var footer = document.createElement("footer");
      var nav = document.createElement("nav");
      nav.className = "pagin";
      nav.appendChild(footer);

      var show_dots = false;    // variable for checking if dots between pages were already shown
      var fragment = document.createDocumentFragment(); 
      this.settings.numberOfPages = Math.ceil(this.filteredData.length / this.settings.itemsPerPage);

      var a_previous = document.createElement("a");
      a_previous.className = "previous";
      a_previous.href = "#";
      a_previous.onclick = "previousPage()";
      a_previous.textContent = "< PREVIOUS";
      a_previous.setAttribute("data-page", "previous");
      fragment.appendChild(a_previous);

      var div = document.createElement("div");
      div.id = "pages";

      var fragment_pages = document.createDocumentFragment(); 
      // for loop for page numbers
      for (var i = 1; i < this.settings.numberOfPages + 1; i++) {
        // display page number if page is first, last, or if page is near actual page
        if (i === 1 || i === this.settings.numberOfPages || (i < this.actualPage + 2 && i > this.actualPage - 2)) {
          var a = document.createElement("a");   
          a.href = "#";
          a.textContent = i;
          a.setAttribute("data-page", i);
          if (this.actualPage === i) {
            a.className = "active-page";
          }
          div.appendChild(a);
          fragment_pages.appendChild(a);
          show_dots = true;
        }
        // if page is not displayed, show dots between page numbers
        else {
          if (show_dots) {
            var dots = document.createElement("span");
            dots.textContent = "...";
            fragment_pages.appendChild(dots);
            show_dots = false;
          }
        }
      }
      div.appendChild(fragment_pages);
      fragment.appendChild(div);

      var a_next = document.createElement("a");
      a_next.className = "next";
      a_next.href = "#";
      a_next.textContent = "NEXT >";
      a_next.setAttribute("data-page", "next");
      fragment.appendChild(a_next);

      nav.addEventListener("click", myPagin.eventHandler.bind(myPagin));
      nav.appendChild(fragment);
      document.getElementById(this.settings.container).appendChild(nav);
      this.paginationShowed = true;
    }
    if (this.actualPage === 1) {
      document.getElementsByClassName("previous")[0].style.visibility = "hidden";
    }
    else {
      document.getElementsByClassName("previous")[0].style.visibility = "initial";
    }
    if (this.actualPage === this.settings.numberOfPages) {
      document.getElementsByClassName("next")[0].style.visibility = "hidden";
    }
    else {
      document.getElementsByClassName("next")[0].style.visibility = "initial";
    }
  };

  // render articles on current page from json object, call paginate function
  Paginator.prototype.renderArticles = function() {
    var i;   
    var fragment = document.createDocumentFragment(); 
    
    for(i = this.actualItem; i < this.actualLastItem; i++) {
      var article = document.createElement("article");
      var div = document.createElement("div");
      div.className = "play-container";

      var div_hover = document.createElement("div");    
      div_hover.className = "overlay";
      var p_categories = document.createElement("p");
      
      var categories = (this.filteredData[i].categories).toString();
      categories = categories.replace(/,/g , ", ");
      if (categories === "") {
        categories = "no category";
      }
      p_categories.textContent = "Categories: " + categories; 

      var img_play = document.createElement("img");
      img_play.className = "play";
      img_play.src = "playbutton.png";

      var img_placeholder = document.createElement("img");
      img_placeholder.className = "placeholder";
      img_placeholder.src = "placeholder.jpg";

      var h2 = document.createElement("h2");                         
      h2.textContent = this.filteredData[i].title; 

      var time = document.createElement("time");   
      time.datetime = this.filteredData[i].timestamp;
      time.textContent = myPagin.showTime(this.filteredData[i].timestamp);

      article.appendChild(div); 
      article.appendChild(div_hover);
      div.appendChild(img_play);
      div.appendChild(img_placeholder);
      article.appendChild(h2);
      article.appendChild(time);
      
      var fav_span = document.createElement("span");
      var img_fav = document.createElement("img");

      var fav_length = this.favorites.items.length;
      var fav_set = false;
      for (var j = 0; j < fav_length; j++) {
        if (this.favorites.items[j] === this.filteredData[i].title) {         
          img_fav.src = "fav_set.png";
          fav_set = true;
        }
      }
      if (!fav_set) {
        img_fav.src = "fav_blank.png";
      };

      img_fav.className = "favorites";
      img_fav.setAttribute("data_name", this.filteredData[i].title);
      img_fav.addEventListener("click", this.changeFavorites.bind(this));

      fav_span.appendChild(img_fav);
      article.appendChild(fav_span);

      // div_hover.appendChild(p_fav);
      div_hover.appendChild(p_categories);

      fragment.appendChild(article);    // save article to document fragment
    }
    // div_videos.appendChild(fragment);
    document.getElementsByClassName(this.videos)[0].appendChild(fragment);   // load all articles from document fragment
    this.paginate();    
  };

  // parse date from json timestamp to readable output
  Paginator.prototype.showTime = function(date) {
    date = parseInt(date);
    var d = new Date(date);
    return d.toDateString();
  };

  // render categories names and header
  Paginator.prototype.showHeader = function() {
    var header = document.createElement("header");    
    var h1 = document.createElement("h1");
    h1.textContent = "LATEST VIDEOS";
    header.appendChild(h1);
    
    var ul = document.createElement("ul");
    ul.className = "categories";
    var li = document.createElement("li");
    var a_cat = document.createElement("a");
    a_cat.href = "#";
    a_cat.textContent = "Categories";


    var ul_rollout = document.createElement("ul");
    ul_rollout.id = "categories";

    li.appendChild(a_cat);
    li.appendChild(ul_rollout);
    ul.appendChild(li);
    header.appendChild(ul);

    document.getElementById(this.settings.container).appendChild(header);

    var output = [];
    var fDataLength = this.filteredData.length;
    for (var i = 0; i < fDataLength; i++) {
      for (var j = 0; j < this.filteredData[i].categories.length; j++) {
        output.push(this.filteredData[i].categories[j]);
      }
    }
    var unique = output.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    
    var fragment = document.createDocumentFragment(); 
    var unique_length = unique.length;
    for (i = 0; i < unique_length; i++) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#";
      a.setAttribute("cat-id", unique[i]);
      // a.id = unique[i];
      a.textContent = unique[i];
      li.appendChild(a);
      fragment.appendChild(li);
    }
    // document.getElementsByClassName("cat_rollout")[0].appendChild(fragment);
  };

  Paginator.prototype.nextPage = function() {
    this.changePage(this.actualPage + 1);
  };

  Paginator.prototype.previousPage = function() {
    this.changePage(this.actualPage - 1);
  };
 
  // changes current page to number set in attribute 'page'
  Paginator.prototype.changePage = function(page) {
    if (page > 0) {
      this.actualPage = page;
      this.actualItem = (page - 1) * this.settings.itemsPerPage;

      if (this.settings.numberOfPages === this.actualPage) {
        this.actualLastItem = this.filteredData.length;
      }
      else {
        this.actualLastItem = this.actualItem + this.settings.itemsPerPage;
      }
      this.renderArticles(this.filteredData);
    }
  };

  // load more button in mobile version
  Paginator.prototype.loadMore = function() {
    var calculated = this.actualPage + 1;
    this.changePage(calculated);
  };

  // filter articles by categories
  Paginator.prototype.filter = function(event) {
    var cat_target = event.target;
    var attribute = cat_target.getAttribute("cat-id");
    if(attribute) {
      if (attribute === "all") {
        this.filteredData = this.data;
      }
      else if (attribute === "fav") {
        var output = [];
        var data_length = this.data.length;
        for (var i = 0; i < data_length; i++) {
          for (var j = 0; j < this.favorites.items.length; j++) {
            if (this.data[i].title === this.favorites.items[j]) {
              output.push(this.data[i]);            
            }
          }
        }
        this.filteredData = output;
      }
      else {
        var output = [];
        var data_length = this.data.length;
        for (var i = 0; i < data_length; i++) {
          for (var j = 0; j < this.data[i].categories.length; j++) {
            if (this.data[i].categories[j] === attribute) {
              output.push(this.data[i]);
            }
          }
        }
        this.filteredData = output;
      }
      document.getElementsByClassName(this.videos)[0].innerHTML = "";
      this.actualPage = 1;
      this.actualItem = 0;
      if (this.settings.itemsPerPage >= this.filteredData.length) {
        this.actualLastItem = this.filteredData.length;
      }
      else this.actualLastItem = this.settings.itemsPerPage;      
      this.renderArticles(this.filteredData);        
    }
  };

  // resize fix - fixes issue when there are more articles loaded through "load more" button and then screen is resized
  Paginator.prototype.resize = function()
  {
    var width = window.innerWidth;
    if (width < 460) {
      this.resize_toggle = true;
    }
    if (width > 460 && this.resize_toggle) {
      this.resize_toggle = false;
      document.getElementsByClassName(this.videos)[0].innerHTML = "";
      this.renderArticles(this.data);
    }
  }

  // handles events called by event listeners - pagination
  Paginator.prototype.eventHandler = function(event) {
    var page_target = event.target;
    var attr = page_target.getAttribute("data-page");
    
    if (attr === "next") {
      document.getElementsByClassName(this.videos)[0].innerHTML = "";
      this.nextPage();
    }
    else if (attr === "previous") {
      document.getElementsByClassName(this.videos)[0].innerHTML = "";
      this.previousPage();
    }
    else if (attr === "loadMore") {
      this.nextPage();
    }
    else {
      if (attr) {
        var page = parseInt(attr);
        document.getElementsByClassName(this.videos)[0].innerHTML = "";
        this.changePage(page);
      }
    }
  }

  // set/remove item from localStorage and change "star" image
  Paginator.prototype.changeFavorites = function(event) {
    var fav_target = event.target;
    var attr = fav_target.getAttribute("data_name");
    var fav_set = false;
    var fav_length = this.favorites.items.length;
    for (var i = 0; i < fav_length; i++) {
      if (this.favorites.items[i] === attr) {
        fav_set = true;
        this.favorites.items.splice(i, 1);
      };
    }
    if (fav_set === true) {      
      fav_target.setAttribute("src", "fav_blank.png");
    }
    else {
      this.favorites.items.push(attr);
      fav_target.setAttribute("src", "fav_set.png");
    }
    localStorage['favorites'] = JSON.stringify(this.favorites);
  }

  var myPagin = new Paginator({});
  load(myPagin.settings.url, myPagin.init.bind(myPagin));

  // pagination listeners
  // document.getElementById("pagin").addEventListener("click", myPagin.eventHandler.bind(myPagin));
  // "load more" button in mobile version
  document.getElementsByClassName("loadMore")[0].addEventListener("click", myPagin.eventHandler.bind(myPagin));
  document.getElementsByClassName("cat_rollout")[0].addEventListener("click", myPagin.filter.bind(myPagin));
  
  window.onresize = myPagin.resize.bind(myPagin);
} (window, document))

