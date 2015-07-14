var PanelController = (function(){
  var $panels,
      $panelGlyphicons;

  var _togglePanel = function () {
    var collapser = $(this);
    collapser.closest(".js-panel").find(".panel-body").collapse('toggle');
    if(collapser.hasClass("glyphicon-chevron-up")) {
      collapser.addClass("glyphicon-chevron-down");
      collapser.removeClass("glyphicon-chevron-up");
    } else {
      collapser.addClass("glyphicon-chevron-up");
      collapser.removeClass("glyphicon-chevron-down");
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