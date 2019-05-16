$(document).ready(function() {
    initWow();
    scrollTo();
    matchHeight();
});

$(window).resize(function () {
    setTimeout(function () {
        matchHeight();
    }, 1200);
});

function initWow(){
    var wow = new WOW(
        {
          boxClass:     'wow',     
          animateClass: 'animated', 
          offset:       0,          // distance to the element when triggering the animation (default is 0)
          mobile:       true,       // trigger animations on mobile devices (default is true)
          live:         true,       // act on asynchronously loaded content (default is true)
          callback:     function(box) {
            // the callback is fired every time an animation is started
            // the argument that is passed in is the DOM node being animated
          },
          scrollContainer: null // optional scroll container selector, otherwise use window
        }
      );
      wow.init();
}

function scrollTo(){
    $("#scroll-arrow").on('click', function (event) {
        if (this.hash !== "") {
          event.preventDefault();
    
          var hash = this.hash;
    
          $('html, body').animate({
            scrollTop: $(hash).offset().top
          }, 100, function(){
       
           // window.location.hash = hash;
          });
        } 
      });
}

function matchHeight() {
    if ($(window).width() >= 320) {
        var elements = [
            [".section-2 .why-blocks ", "h4"],
            [".section-2 .why-blocks ", ".image-holder"]

        ];
        if (elements != 0) {
            $.each(elements, function (i, e) {
                var $list = $(e[0]),
                    $items = $list.find(e[1]);
                $items.matchHeight({
                    byRow: true
                });
            });
        }
    }
}