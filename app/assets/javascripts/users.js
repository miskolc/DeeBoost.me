//= require jquery
//= require jquery_ujs
//= require turbolinks
// Require vendor javascripts
//= require index.js
//= require_tree ./application/addons
//= require_tree ./users_pages

$(document).on('page:change first:location', function () {
  ( function(){
    var $currentPage = $(".js-page"),
        $form = $("#new_location"),
        $body = $("body"),
        $submit = $form.find(".js-submit"),
        $elevationAngleKnob = $(".js-knob-elevation-angle"),
        $sunbathingTimeKnob = $(".js-knob-sunbathing-time"),
        $sunbathingStartKnob = $(".js-knob-sunbathing-start"),
        $sunbathingEndKnob = $(".js-knob-sunbathing-end"),
        $currentTimeKnob = $(".js-knob-current-time"),
        $nearestTimeKnob = $(".js-knob-nearest-time"),
        $editLocationForms = $(".edit_location");

    if($currentPage.hasClass("users") && $currentPage.hasClass("show")) {
      if($currentPage.find(".no-location").length === 1) {
        console.log("Loading");
        $body.addClass("loading");
        console.log("Loading1");
        DateTimeGetter.init($form);
        LocationGetter.init($form);
      } else {
        //DateTimeGetter.init($form);
        // KnobDrawer.init($elevationAngleKnob);
        // KnobDrawer.init($sunbathingTimeKnob);
        // KnobUpdater.init($sunbathingTimeKnob,-1);
        // KnobDrawer.init($sunbathingStartKnob);
        // KnobDrawer.init($sunbathingEndKnob);
        // KnobDrawer.init($currentTimeKnob);
        // KnobUpdater.init($currentTimeKnob,1);
        PanelController.init();
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
    }

    if($currentPage.hasClass("locations") && $currentPage.hasClass("index")) {
      $editLocationForms.find(".js-submit").on('click', function lambda(e) {
        e.preventDefault();
        DateTimeGetter.init($(this).closest(".edit_location"));
        $(this).unbind('click').click();
      });
    }
  })();
});