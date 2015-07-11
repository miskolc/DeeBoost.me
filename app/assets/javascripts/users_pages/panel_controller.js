var PanelController = (function(){
  var $panels,
      $panelGlyphicons;

  var _togglePanel = function () {
    var collapser = $(this);
    collapser.closest(".js-panel").find(".panel-body").collapse('toggle');
    if(collapser.hasClass("glyphicon-minus")) {
      collapser.addClass("glyphicon-eye-open");
      collapser.removeClass("glyphicon-minus");
    } else {
      collapser.addClass("glyphicon-minus");
      collapser.removeClass("glyphicon-eye-open");
    }
  }

  var _bindEvents = function () {
    $panelGlyphicons.on("click", _togglePanel);
  }

  var init = function () {
    $panels = $(".js-panel"),
    $panelGlyphicons = $(".js-panel .glyphicon");
    _bindEvents();
  };

  return {
    init: init
  };
}());