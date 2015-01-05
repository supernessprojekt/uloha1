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
    var cat = new Categories(this);   
  };

  // resize fix - fixes issue when there are more articles loaded through "load more" button and then screen is resized
  App.prototype.resize = function()  {
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
  new Loader(myPagin.settings.url, myPagin.init.bind(myPagin));

  window.onresize = myPagin.resize.bind(myPagin);
} (window, document))

