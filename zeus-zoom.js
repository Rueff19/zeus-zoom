/*

 ZEUS ZOOM


 Version: 2.1
 Details:   Related to V1.0, @ 18/10/2017:
                * we now can instantiate the library as many times as we want => new zoom lenses will be created, for each instantiation
                * a new Method was created for the API - "kill" - so we can rollback each instantiation:
                    * kill: '2,4' - a list passed to the method will rollback each;
                    * kill: 'All' - the string "All" will rollback ALL event bindings and remove ALL added objects to DOM

            Related to V2.0, @ 19/10/2017:
                * we now can customize the zoom lenses icon - it became, on the API, a possible settings parameter: 'zoomIcon'

  Author: João Rueff

*/

/*=========================================*/
/*               ZOOM function             */
/*=========================================*/
var i = 0;
(function ( $ ) {
    $.fn.zeusZoom = function (options) {
        //counter to make shure the togglers are different
        i++;

        const
            $img = this
        ;

        /*=========================================*/
        /*        SETTINGS AND FUNCTIONS           */
        /*=========================================*/
        var
            settings = $.extend({
                // These are the defaults.
                scale: '6',
                switchTrigger: '.product-img-thumb',
                holderClass: 'zoom',
                zoomIcon: '<i aria-hidden="true" class="fa fa-search"></i>',
                zoomEvt: 'click',
                zoomBtnClass: 'btn btn-primary'
            }, options )
        ;

        if (!settings.kill) {
            /*=========================================*/
            /*              APPLY TOGGLER              */
            /*=========================================*/
            $img.parent().append('<button title="zoom" class="'+settings.zoomBtnClass+' zoom-toogler zoom-toggler-'+i+'">' +settings.zoomIcon+ '</button>');

            /*=========================================*/
            /*         CREATE ZOOM CONTAINER           */
            /*=========================================*/
            $img.append('<div class="'+settings.holderClass+'-container"><div class="'+settings.holderClass+'"></div></div>');
            $('.'+settings.holderClass).html($img.html());

            zoom_switch(settings.switchTrigger,settings.holderClass);

            /*=========================================*/
            /*                BINDINGS                 */
            /*=========================================*/
            /*
            * mousedown === touchstart
            * mousemove === touchmove
            * mouseup === touchend
            */
            $img
                .on('mouseover touchstart', zoom_start)
                .on('mouseout', zoom_stop)
                .on('mousemove touchmove', zoom_move)
                .on('click touchend', zoom_end)
            ;

            /*==TOGGLER==*/
            $('.zoom-toggler-'+i).on(settings.zoomEvt, zoom_toggle );

        } else {
            /*=========================================*/
            /*                   kill                  */
            /*=========================================*/

            if(settings.kill=='All') {

                for(var t=1;t<=i;t++) {
                    $('.zoom-toggler-'+t).off(settings.zoomEvt,zoom_toggle );
                }
                $('button[title=zoom]')
                    .prev($img)
                        .off('mouseover touchstart', zoom_start)
                        .off('mouseout', zoom_stop)
                        .off('mousemove touchmove', zoom_move)
                        .off('click touchend', zoom_end)
                        .children('.'+settings.holderClass+'-container')
                            .remove()
                            .end()
                        .end()
                    .remove()
                ;

            } else {

                for(var k=1;k<=i;k++) {

                    if(settings.kill.indexOf(k) !== -1) {
                        $('.zoom-toggler-'+k).off(settings.zoomEvt,zoom_toggle );

                        $('.zoom-toggler-'+k)
                            .prev($img)
                                .off('mouseover touchstart', zoom_start)
                                .off('mouseout', zoom_stop)
                                .off('mousemove touchmove', zoom_move)
                                .off('click touchend', zoom_end)
                                .children('.'+settings.holderClass+'-container')
                                    .remove()
                                    .end()
                                .end()
                            .remove()
                        ;
                    }

                }

            }

        }

        /*=========================================*/
        /*               AUX FUNTIONS              */
        /*=========================================*/
        function zoom_toggle() {
            if($img.hasClass('zoom-on')) {

                $img.removeClass('zoom-on');

            } else {

                $img
                    .addClass('zoom-on')
                    .children('.'+settings.holderClass+'-container')
                        .children('.'+settings.holderClass)
                            .css({
                                'transform': 'scale('+ settings.scale +')',
                                'transform-origin': '0 100% 0'
                            })
                            .end()
                        .css({
                            'opacity': '1',
                            'transform': 'translate(-50%,-50%) scale(0.5)',
                            'top': '100%',
                            'left': '0'
                        })
                ;

            }
        }
        function zoom_start(e) {
            if($(this).hasClass('zoom-on')) {

                $(this)
                    .children('.'+settings.holderClass+'-container')
                        .css({
                            'opacity': '1',
                            'transform': 'translate(-50%,-50%) scale(0.5)'
                        })
                        .children('.'+settings.holderClass)
                            .css({
                                'transform': 'scale('+ settings.scale +')'
                            })
                ;

            }
        }
        function zoom_stop() {
            $(this)
                .children('.'+settings.holderClass+'-container')
                    .children('.'+settings.holderClass)
                        .css({
                            'transform': 'scale(1)'
                        })
                        .end()
                    .css({
                        'opacity': '0',
                        'transform': 'none',
                        'top': '0',
                        'left': '0'
                    })
            ;
        }
        function zoom_move(e) {
            /* e. prevent mobile scroll on touch */
            e.preventDefault();

            if($(this).hasClass('zoom-on')) {
                /* currentY = touch zone VS pageY */
                var
                    currentY = e.originalEvent.touches ?  e.originalEvent.touches[0].pageY : e.pageY,
                    currentX = e.originalEvent.touches ?  e.originalEvent.touches[0].pageX : e.pageX
                ;

                $(this)
                    .children('.'+settings.holderClass+'-container')
                        .children('.'+settings.holderClass)
                            .css({
                                'transform-origin': ((currentX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((currentY - $(this).offset().top) / $(this).height()) * 100 +'%'
                            })
                            .end()
                        .css({
                            'top': ((currentY - $(this).offset().top) / $(this).height()) * 100 +'%',
                            'left': ((currentX - $(this).offset().left) / $(this).width()) * 100 + '%'
                        })
                ;
            }
        }
        function zoom_end() {
            $(this)
                .children('.'+settings.holderClass+'-container')
                    .children('.'+settings.holderClass)
                        .css({
                            'transform': 'scale(1)'
                        })
                        .end()
                    .css({
                        'opacity': '0',
                        'transform': 'none',
                        'top': '0',
                        'left': '0'
                    })
                    .end()
                .removeClass('zoom-on')
            ;
        }

    };

}( jQuery ));

/*=========================================*/
/*               SWITCH IMG's              */
/*=========================================*/
function zoom_switch(trigger,holderClass) {
    $(trigger).on('click', function(e) {
        /* switch the img's */
        $('.'+holderClass)
            .children('img')
                .attr('src',$(this).children('img').attr('src'))
                .end()
            /* switch the layers */
            .children('.container-txt-overlay')
                .html($(this).children('.container-txt-overlay').html())
        ;
    });
}
