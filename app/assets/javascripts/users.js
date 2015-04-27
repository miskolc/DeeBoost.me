//= require jquery
//= require jquery_ujs
//= require turbolinks
// Require vendor javascripts
//= require index.js
//= require_tree ./application/addons
//= require_tree ./users_pages

$(document).on('page:change', function () {
  (function(){
    var $noLocation = $(".no-location")
        $form = $("#new_location");

    if($noLocation.length === 1) {
      LocationGetter.init($form);
    } else {
      $form.find(".js-submit").on('click', function(e) {
         e.preventDefault();
         $form.find(".js-submit").unbind('click');
         LocationGetter.init($form);
      });
    }
  })();
});