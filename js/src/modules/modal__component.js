define([], function () {
    
 
    function Modal(){

    }

    /*
     * Add a modal to page body, returns an object containing a function to call
     * that will close the modal, and the modal jquery object
     * @element: Html or jquery element to append in the modal
     */
    Modal.prototype.addModal = function(element){
        $("body").prepend('<div class="modal"></div>');

        var modal = $("body").find('.modal').get(0);
        var modalNr = $("body").find('.modal').length;

            //Put this new open modal above all the others
            $(modal).css('z-index', (3010 + modalNr) + 1);

            var closeFnc = function(){
                $(modal).removeClass('modal--visible');

                if($("body").find('.modal').length == 1){
                    $('.mobile__topo').removeClass('mobile__topo--closed');
                    $('.main').removeClass('main--closed');
                }

                setTimeout(function(){
                    $(modal).remove();
                }, 400);
            }

            //Add class to show from top
            if(arguments[1]){
                $(modal).addClass('modal__top');
            }

            $(modal).append(element);

            $(modal).find('.close__modal').click(function(e){
                if(e.target == this){ closeFnc(); }
            });

            setTimeout(function(){
                /*
                $('.mobile__topo').addClass('mobile__topo--closed');
                $('.main').addClass('main--closed');
                */
                $(modal).addClass('modal--visible');
            }, 10);

        return {closeFnc: closeFnc, modal: modal};
    }



    return new Modal();

});
