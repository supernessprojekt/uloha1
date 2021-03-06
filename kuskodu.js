(function(window,document,undefined) {
  'use strict';
  var App = function(options) {
    this.resize_toggle = true;
    this.paginationShowed = false;
    this.data = [];
    this.favorites = {};
    this.filteredData = [];
    this.actualPage = 1;
    this.actualItem = 0;
    this.actualLastItem = 12;
    this.numberOfPages = 0;

    this.settings = {
      itemsPerPage: options.itemsPerPage || 12,
      container: options.container || "videos",
      navigation: options.navigation || "pagin",
      categories: options.categories || "categories",
      url: options.url || "http://academy.tutoky.com/api/json.php"
    }

    this.navRoot = document.getElementById(this.settings.navigation);
  };

  // save data to App.data, init pagination and render articles
  App.prototype.init = function(data){
    var fav = new Favorites;
    this.favorites = fav.init();
    this.data = data;
    this.filteredData = data;   // used when data array is overwritten by filter function
    var renderer = new Renderer(this); 
    renderer.renderCategories(this);    
  };

  // filter articles by categories
  App.prototype.filter = function(event) {
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
      document.getElementById(this.settings.container).innerHTML = "";
      this.actualPage = 1;
      this.actualItem = 0;
      if (this.settings.itemsPerPage >= this.filteredData.length) {
        this.actualLastItem = this.filteredData.length;
      }
      else this.actualLastItem = this.settings.itemsPerPage;      
      new Renderer(this);        
    }
  };

  // resize fix - fixes issue when there are more articles loaded through "load more" button and then screen is resized
  App.prototype.resize = function()
  {
    var width = window.innerWidth;
    if (width < 460) {
      this.resize_toggle = true;
    }
    if (width > 460 && this.resize_toggle) {
      this.resize_toggle = false;
      document.getElementById(this.settings.container).innerHTML = "";
      new Renderer(this);
    }
  }

  // handles events called by event listeners - pagination
  App.prototype.eventHandler = function(event) {
    event.preventDefault();
    var page_target = event.target;
    var attr = page_target.getAttribute("data_page");
    
    if (attr === "next") {
      document.getElementById(this.settings.container).innerHTML = "";
      Pagination.nextPage(this);
    }
    else if (attr === "previous") {
      document.getElementById(this.settings.container).innerHTML = "";
      Pagination.previousPage(this);
    }
    else if (attr === "loadMore") {
      Pagination.nextPage(this);
    }
    else {
      if (attr) {
        var page = parseInt(attr);
        document.getElementById(this.settings.container).innerHTML = "";
        Pagination.changePage(page, this);
      }
    }
  }

  

  var myPagin = new App({});
  // load(myPagin.settings.url, myPagin.init.bind(myPagin));
  new Loader(myPagin.settings.url, myPagin.init.bind(myPagin));

   // pagination listeners
  document.getElementsByClassName("loadMore")[0].addEventListener("click", myPagin.eventHandler.bind(myPagin));
  document.getElementById("categories").addEventListener("click", myPagin.filter.bind(myPagin));
  
  window.onresize = myPagin.resize.bind(myPagin);
} (window, document))

