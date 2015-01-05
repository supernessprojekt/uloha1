var Categories = function(that) {
  this.that = that;
  document.getElementById(that.settings.categories).addEventListener("click", this.filter.bind(this));
}
// filter articles by categories
Categories.prototype.filter = function(event) {
  var cat_target = event.target;
  var attribute = cat_target.getAttribute("cat-id");
  if(attribute) {
    if (attribute === "all") {
      this.that.filteredData = this.that.data;
    }
    else if (attribute === "fav") {
      var output = [];
      var data_length = this.that.data.length;
      for (var i = 0; i < data_length; i++) {
        for (var j = 0; j < this.that.favorites.items.length; j++) {
          if (this.that.data[i].title === this.that.favorites.items[j]) {
            output.push(this.that.data[i]);
          }
        }
      }
      this.that.filteredData = output;
    }
    else {
      var output = [];
      var data_length = this.that.data.length;
      for (var i = 0; i < data_length; i++) {
        for (var j = 0; j < this.that.data[i].categories.length; j++) {
          if (this.that.data[i].categories[j] === attribute) {
            output.push(this.that.data[i]);
          }
        }
      }
      this.that.filteredData = output;
    }
    document.getElementById(this.that.settings.container).innerHTML = "";
    this.that.actualPage = 1;
    this.that.actualItem = 0;
    if (this.that.settings.itemsPerPage >= this.that.filteredData.length) {
      this.that.actualLastItem = this.that.filteredData.length;
    }
    else this.that.actualLastItem = this.that.settings.itemsPerPage;      
    new Renderer(this.that);
  }
};