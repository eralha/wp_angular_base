define(['module/modal__component'], function (Modal) {

    function parseComponent(elem){
        var htmlElement = elem;

        if($(htmlElement).attr("data-init") == "false") { return; }

        require([$(htmlElement).attr("data-component")], function(component){
            if(typeof component == 'function'){
                var comp = new component(htmlElement);
            }
        });
    }
    
    function module(elem){
        window.templateCache = (window.templateCache) ? window.templateCache : {};
        this.templateCache = (window.templateCache) ? window.templateCache : {};
        this.elem = elem;

        $(elem).click($.proxy(this.elemClick, this));

    }

    module.prototype.elemClick = function(e){
        var templatePath = $(this.elem).attr('data-template');
        var sup = this;

        if(this.templateCache[templatePath]){
            this.renderModal(this.templateCache[templatePath]);
            return;
        }

        $.ajax({
          url: templatePath,
          dataType : 'html'
        })
        .done(function( data ) {
          sup.renderModal(data);
          window.templateCache[templatePath] = data;
        });
    }

    module.prototype.renderModal = function(htmlTemplate){
        var obj = Modal.addModal(htmlTemplate);
        $(obj.modal).find("[data-component]").each(function(){
            parseComponent(this);
        });
    }


    return module;

});
