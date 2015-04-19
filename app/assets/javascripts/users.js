//= require jquery
//= require jquery_ujs
//= require turbolinks
// Require vendor javascripts
//= require index.js
//= require_tree ./application/core
//= require_tree ./application/addons
//= require_tree ./users_pages

$(document).on('ready page:change', function () {
  (function(){
    var $noLocation = $(".no-location")
        $form = $("#new_location");

    if($noLocation.length === 1) {
      console.log("No Location");
      console.log($form);
      LocationGetter.init($form);
    } else {
      console.log("Has Location");
      $form.find(".js-submit").on('click', function() {
        //$(this).attr("disabled", true);
        LocationGetter.init($form);
      });
    }
  })();
});