$(document).ready(function () {
    $(function () {
        var animationLibrary = 'animate';
        $.easing.easeOutQuart = function (x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        };
        $('[ripple]:not([disabled],.disabled)').on('mousedown', function (e) {
            var button = $(this);
            var touch = $('<touch><touch/>');
            var size = button.outerWidth() * 1.8;
            var complete = false;
            $(document).on('mouseup', function () {
                var a = {'opacity': '0'};
                if (complete === true) {
                    size = size * 1.33;
                    $.extend(a, {
                        'height': size + 'px',
                        'width': size + 'px',
                        'margin-top': -size / 2 + 'px',
                        'margin-left': -size / 2 + 'px'
                    });
                }
                touch[animationLibrary](a, {
                    duration: 500,
                    complete: function () {
                        touch.remove();
                    },
                    easing: 'swing'
                });
            });
            touch.addClass('touch').css({
                'position': 'absolute',
                'top': e.pageY - button.offset().top + 'px',
                'left': e.pageX - button.offset().left + 'px',
                'width': '0',
                'height': '0'
            });
            button.get(0).appendChild(touch.get(0));
            touch[animationLibrary]({
                'height': size + 'px',
                'width': size + 'px',
                'margin-top': -size / 2 + 'px',
                'margin-left': -size / 2 + 'px'
            }, {
                queue: false,
                duration: 500,
                'easing': 'easeOutQuart',
                'complete': function () {
                    complete = true;
                }
            });
        });
    });
    var username = $('#username'), password = $('#password'),
        erroru = $('erroru'), errorp = $('errorp'),
        submit = $('#submit'), udiv = $('#u'), pdiv = $('#p'), backUrl = $('#backUrl');
    username.blur(function () {
        if (username.val() == '') {
            udiv.attr('errr', '');
            erroru.text('用户名不能为空')
        } else {
            udiv.removeAttr('errr');
            erroru.text('')
        }
    });
    password.blur(function () {
        if (password.val() == '') {
            pdiv.attr('errr', '');
            errorp.text('密码不能为空')
        } else {
            pdiv.removeAttr('errr');
            errorp.text('')
        }
    });
    submit.on('click', function (event) {
        event.preventDefault();
        var flag = false;
        var name = username.val();
        var pd = password.val();
        var bl = backUrl.val();
        if (name == '') {
            udiv.attr('errr', '');
        } else {
            udiv.removeAttr('errr');
        }
        if (pd == '') {
            pdiv.attr('errr', '');
        } else {
            pdiv.removeAttr('errr');
        }
        if (name != "" && pd != "") {
            flag = true;
        }
        if (flag) {
            $.ajax({
                method: "POST",
                url: "/passport/login",
                data: {
                    username: name,
                    password: pd,
                    backUrl: bl
                }
            }).done(function (msg) {
                if (msg.success) {
                    window.location.href = msg.model.backUrl;
                }
            }).fail(function (msg) {
                if (!msg.responseJSON.success) {
                    udiv.attr('errr', '');
                    erroru.text('用户名错误');
                    pdiv.attr('errr', '');
                    errorp.text('密码错误')
                }
            });
        }
    });
});

