    //All core Logic will go here. All the bindings and interactions will be from this page only.
var drawingAreatxtMsg;
var $canvas = $('#canvas');
var ofset = $canvas.offset();
$(document).ready(function() {
    //Setting Admin or Customer Profile
    var userProfile = 'admin';
    userProfile == 'admin' ? adminProfile() : customerprofile();
    function adminProfile() {
        $('.Customer').remove();
    }
    function customerprofile() {
        $('.Admin').remove();
    }
    $('.uploadbg').on('click', function() {
        $('#uploadSVG_input').trigger('click');
    })

    //Loading the First SVG JSON 
    $.getJSON('svg.txt', function(data) {
        if (data[0].svg_url == "") {
            $('.upload').show();
        }
        loadInitialSVG(data[0].svg_url);
        $('.black-overlay').fadeIn();
        if (data[0].transformation != null) {
            setTimeout(function() {
                drawingAreatxtMsg.remove();
                rootrect.attr('opacity', 0.3);
                $.each(data[0].transformation, function(key, value) {
                    paper.createTextNode({
                        index: indexKeeper,
                        fontFamily: value.fontFamily,
                        fontSize: value.fontSize,
                        lineSpacing: value.lineSpacing,
                        letterSpacing: value.letterSpacing,
                        color: value.color,
                        textPath: value.curverPath,
                        path: value.bleedingBoxPath,
                        x: value.x,
                        y: value.y
                    });
                    indexKeeper++;
                })
                setHtmlValues();
                unfocusText();
                currentTextIndex = bleedingBox.length;
            }, 550);
        }
    })

    //CSS3 animations
    setTimeout(function() {
        $('.initialSteps').addClass('animated swing')
    }, 800)



    $('#upload_btn').click(function() {
        var elm = $('#uploadSVG_input');
        if ($('.black-overlay').css('display') != 'none') {
            $('.black-overlay').fadeOut();
            var det_sel = $('.import_svg_sel').clone();
            $('#changeBg_sel').append(det_sel);
        }
        $(elm).loadSvg({
            url: $(elm).val()
        });
    })

    var $curvePaper = $('#textCurvePathDiv');
//Initializing Raphael Paper

    function loadInitialSVG(svgurl) {
        var elm = $('#canvas');
        if (typeof(paper) == 'undefined') {
            paper = Raphael('canvas', $canvas.width(), $canvas.height());
            curverPaper = new Raphael('textCurvePathDiv', $('#controlsArea').width() - 40, $curvePaper.height());
            paper.curver(10, 80, 10, 80, 290, 80, 300, 80, '#87E043', curverPaper);
            //$('#change_svg_templ').html($(elm).html());
            $('.initialmsg').remove();
        }
        if ($('.black-overlay').css('display') != 'none') {
            $('.black-overlay').fadeOut();
            var det_sel = $('.import_svg_sel').clone();
            $('#changeBg_sel').append(det_sel);
        }
        $(elm).loadSvg({
            url: svgurl
        })
    }


    //Initial SVG load
    $('#import_svg_sel').val('0');
    //Loading SVG template on ready
    $('.import_svg_sel').change(function() {
        var elm = $(this);
        if (typeof(paper) == 'undefined') {
            paper = Raphael('canvas', $canvas.width(), $canvas.height());
            curverPaper = new Raphael('textCurvePathDiv', $('#controlsArea').width() - 40, $curvePaper.height());
            paper.curver(10, 80, 10, 80, 290, 80, 300, 80, '#87E043', curverPaper);
            $('#change_svg_templ').html($(elm).html());
            $('.initialmsg').remove();
        }
        if ($('.black-overlay').css('display') != 'none') {
            $('.black-overlay').fadeOut();
            var det_sel = $('.import_svg_sel').clone();
            $('#changeBg_sel').append(det_sel);
        }
        $(elm).loadSvg({
            url: $(elm).val()
        }, function() {
            //$('#addTextBtn').trigger('click');
        })
    })
    //Changin the SVG template later on.
    $('#change_svg_templ').change(function() {
        var elm = $(this);
        $(elm).loadSvg({
            url: $(elm).val()
        });
    })

    //hiding the customization box
    $('#custClose').click(function() {
        var elm = $(this);
        $('#textTools').slideUp(function() {
            $(elm).animate({
                'opacity': '0'
            });
            removetextElm(currentTextIndex);
        });
    });
    $('#closeHints').click(function() {
        $('.bleedinghint').removeClass('lightSpeedIn');
        $('.bleedinghint').addClass('lightSpeedOut');
        setTimeout(function() {
            $('.bleedinghint').hide();
        }, 500)
    })

    //creating text node on text button click
    $('.createNewText').click(function(event) {
        $('.black-overlay').fadeOut();
        $('.bleedinghint').show()
        $('.bleedinghint').addClass('animated lightSpeedIn')

        drawingAreatxtMsg.remove();
        rootrect.attr('opacity', 0.3);
        if (indexKeeper != 0) {
            unfocusText();
            currentTextIndex = bleedingBox.length;
        }
        bleedingBox[indexKeeper] = paper.path().attr({
            'stroke-width': 2,
            'stroke': '#3EEFC6'
        });
        if (indexKeeper == 0) {
            $canvas.addClass('highlight');
            var r = paper.rect(10, 15, 400, 20).attr({fill: '90-#e5a302-#f8d202'});
            var t = paper.text(40, 25, "Draw 'Bleeding Area' by clicking on the canvas").attr({fill: '#444', 'text-anchor': 'start', 'font-size': 12})
            setTimeout(function() {
                $canvas.removeClass('highlight');
                r.remove();
                t.remove();
            }, 13000)

        }
        $canvas.css('cursor', 'crosshair');
        //initiate the Bleeding box - the starting point of drawing text
        $canvas.on('click', function(e) {
            createBleedingBox(e, ofset);
        });
    });

    $('#font_family').change(function() {
        var elm = $(this);
        paper.createTextNode({
            fontFamily: $(elm).val(),
            data: $('.curTxtElm').val(),
            textPath: textElementProp[currentTextIndex].curverPath
        });
    })
    $('#lineSpacingSel').change(function() {
        var elm = $(this);
        paper.createTextNode({
            textPath: textElementProp[currentTextIndex].curverPath,
            lineSpacing: parseInt($(elm).val())
        });
    })
    $('#addIcon').click(function() {
        unfocusText();
    });
    $('#drawingArea').click(function() {
        if (typeof(freetransform[currentTextIndex]) != 'undefined') {
            freetransform[currentTextIndex].hideHandles({
                undrag: false
            }, function() {
                unfocusText();
            })
        }

    })
    $('#rotate90Deg').click(function() {
        var ft = freetransform[currentTextIndex];
        ft.attrs.rotate += 90;
        ft.apply();
    })
    $('#rotate90Deg_plus').click(function() {
        var ft = freetransform[currentTextIndex];
        ft.attrs.rotate -= 90;
        ft.apply();
    })
    $('#colorPicker').change(function() {
        var elm = $(this);
        changeColor('#' + $(elm).val());
    })

    //tabs
    $('.tab_btn').click(function() {
        var elm = $(this);
        $('.selTab').removeClass('selTab');
        $(elm).addClass('selTab');
        $('.tabDivs').slideUp('fast');
        $('#' + $(elm).data('relative')).slideDown('fast');
    });
    //Save and Close
    $('#saveAndClose').click(function() {
        exportToJSON();
    })
})


