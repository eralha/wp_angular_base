define(['lib/hammer'], function (Hammer) {


    /*
     * 
     * This require a specific css style aplyed to the folowing structure
     *
     *
    <section class="main__content" data-component="module/content__slider" data-enabledrag="true" data-hashtag="localizacao">
        <!-- THIS WILL SLIDE ALL THE CONTENTS -->
        <div class="main__content-slider">

          <div class="content__container" style="background-image: url('http://lorempixel.com/1024/765/');">
            <!-- PUT CONTENT IN HERE -->
          </div>

        </div>
      </section>
    */

    /*
     * Specific CSS to apply
     *
        
        .main__content-slider {
          position: relative;
          min-width: 100%; // This can be whatever you want
          min-height: 100%; // This can be whatever you want
          &.anim { .transition(0.3s); } // This need to be here for slide css based animation
        }
        .content__container { //This should fill the slider viewport in order to slide from one content to another
          position: absolute;
          width: 100%;
          height: 100%;
        }

     */

    
    function module(elem){
        var sup = this;
        this.elem = elem;
        this.slider = $(elem).find('.main__content-slider');
        this.slides = $(elem).find('.content__container');
        this.slideNum = $(this.slides).length;
        this.currSlide = 0;
        this.dragLimit = $(this.slider).width() * 0.05;
        this.friction = 2.5;
        this.startOffset = $(this.slider).offset().left;
        this.hammer = new Hammer($(this.slider).get(0));
        this.slideDirection = ($(elem).attr('data-direction')) ? $(elem).attr('data-direction') : 'horizontal';

        $(this.slider).addClass('anim');


        if(this.slideNum == 1) { return; }

        this.positionSlides();
        //this.enableSwipe();
        if($(elem).attr('data-enabledrag') == 'true'){
            this.enableDarg();
        }
        /*
         * Assing clicks to button components in the container
         * Next and previous arrows
         * Goto slide Links
         */
         $(elem).find('[data-showSlide]').click(function(){
            var slide = parseFloat($(this).attr('data-showSlide')) - 1;
            sup.setSlideNum(slide);
         });
    }

    module.prototype.updateElement = function(elementQuery, transform){
        var value = transform.join(" ");
        var el = $(elementQuery).get(0);
        el.style.webkitTransform = value;
        el.style.mozTransform = value;
        el.style.transform = value;
        ticking = false;
    }

    module.prototype.positionSlides = function(){
        var i = 0;
        var sup = this;

        $(this.slides).each(function(){
            if(sup.slideDirection == 'horizontal'){
                sup.updateElement(this, ['translate3d('+(i*100)+'%, 0, 0)']);
            }
            if(sup.slideDirection == 'vertical'){
                sup.updateElement(this, ['translate3d(0, '+(i*100)+'%, 0)']);
            }
            i ++;
        });
    }

    module.prototype.enableDarg = function(){
        var sup = this;

        var dirDiff = 0;
        var value;
        var lastDir;
          this.hammer.on('panright panleft', function(ev) {
            value = 0;
            var ww = $(window).width();

            value =  sup.startOffset + (ev.deltaX / sup.friction);
            lastDir = (ev.type != 'panend') ? ev.type : '';

            sup.updateElement(sup.slider, ['translate3d('+(value)+'px, 0, 0)']);
          });
          this.hammer.on('panstart', function(ev) {
            //sup.startOffset = $(sup.slider).offset().left;
            $(sup.slider).removeClass('anim');
          });
          this.hammer.on('panend', function(ev) {
            if(Math.abs(ev.deltaX) > sup.dragLimit && lastDir == 'panleft'){
                sup.nextSlide();
                return;
            }
            if(Math.abs(ev.deltaX) > sup.dragLimit && lastDir == 'panright'){
                sup.prevSlide();
                return;
            }
            sup.showSlide();
          });
    }

    module.prototype.enableSwipe = function(){
        var sup = this;

        var dirDiff = 0;
          sup.hammer.on('swipeleft', function(ev) {
            sup.nextSlide();
          });
          sup.hammer.on('swiperight', function(ev) {
            sup.prevSlide();
          });
    }

    module.prototype.showSlide = function(){
        var sup = this;
        sup.currSlide = (arguments[0]) ? arguments[0] : sup.currSlide;
        $(sup.slider).addClass('anim');

        sup.changing = true;

        if(sup.slideDirection == 'horizontal'){
            sup.updateElement(sup.slider, ['translate3d(-'+(this.currSlide*100)+'%, 0, 0)']);
            //update start offset to set drag on right position
            sup.startOffset =  0 - ($(sup.elem).width() * sup.currSlide);
        }
        if(sup.slideDirection == 'vertical'){
            sup.updateElement(sup.slider, ['translate3d(0, -'+(this.currSlide*100)+'%, 0)']);
            //update start offset to set drag on right position
            sup.startOffset =  0 - ($(sup.elem).height() * sup.currSlide);
        }

        setTimeout(function(){
            sup.changing = false;
        }, 300);

        //console.log(sup.startOffset);
    }

    module.prototype.nextSlide = function(){
        this.currSlide ++;
        this.currSlide = (this.currSlide >= this.slideNum) ? this.slideNum - 1 : this.currSlide;
        this.showSlide();
    }

    module.prototype.prevSlide = function(){
        this.currSlide --;
        this.currSlide = (this.currSlide < 0) ? 0 : this.currSlide;
        this.showSlide();
    }

    module.prototype.setSlideNum = function(num){
        this.currSlide = num;
        this.currSlide = (this.currSlide < 0) ? 0 : this.currSlide;
        this.currSlide = (this.currSlide >= this.slideNum) ? this.slideNum - 1 : this.currSlide;
        this.showSlide();
    }

    return module;

});