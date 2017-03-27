//TouchEmulator();
var myElement = document.getElementById('myElement'),
    elGesture = document.getElementById('elGesture'),
    elDeltaX = document.getElementById('elDeltaX'),
    elDeltaY = document.getElementById('elDeltaY');

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);
mc.get('pinch').set({ enable: true });
mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );

// listen to events...
mc.on("pan tap press pinch", function(ev) {
  /*
  elGesture.innerHTML = ev.type;
  elDeltaX.innerHTML = ev.deltaX;
  elDeltaY.innerHTML = ev.deltaY;
  console.log( Object.keys(ev) );
  */
  console.log(ev);
  var arrKeys = Object.keys(ev),
      $df = $( document.createDocumentFragment() ),
      $ul = $(document.createElement('ul')).addClass('touch-events');

  $df.append($ul);

  for (var i = 0; i < arrKeys.length; i++) {
    var $li = $(document.createElement('li')).html(
      arrKeys[i] + '<span>' + ev[arrKeys[i]] + '</span>'
    );
    $ul.append($li);
  };
  $(myElement).empty().append($df);
});
