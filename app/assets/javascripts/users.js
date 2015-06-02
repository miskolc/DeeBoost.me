//= require jquery
//= require jquery_ujs
//= require turbolinks
// Require vendor javascripts
//= require index.js
//= require_tree ./application/addons
//= require_tree ./users_pages

$(document).on('page:change first:location', function () {
  ( function(){
    var $noLocation = $(".no-location")
        $form = $("#new_location"),
        $body = $("body"),
        $submit = $form.find(".js-submit");
    
    if($noLocation.length === 1) {
      console.log("Loading");
      $body.addClass("loading");
      console.log("Loading1");
      DateTimeGetter.init($form);
      LocationGetter.init($form);
    } else {
      //DateTimeGetter.init($form);
      ChartDrawer.init();
      console.log("Root1111");
      //$form.find(".js-submit").on('click', function lambda(e) {
      $submit.on('click', function lambda(e) {
         e.preventDefault();
         $form.find(".js-submit").unbind('click');
         console.log("Root");
         console.log($form);
         $body.addClass("loading");
         DateTimeGetter.init($form);

         LocationGetter.init($form);
         //$form.find(".js-submit").on('click', lambda );
         //$submit.on('click', lambda );
      });
    }
  })();
});