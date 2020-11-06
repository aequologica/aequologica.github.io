// test.js
$(document).ready(function(){

  console.log('js ok');
  var $btn    = $('#btn-parlez');
  var $result = $('#art_ref');

  if ('webkitSpeechRecognition' in window) {
    console.log('speech ok');

    var recognition = new webkitSpeechRecognition();

    $btn.click(function(e){
      e.preventDefault();

      $btn.prop("disabled",true);
      $btn.removeClass("btn-primary");
      console.log("before start");
      recognition.start();
      console.log("after start");
    })

    console.log(recognition);
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.InterimResults = false;

    var grammar = '#JSGF V1.0; grammar refs; public <ref> = A103 | 1037010 | NM542 | 0.0.373 ;'
    var speechRecognitionList = new webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    
    recognition.onresult = function(event) {
      console.log(event);

      for (var i=event.resultIndex; i<event.results.length; i++) {
        var trans = event.results[i][0].transcript;
        console.log(trans);
        $result.val (trans);
      }
      recognition.stop();
      $btn.addClass("btn-primary");
      $btn.prop("disabled",false);
      }

  }
  else {
    $btn.hide();
    console.log('speech PAS BON')
  }
})



