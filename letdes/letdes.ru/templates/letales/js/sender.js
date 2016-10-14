jQuery.noConflict();
jQuery.cl_sender = function (el, options, $) {
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    
    base.$el.data("cl_sender", base);

    base.init = function () {
        base.options = $.extend({},$.cl_sender.defaultOptions, options);
        base.visit();

        base.options.blacklist = {};
        
        base.$el.submit(function(e) {
            e.preventDefault()
            base.submit(base.el);
        });
        
        base.wCine('resolution', window.screen.width + "x" + window.screen.height, 1);
        base.wCine('browser', base.getBrowser(), 1);
        base.wCine('referrer', document.referrer, 1);
                
        // Put your initialization code here
    };
    
    base.showMessage = function (msg) {
        var $el = $('.modal#message');
        $el.find('.text').text(msg);
        $('.modal').modal('hide');
        $el.modal('show');
    };
    
    base.submit = function(form) {
        var validateError = base.validate(form);
        
        if (!validateError) {

            //Успешная валидация
            var data = base.convertFD($(form).serializeArray());
            if (data.goal !== undefined) {
                console.log(data.goal)
                Metrika.reachGoal(data.goal);
				ga('send', 'event', 'form', data.goal);
            }
			
            base.send(data);
            base.showMessage("Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа");
            base.setCookie('roistat_leadHunterCaught', '1', 14*24);
        }
        
        return false;
    };
    
    base.send = function(data) {
        base.setCookie("sent", true, base.options.cooldown);

        $.ajax({
            url: base.options.url,
            type: "POST",
            data: data,
            success: function(response) {
                $('form').find('input:not("input[type=hidden]")').val("");
                console.log(response);
                setTimeout(function() {
                    //window.location = base.options.redirectUrl;
                }, 3000);
            }
        });
    };
    
    base.visit = function() {
        var pages = {};
        
        if (base.isCookie('pages-visited')) {
            pages = JSON.parse(base.getCookie('pages-visited'));        
        }
         
        var url = document.URL;
        var time = new Date();
        
        if (!(url in pages)) {
            pages[url] = time.getHours() + ":" + time.getMinutes();
            base.setCookie('pages-visited', JSON.stringify(pages), 24);
        }
        
        
    };
    
    base.validate = function (form) {
        var error = false;
        
        $(form).find('input[type=text][required]').each(function() {
            if (this.pattern !== "") {
                var patt = new RegExp($(this).attr('pattern'));
                
                if (patt.test($(this).val())) {
                    $(this).removeClass('error');     
                } else {
                    $(this).addClass('error');
                    error = true;
                }
            } else {
                if ($(this).val().length > 0) {
                    $(this).removeClass('error');    
                } else {
                    $(this).addClass('error');       
                    error = true;
                }
            }
        });
        
        return error;
    };
    
    base.setCookie = function (name, value, hours) {
        var d = new Date();
        d.setTime(d.getTime() + (hours*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
    };
    
    base.getCookie = function (name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));

        return matches ? decodeURIComponent(matches[1]) : "";
    };
    
    base.isCookie = function (name) {
        return !(base.getCookie(name) == "");
    }
    
    base.wCine = function (name, value, hours) {// Write cookie if not exists 
        if (!base.isCookie(name)) {
            base.setCookie(name, value, hours);
        }
    }

    base.convertFD = function (inputs) {
        var formObj = {};
        $.each(inputs, function (i, input) {
            formObj[input.name] = input.value;
        });
        return formObj;
    }
    
    base.getBrowser = function() {
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName  = navigator.appName;
        var fullVersion  = ''+parseFloat(navigator.appVersion); 
        var majorVersion = parseInt(navigator.appVersion,10);
        var nameOffset,verOffset,ix;

        // In Opera 15+, the true version is after "OPR/" 
        if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
         browserName = "Opera";
         fullVersion = nAgt.substring(verOffset+4);
        }
        // In older Opera, the true version is after "Opera" or after "Version"
        else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
         browserName = "Opera";
         fullVersion = nAgt.substring(verOffset+6);
         if ((verOffset=nAgt.indexOf("Version"))!=-1) 
           fullVersion = nAgt.substring(verOffset+8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
         browserName = "Microsoft Internet Explorer";
         fullVersion = nAgt.substring(verOffset+5);
        }
        // In Chrome, the true version is after "Chrome" 
        else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
         browserName = "Chrome";
         fullVersion = nAgt.substring(verOffset+7);
        }
        // In Safari, the true version is after "Safari" or after "Version" 
        else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
         browserName = "Safari";
         fullVersion = nAgt.substring(verOffset+7);
         if ((verOffset=nAgt.indexOf("Version"))!=-1) 
           fullVersion = nAgt.substring(verOffset+8);
        }
        // In Firefox, the true version is after "Firefox" 
        else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
         browserName = "Firefox";
         fullVersion = nAgt.substring(verOffset+8);
        }
        // In most other browsers, "name/version" is at the end of userAgent 
        else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
                  (verOffset=nAgt.lastIndexOf('/')) ) 
        {
         browserName = nAgt.substring(nameOffset,verOffset);
         fullVersion = nAgt.substring(verOffset+1);
         if (browserName.toLowerCase()==browserName.toUpperCase()) {
          browserName = navigator.appName;
         }
        }
        // trim the fullVersion string at semicolon/space if present
        if ((ix=fullVersion.indexOf(";"))!=-1)
           fullVersion=fullVersion.substring(0,ix);
        if ((ix=fullVersion.indexOf(" "))!=-1)
           fullVersion=fullVersion.substring(0,ix);

        majorVersion = parseInt(''+fullVersion,10);
        if (isNaN(majorVersion)) {
         fullVersion  = ''+parseFloat(navigator.appVersion); 
         majorVersion = parseInt(navigator.appVersion,10);
        }

        return (browserName+' '+fullVersion);    
    };
    
    // Run initializer
    base.init();
};

jQuery.cl_sender.defaultOptions = {
	bottom: 50,
	right: 50,
	timer: 2700,
	appearTime: 600000, //35
	url: "/custom/send.php",
	cooldown: 1, //1 Hours
	showsCount: 0,
    redirectUrl: "/spasibo.php",
    site: "localhost" //promo.komp-remont-service.ru
};

jQuery.fn.cl_sender = function (options) {
    return this.each(function () {
        (new jQuery.cl_sender(this, options, jQuery));

       // HAVE YOUR PLUGIN DO STUFF HERE


       // END DOING STUFF

    });
};