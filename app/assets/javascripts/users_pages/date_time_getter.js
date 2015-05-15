var DateTimeGetter = (function(){

    var _setDateTime = function() {   
      var date, timezoneString, offsetInHours, 
          sign, timezoneNumber;

      date = new Date();
      $form.find("#date_time_year").val(date.getFullYear());
      $form.find("#date_time_day").val(date.getDate());
      $form.find("#date_time_month").val(date.getMonth() + 1);
      timezoneString = "";
      offsetInHours = date.getTimezoneOffset() * -1 / 60;
      sign = offsetInHours < 0 ? "-" : "+";
      timezoneNumber = 10000 + offsetInHours * 100;
      timezoneString = timezoneNumber.toString();
      timezoneString = sign + timezoneString.substr(1);
      $form.find("#date_time_timezone").val(timezoneString);
    }      

    var init = function (form) {
        $form = form;
        _setDateTime();
    }    
        
    return {
        init: init
    };    
}());
