define(['module/modal__component', 'lib/hammer'], function (Modal, Hammer) {

    var galeriaTemplate = '';

        galeriaTemplate += '<div class="modal__galeria rtl">';
          galeriaTemplate += '<div class="modal__close sprite icon-close"></div>';
          galeriaTemplate += '<div class="sprite icon-bt-next btn btn--next">»</div>';
          galeriaTemplate += '<div class="sprite icon-bt-prev btn btn--prev">«</div>';
        galeriaTemplate += '</div>';
    
    function module(data){

        /*
         * data = { "src" : "Path para imagem", "desc" : "Descrição da imagem" }
         */

        this.galeria = null;
        this.itemLimit = data.length;
        this.imageData = data;
        this.itemSelector = '.modal__galeria-big';
        this.index = 0;
        this.onDestroy = null;

        sup = this;

        this.buildGallery();
    }

    module.prototype.nextItem = function(){
        $(this.galeria).find('.modal__galeria').removeClass('ltr');
        $(this.galeria).find('.modal__galeria').addClass('rtl');

        this.index ++;
        if(this.index > (this.itemLimit-1)){ this.index = 0; }

        this.selectItem();
    }
    module.prototype.prevItem = function(){
        $(this.galeria).find('.modal__galeria').removeClass('rtl');
        $(this.galeria).find('.modal__galeria').addClass('ltr');

        this.index --;
        if(this.index < 0){ this.index = this.itemLimit-1; }
        this.selectItem();
    }

    module.prototype.selectItem = function(){
        $(sup.galeria).find('.modal__galeria').removeClass('modal__galeria--animate');
        $(sup.galeria).find(sup.itemSelector).removeClass('page-show');
        $(sup.galeria).find(sup.itemSelector).removeClass('page-hide');

        sup = this;

        setTimeout(function(){
            $(sup.galeria).find('.page-visible').addClass('page-hide');
            $(sup.galeria).find(sup.itemSelector).removeClass('page-visible');

            var selected = $(sup.galeria).find(sup.itemSelector).get(sup.index);
            $(selected).addClass('page-show');
            
            $(sup.galeria).find('.modal__galeria').addClass('modal__galeria--animate');
            $(selected).addClass('page-visible');
        }, 10);
    }

    module.prototype.destroy = function(){
      this.hammer.swipe.destroy();
      this.hammer.next.destroy();
      this.hammer.prev.destroy();
      this.closeModal();
      if(typeof sup.onDestroy == "function"){ sup.onDestroy(); }
    }

    module.prototype.init = function(){
      sup = this;
      this.selectItem();
      this.hammer = {};

      //Seting gesture events
      this.hammer.swipe = new Hammer($(this.galeria).find('.modal__galeria').get(0));
          this.hammer.swipe.on('swipeleft', function(ev) {
              sup.nextItem();
              ev.preventDefault();
          });
          this.hammer.swipe.on('swiperight', function(ev) {
              sup.prevItem();
              ev.preventDefault();
          });

          this.hammer.next = new Hammer($(this.galeria).find('.btn--next').get(0))
              .on('tap', function(ev) {
                  sup.nextItem();
                  ev.preventDefault();
              });
          this.hammer.prev = new Hammer($(this.galeria).find('.btn--prev').get(0))
              .on('tap', function(ev) {
                  sup.prevItem();
                  ev.preventDefault();
              });
              
          $(this.galeria).find('.modal__close').click(function(){
            $(this).unbind();
            sup.destroy();
          });
    }

    module.prototype.buildGallery = function(){

        //var obj = Modal.addModal($('.modal_template--galeria').html());
        var obj = Modal.addModal(galeriaTemplate);
        sup = this;
        this.galeria = obj.modal;
        this.closeModal = obj.closeFnc;

        if(this.itemLimit == 1){
          $(this.galeria).find('.btn--next').css('display', 'none');
          $(this.galeria).find('.btn--prev').css('display', 'none');
        }

        $(obj.modal).find('.modal__galeria').click(function(e){
            if(e.target == this){
               obj.closeFnc(); 
            }
        });

        for(i in this.imageData){
            var desc = '';

            if(this.imageData[i].desc != ''){
              desc = '<div class="desc">'+this.imageData[i].desc+'</div>';
            }

            $(this.galeria).find('.modal__galeria').append('<div class="modal__galeria-big">'+desc+'<img src="'+this.imageData[i].src+'" /></div>');
        }

        this.init();
    }

    return module;

    /*
     * REQUIRED HTML
     *
     <div class="modal_template modal_template--galeria">
        <div class="modal__galeria rtl">
          <div class="modal__close sprite icon-close"></div>
          <div class="btn btn--next">»</div>
          <div class="btn btn--prev">«</div>
        </div>
      </div>
     *
     */

    /*
     * REQUIRED CSS
     *
     .modal__galeria {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .modal__close {
        top: 20px;
        right: 20px;
      }
      .btn {
        position: absolute;
        z-index: 50;
        top: 50%;
        width: 40px;
        height: 40px;
        margin-top: -20px;
        background-color: #f00;
      }
      .btn--next { right: 15px; }
      .btn--prev { left: 15px; }
    }
    .modal__galeria--animate { 
      .modal__galeria-big { .transition(0.4s); }
    }
    .modal__galeria-big {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 90%;
      height: auto;
      max-width: 800px;
      max-height: 600px;
      ._transform(-250%, -50%, 0);

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .modal__galeria.ltr {
      .modal__galeria-big.page-hide {
        ._transform(100%, -50%, 0);
      }
      .modal__galeria-big.page-show {
        ._transform(-250%, -50%, 0);
      }  
      .modal__galeria-big.page-visible {
        ._transform(-50%, -50%, 0) !important;
      }  
    }
    .modal__galeria.rtl {
      .modal__galeria-big { ._transform(100%, -50%, 0); }
      .page-hide {
        ._transform(-250%, -50%, 0);
      }
      .page-show {
        ._transform(100%, -50%, 0);
      }  
      .page-visible {
        ._transform(-50%, -50%, 0) !important;
      }
    }
    *
    */

});
