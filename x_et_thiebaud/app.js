var MySouncCloudModule = function(trackId, paragraph, userId, $appendTo, days, secret_token) {

  var widget = SC.Widget(document.getElementById('sc-widget'));

  var lignes = [];
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
  
  var trackURL    = "https://api.soundcloud.com/tracks/"+trackId+"?client_id=506d2e8c1cd057aa783906b0b1c8fe0d";
  var commentsURL = "https://api.soundcloud.com/tracks/"+trackId+"/comments/?client_id=506d2e8c1cd057aa783906b0b1c8fe0d";
  if (typeof secret_token !== "undefined" && secret_token) {
      trackURL = trackURL + "&secret_token="+secret_token;
      commentsURL = commentsURL + "&secret_token="+secret_token;
  }  

  // get track info
  $.getJSON(trackURL, function( data ) {
    $('meta[name=title]').prop("content", data.title);
    $('meta[name=description]').prop("content", data.description);

    var desc  = '<p>' + data.description.replace(/\n([ \t]*\n)+/g, '</p><p>').replace('\n', '<br />') + '</p>';
    
    $('head>title').text(data.title);
    $('#title').text(data.title);
    $('#description').html(desc);
    $('#description').linkify();
  });
  
  // does trackID already exists in tebaldi ?
  var tebaldiURL =  "https://tebaldi051108trial.hanatrial.ondemand.com/paroles/"+trackId;
  $.getJSON(tebaldiURL, function( data ) {
      $('div#url > a').prop('href', tebaldiURL).text(tebaldiURL);
  });

  // get comments
  $.getJSON( commentsURL, function( data ) {

    $.each( data, function( key, val ) {

      if (val.user.id != userId) { return; } // christophe thiebaud : 17366398, philippe benoist : 154105433, JuLieN : 46056414

      var created_at = moment(val.created_at);
      if (days_ok.length == 0) {
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
      items.push( "<li id='"+item.id+"' data-when="+item.when+">" + item.what + "</li>" );
      
      if (typeof paragraph !== "undefined") {
        var intParagraph = parseInt(paragraph, 10);
        if (paragraph == intParagraph) {
          if (intParagraph > 0) {
            if ((index % intParagraph) == intParagraph-1) {
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
    
    $('ul.my-new-list > li').click(function() {
      var $_this_ = $(this);
      var milliseconds = $_this_.data('when');
      if (typeof milliseconds !== "undefined") {
        $('div#feedback').html(milliseconds);
        widget.seekTo(milliseconds);
      }
    });
  });

  var stop = null;

  function durationformat(coucou) {
    return numeral(Math.floor(coucou/1000)).format('00:00:00');
  }

  var getPosition = function getPosition(callback) {
    widget.getPosition(callback);
  };

  widget.bind(SC.Widget.Events.READY, function() {

    $('div#feedback').html('ready');

    widget.bind(SC.Widget.Events.PLAY, function() {
      widget.getPosition(function(currentPosition){
        $('li').removeClass('emphased');
        $('div#feedback').html('played @ '+ durationformat(currentPosition));
      });
    });   

    widget.bind(SC.Widget.Events.PAUSE, function() {
      widget.getPosition(function(currentPosition){
        $('li').removeClass('emphased');
        $('div#feedback').html('paused @ '+ durationformat(currentPosition));
      });
    });      

    widget.bind(SC.Widget.Events.FINISH, function() {
      widget.getPosition(function(currentPosition){
        $('li').removeClass('emphased');
        $('div#feedback').html('finished @ ' + durationformat(currentPosition));
      });
    });   

    widget.bind(SC.Widget.Events.SEEK, function() {
      widget.getPosition(function(currentPosition){
        $('li').removeClass('emphased');
        $('div#feedback').html('seeked @ ' + durationformat(currentPosition));
      });
    });   

    widget.bind(SC.Widget.Events.PLAY_PROGRESS, function() {
      widget.getPosition(function(currentPosition){
        var ligne = getLigne(currentPosition);
        if (ligne != null) {
          $('li').not('li#'+ligne.id).removeClass('emphased');
          $('li#'+ligne.id).addClass('emphased').textillate({ in: { effect: 'tada' } });
        }
        $('div#feedback').html(durationformat(currentPosition));
      });
    });

  });
  
  return {'getPosition' : getPosition };

};
