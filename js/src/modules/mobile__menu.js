define([], function () {
    
    //MOBILE ICON CLICK
    $(".topo__menu-bt_mobile, .icon_menu_mobile_open-small").click(function(){
        $(".mobile__menu").addClass("mobile__menu--open");
    });

    $(".mobile__menu-close").click(function(){
        $(".mobile__menu").removeClass("mobile__menu--open");
    });

    //appending normal nav to mobile nav
    $(".mobile__menu").append("<nav></nav>");
    $(".mobile__menu nav").append($($(".main__nav ul").get(0)).clone());
    $(".mobile__menu nav ul").attr("class", "cf")
    $(".mobile__menu li").each(function(){
        if($(this).find("ul").length > 0){

            //if ul is empty remove it
            if($(this).find("ul li").length == 0){
                $(this).find("ul").remove();
                return;
            }

            $(this).addClass("icon-down-open");
            $(this).click(function(){
                if($(this).attr("data-status") == "closed" || $(this).attr("data-status") == null){
                    $(this).removeClass("icon-down-open");
                    $(this).addClass("icon-up-open");
                    $(this).find("ul").slideDown();

                    $(this).attr("data-status", "open");
                    return;
                }

                if($(this).attr("data-status") == "open"){
                    $(this).addClass("icon-down-open");
                    $(this).removeClass("icon-up-open");
                    $(this).find("ul").slideUp();

                    $(this).attr("data-status", "closed");
                }
            });
        }
    });

    return {module: "mobile menu"};

});
