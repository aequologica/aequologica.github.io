var MySouncCloudModule = function(trackId, paragraph, userId, $appendTo, days) {

  var lignes = [];
  var currentRow = null;
  
  var days_ok = [];
  if (typeof days !== "undefined") { 
	  days_ok = _.map(days, function(day) { return moment(day); }); 
  }
  
  function getLigne(position) {
    for (var i = lignes.length-1; i >= 0; --i) {
      if (position > lignes[i].when ) {
        return lignes[i];
      }
    }
    return null;
  }
  
  $.getJSON( "https://api.soundcloud.com/tracks/"+trackId+"/comments?client_id=506d2e8c1cd057aa783906b0b1c8fe0d", function( data ) {

    $.each( data, function( key, val ) {

      if (val.user.id != userId) { return; } // christophe thiebaud : 17366398, philippe benoist : 154105433, JuLieN : 46056414

      var created_at = moment(val.created_at);
      if (days_ok.length==0) {
          lignes.push({'id':val.id, 'when':val.timestamp, 'what': val.body});
      } else {
	      $.each(days_ok, function( index, value ) {
	        if (created_at.isSame(value, 'day') ) { 
	          lignes.push({'id':val.id, 'when':val.timestamp, 'what': val.body});
	          return false; 
	        } 
	        return true;
	      });
      }
    });

    if (lignes.length == 0) return;
    
    lignes.sort(function(a, b) {
        return +a.when - +b.when;
    });

    var items = [];
    $.each( lignes, function( index, item ) {
      items.push( "<li id='"+item.id+"'>" + item.what + "</li>" );
      if (typeof paragraph !== "undefined") {
        if (paragraph === parseInt(paragraph, 10)) {
          if (paragraph > 0) {
            if ((index % paragraph) == paragraph-1) {
              items.push( "<li id='"+item.id+"'>&nbsp;</li>" );
            }
          }
        }
      }
    });
    
    $('ul.my-new-list').remove();
    $( "<ul/>", {
      "class": "my-new-list",
      html: items.join( "" )
    }).appendTo( $appendTo || $(".container#main") );
  });

  var widgetIframe = document.getElementById('sc-widget'),
      widget       = SC.Widget(widgetIframe);

  var stop = null;

  function durationformat(coucou) {
    //return coucou;
    return numeral(Math.floor(coucou/1000)).format('00:00:00');
  }

  var getPosition = function getPosition(callback) {
    widget.getPosition(callback);
  };

  widget.bind(SC.Widget.Events.READY, function() {

    $('#feedback').html('ready');

    widget.bind(SC.Widget.Events.PLAY, function() {
      widget.getPosition(function(currentPosition){
        $('li').removeClass('emphased');
      });
    });   

    widget.bind(SC.Widget.Events.PAUSE, function() {
      widget.getPosition(function(currentPosition){
        
        $('#feedback').html('paused @ '+ durationformat(currentPosition));
        $('li').removeClass('emphased');
        
      });
    });      

    widget.bind(SC.Widget.Events.FINISH, function() {
      widget.getPosition(function(currentPosition){
        $('li').removeClass('emphased');
      });
    });   

    widget.bind(SC.Widget.Events.SEEK, function() {
      widget.getPosition(function(currentPosition){
        $('li').removeClass('emphased');
      });
    });   

    widget.bind(SC.Widget.Events.PLAY_PROGRESS, function() {
      widget.getPosition(function(currentPosition){
        var ligne = getLigne(currentPosition);
        if (ligne != null) {
          $('li').not('li#'+ligne.id).removeClass('emphased');
          $('li#'+ligne.id).addClass('emphased').textillate({ in: { effect: 'tada' } });
        }
        $('#feedback').html(durationformat(currentPosition));
      });
    });

  });
  
  return {'getPosition' : getPosition };

};
