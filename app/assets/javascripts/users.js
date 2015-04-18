//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree ./application/core
//= require_tree ./application/addons
//= require_tree ./users_pages

$(document).on('ready page:change', function () {
  (function(){
    var $noLocation = $(".no-location");

    if($noLocation.length === 1) {
      console.log("No Location");
      LocationGetter.init();
    } else {
      console.log("Has Location");
    }
  })();
});