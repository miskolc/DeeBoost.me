var KnobDrawer = (function () {
  var $knobElement, formatFunction;

  var _degreeFormat = function (value) {
      return  parseInt(value)  + '°';
  };

  var _leadingZeros = function (value) {
    return ( value < 10 ? "0" + value : "" + value );
  };

  var _timeFormat = function (value) {
      var hours, minutes, seconds;
      hours = Math.floor(value/3600);
      minutes = Math.floor((value % 3600) / 60);
      seconds = value % 60;
      return _leadingZeros(hours) + ":" + _leadingZeros(minutes) + ":" + _leadingZeros(seconds);
  };

  var _chooseFormatFunction = function () {
    if($knobElement.hasClass("knob-sunbathing-time") || 
       $knobElement.hasClass("knob-current-time") ||
       $knobElement.hasClass("knob-sunbathing-start") ||
       $knobElement.hasClass("knob-sunbathing-end") ) {
      return _timeFormat;
    }
    return _degreeFormat;
  };

  var init = function (knobElement) {
     $knobElement = knobElement;
     formatFunction = _chooseFormatFunction();
     $knobElement.knob({
                    change : function (value) {
                        //console.log("change : " + value);
                    },
                    release : function (value) {
                        //console.log(this.$.attr('value'));
                        console.log("release : " + value);
                    },
                    cancel : function () {
                        console.log("cancel : ", this);
                    },
                    format : formatFunction,
                    draw : function () {
                        $knobElement.css("font-size","18px");
                        // "tron" case
                        if(this.$.data('skin') == 'tron') {

                            this.cursorExt = 0.3;

                            var a = this.arc(this.cv)  // Arc
                                , pa                   // Previous arc
                                , r = 1;

                            this.g.lineWidth = this.lineWidth;

                            if (this.o.displayPrevious) {
                                pa = this.arc(this.v);
                                this.g.beginPath();
                                this.g.strokeStyle = this.pColor;
                                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                                this.g.stroke();
                            }

                            this.g.beginPath();
                            this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                            this.g.stroke();

                            this.g.lineWidth = 2;
                            this.g.beginPath();
                            this.g.strokeStyle = this.o.fgColor;
                            this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                            this.g.stroke();

                            return false;
                        }
                    }
                });
  };

  return {
    init: init
  };
}());