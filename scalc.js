/*jshint eqnull:true */
// JavaScript Document

// window.addEventListener("load", Init);
window.addEventListener("DOMContentLoaded", Init);

function Init() {
    var f = document.rpncal;
    getLocalStorage(); //including language setting _lg
    defineconstants(); //set m[]
    applyStorage(); //set memories, stacks, etc
    setFooter(); //status bar + footer
    document.getElementById("link").onclick = function() {
        scalchelp();
    };
    document.getElementById("stack0").addEventListener("keypress", chkkey, false);
    document.getElementById("stack0").addEventListener("keydown", chkkey_down, false);
    document.getElementById("stack0").addEventListener("keyup", chkkey_up, false);
    document.getElementById("stack0").onblur = function() {
        f.stack0.focus();
    };
    info('');
    f.stack0.focus();
    getRates();
    window.setTimeout(function() {
        document.getElementById('stack0').onblur = function() {
            f.stack0.focus();
        };
    }, 0);
}

function display() {
    f = document.rpncal;
    f.label0.value = (sp === 0) ? "x:" : sp + ":";
    f.label1.value = (sp === 0) ? "y:" : sp + 1 + ":";
    f.label2.value = sp + 2 + ":";
    f.label3.value = sp + 3 + ":";
    f.label4.value = sp + 4 + ":";
    f.label5.value = '^';
    if (isNaN(stack[sp + 5]) || stack[sp + 5] === 0 || stack[sp + 5] === '') f.label5.value = '';
    var st = new Array(1);
    var not = store.not;
    for (var i = 0; i < 5; i++) {
        stack[sp + i] = (stack[sp + i] === undefined) ? '' : stack[sp + i];
        stack_im[sp + i] = (stack_im[sp + i] === undefined) ? '' : stack_im[sp + i];
        if (!(stack_im[sp+i].length==0 || stack_im[sp+i].toString() ==='0')){
            // console.log('i stack_im' + ': '+ i+' '+stack_im[sp+i]+' ' +stack_im[sp+i].length);
            var prec = Decimal(10).pow(Decimal(rnd_calc).neg()); //precision
            if (Decimal(stack_im[sp + i]).abs().lt(prec)) { //if im-part is too small
                stack_im[sp+i]='';
            } 
        }
        var t = stack_im[sp + i].toString();
        if (stack[sp + i] == 'NaN') {
            st[i] = 'Error';
        } else if (stack[sp + i] == 'Error') {
            st[i] = stack[sp + i];
        } else if ((t !== '0' && t !== '') && (not !== 'complex' && not !== 'polar')) {
            // Display error if result is complex and notation is not complex or polar
            st[i] = _lg.Error_set_notation_to_complex;
        } else {
            Decimal.config({
                precision: store.rnd
            }); //calculation with lower precision to prevent rounding errors with trig functions
            if (not == "norm") {
                st[i] = (stack[sp + i] === '') ? '' : Decimal(stack[sp + i]).times('1');
            } else if (not == "sci") {
                st[i] = (stack[sp + i] === '') ? '' : Decimal(stack[sp + i]).times('1').toExponential();
            } else if (not == "eng") {
                st[i] = (stack[sp + i] === '') ? '' : toEng(Decimal(stack[sp + i]).times('1'));
            } else if (not == "fxd") {
                st[i] = (stack[sp + i] === '') ? '' : Decimal(stack[sp + i]).times('1').toFixed(store.rnd);
            } else if (not == "int") { //integer
                st[i] = (stack[sp + i] === '') ? '' : Decimal(stack[sp + i]).times('1').toFixed(0);
            } else if (not == "fin") {
                st[i] = (stack[sp + i] === '') ? '' : Decimal(stack[sp + i]).times('1').toFixed(2);
            } else if (not == "h:m:s") { //hours/degrees, minutes, seconds
                st[i] = (stack[sp + i] === '') ? '' : toHms(stack[sp + i]);
            } else if (not == "h:m") { //hours/degrees, minutes
                st[i] = (stack[sp + i] === '') ? '' : toHm(stack[sp + i]);
            } else if (not == "hex") {
                st[i] = (stack[sp + i] === '') ? '' : Decimal(stack[sp + i]).toHex();
            } else if (not == "oct") {
                st[i] = (stack[sp + i] === '') ? '' : Decimal(stack[sp + i]).toOctal();
            } else if (not == "bin") {
                st[i] = (stack[sp + i] === '') ? '' : Decimal(stack[sp + i]).toBinary();
            } else if (not == "frac") { //fraction
                st[i] = (stack[sp + i] === '') ? '' : toFrac(stack[sp + i]);
            } else if (not == "complex") { //complex numbers
                st[i] = (stack[sp + i] === '' && stack_im[sp + i] === '') ? '' : toComplex(stack[sp + i], stack_im[sp + i]);
            } else if (not == "polar") { //complex numbers polar notation
                st[i] = (stack[sp + i] === '' && stack_im[sp + i] === '') ? '' : toPolar(stack[sp + i], stack_im[sp + i]);
            }
            Decimal.config({
                precision: rnd_calc + 4
            });
        }
    }
    f.stack0.value = formatoutput(st[0]);
    f.stack1.value = formatoutput(st[1]);
    f.stack2.value = formatoutput(st[2]);
    f.stack3.value = formatoutput(st[3]);
    f.stack4.value = formatoutput(st[4]);

    f.opstack0.value = (store.rpnmode == 'rpn' || opstack[sp + 0] === undefined) ? '' : dpsep(opstack[sp + 0]);
    f.opstack1.value = (store.rpnmode == 'rpn' || opstack[sp + 1] === undefined) ? '' : dpsep(opstack[sp + 1]);
    f.opstack2.value = (store.rpnmode == 'rpn' || opstack[sp + 2] === undefined) ? '' : dpsep(opstack[sp + 2]);
    f.opstack3.value = (store.rpnmode == 'rpn' || opstack[sp + 3] === undefined) ? '' : dpsep(opstack[sp + 3]);
    f.opstack4.value = (store.rpnmode == 'rpn' || opstack[sp + 4] === undefined) ? '' : dpsep(opstack[sp + 4]);

    f.result0.value = dpsep(hisstack[sp + 0]);
    f.result1.value = dpsep(hisstack[sp + 1]);
    f.result2.value = dpsep(hisstack[sp + 2]);
    f.result3.value = dpsep(hisstack[sp + 3]);
    f.result4.value = dpsep(hisstack[sp + 4]);

    f.status1.value = store.not + " " + store.rnd;
    f.status0.value = (store.deg == 'deg')? _lg.degrees : _lg.radian;
    f.status2.value = _lg.rate + ': ' + dpsep((100 * store.rate).toPrecision(3)).toString() + '%';

    showmenu("start");
    savestacks();
    f.stack0.focus();
}

function wait(ms) {
    var d = new Date();
    var d2 = null;
    do {
        d2 = new Date();
    }
    while (d2 - d < ms);
}

function rpnmodeon() {
    var elements = document.getElementsByClassName('opstack');
    for (var i = 0; i < 4; i++) {
        elements[0].className = 'hide';
    }
    var elements2 = document.getElementsByClassName('stack');
    for (i = 0; i < 4; i++) {
        elements2[0].className = 'stacklong';
    }
    var elements3 = document.getElementsByClassName('opstackx');
    elements3[0].className = 'hidex';
    var elements4 = document.getElementsByClassName('stackx');
    elements4[0].className = 'stackxlong';
    document.getElementById("name").innerHTML = '';
    document.getElementById("name").innerHTML = 'RPN-Calculator';
    store.rpnmode = 'rpn';
    storerecord("rpnmode", 'rpn');
    m[0][11] = [_lg.space, '&#160&#160' + _lg.select_yellow_box];
    showmenu('start');
}

function rpnmodeoff() {
    var re = stack[0]; //only x-value to remember
    var im = stack_im[0]; //only x-value to remember
    var h = hisstack[0];
    stack = [];
    stack_im = [];
    opstack = [];
    hisstack = [];
    hisopstack = [];
    stack[0] = re;
    stack_im[0] = im;
    hisstack[0] = h;
    var elements = document.getElementsByClassName('hide');
    var n = elements.length;
    for (var i = 0; i < n; i++) {
        elements[0].className = 'opstack';
    }
    var elements2 = document.getElementsByClassName('stacklong');
    n = elements2.length;
    for (i = 0; i < n; i++) {
        elements2[0].className = 'stack';
    }
    var elements3 = document.getElementsByClassName('hidex');
    n = elements3.length;
    for (i = 0; i < n; i++) {
        elements3[0].className = 'opstackx';
    }
    var elements4 = document.getElementsByClassName('stackxlong');
    n = elements4.length;
    for (i = 0; i < n; i++) {
        elements4[0].className = 'stackx';
    }
    document.getElementById("name").innerHTML = '';
    document.getElementById("name").innerHTML = 'Stack-Calculator';
    store.rpnmode = 'stack';
    storerecord("rpnmode", 'stack');
    m[0][11] = ['', ''];
    showmenu('start');
    display();
}

function statusangle(s) { //set status0
    var u = document.rpncal.status0.value;
    document.rpncal.status0.value = s;
    if (s != u) {
        colorFade('status0', 'background', 'e3e3e3', 'fafb94', 25, 10);
        setTimeout(function() {
            colorFade('status0', 'background', 'fafb94', 'e3e3e3', 25, 30);
        }, 2000);
    }
}

function statusnot(s) { //set status1
    var u = document.rpncal.status1.value;
    document.rpncal.status1.value = s;
    if (s != u) {
        s = s.substr(0, s.length - 3);
        colorFade('status1', 'background', 'e3e3e3', 'fafb94', 25, 10);
        setTimeout(function() {
            colorFade('status1', 'background', 'fafb94', 'e3e3e3', 25, 30);
        }, 2000);
    }
}

function statusrate(s) { //set status2
    var u = document.rpncal.status2.value;
    document.rpncal.status2.value = dpsep(s);
    if (s != u) {
        colorFade('status2', 'background', 'e3e3e3', 'fafb94', 25, 10);
        setTimeout(function() {
            colorFade('status2', 'background', 'fafb94', 'e3e3e3', 25, 30);
        }, 2000);
    }
}

function info(s) { //set status3
    if (s !== '') {
        s = s.replace('->', '\u21d2');
        s = s.replace('<-', '\u21d0');
        document.rpncal.status3.value = dpsep(s);
        colorFade('status3', 'background', 'e3e3e3', 'fafb94', 25, 10);
        setTimeout(function() {
            colorFade('status3', 'background', 'fafb94', 'e3e3e3', 25, 30);
        }, 2000);
    }
}

function showmenu(layer) {
    var j = 0;
    var txt1, txt2, txt3, lb, i;
    // var browser = checkbrowser();
    //if (browser != 'chrome') m[0][17] = ['', ''];
    if (layer !== 'start') {
        try {
            _gaq.push(['_trackEvent', 'Menu', layer]);
        } catch (e) {
            console.log("trackevent " + layer + " failed");
        }
    }
    txt1 = "";
    txt2 = "<br><br>";
    txt3 = "<br><br>";
    lb = "<span class=label2>";
    switch (layer) {
        case "start":
            txt1 = "<b>" + _lg.Menu + "</b><br><br>";
            txt3 = "<b></b><br><br>";
            j = 0;
            lb = "<span class=label3>";
            break;
        case "algebra":
            info(_lg.press_key_for_function);
            txt1 = "<b>" + _lg.Algebra + "</b><br><br>";
            txt2 = "<b>" + _lg.Trigonometric + "</b><br><br>";
            txt3 = "<b>" + _lg.Complex + "</b><br><br>";
            j = 5;
            break;
        case "financial":
            info('press key for function, space to exit');
            txt1 = "<b>" + _lg.Finance + "<br>" + _lg.CAGR + "<br></b>";
            txt2 = "<br><b>" + _lg.Annuity + "</b><br>";
            txt3 = "<br><b>" + _lg.Cashflow + "</b><br>";
            j = 9;
            break;
        case "finentry":
            txt1 = "<b>" + _lg.Assign_value_to_variable + "<br>" + _lg.CAGR + "<br></b>";
            txt2 = "<br><b>" + _lg.Annuity + "</b><br>";
            txt3 = "<br><b>" + _lg.Cashflow + "</b><br>";
            j = 10;
            break;
        case "statistics":
            info(_lg.press_key_for_function);
            txt1 = "<b>" + _lg.statistics + "</b><br><br>";
            //txt3="<b>Time</b><br><br>";
            j = 6;
            break;
        case "constants":
            info(_lg.press_key_to_get_constant);
            txt1 = "<b>" + _lg.Physical_constants + "</b><br><br>";
            txt3 = "<b>" + _lg.Math_constants + "</b><br><br>";
            j = 7;
            break;
        case "convert":
            info(_lg.press_key_to_convert);
            txt1 = "<b>" + _lg.Convert + "</b><br><br>";
            txt2 = "<b>" + _lg.press_z_to_reverse_direction + "</b><br><br>";
            j = 1;
            break;
        case "xrates":
            if (m[4][store.bcn][3] != 1.0) { //recalculate rates is needed after initiation
                var bc = parseFloat(m[4][store.bcn][3]);
                for (i = 0; i < m[4].length; i++) {
                    m[4][i][3] = (m[4][i][3] / bc).toString().slice(0, 7);
                }
            }
            info(_lg.press_key_to_exchange_rates);
            txt1 = "<b>" + _lg.Exchange_result + m[4][store.bcn][2] + " -></b><br><br>";
            txt2 = _lg.press_z_to_reverse_direction + "<br><br>";
            txt3 = _lg.Press_y_to_set_base_curr + "<br><br>";
            j = 4;
            break;
        case "clear":
            info(_lg.press_key_for_function);
            txt1 = "<b>" + _lg.clear_copy_paste + "</b><br><br>";
            j = 3;
            break;
        case "notation":
            txt1 = "<b>" + _lg.Notation + "</b><br><br>";
            j = 2;
            break;
        case "help":
            txt1 = "<b>" + _lg.What_is_it + "</b><br>";
            txt2 = "<b>" + _lg.Main_features + "</b><br>";
            txt3 = "<b>" + _lg.About + "</b><br>";
            j = 8;
            break;
        case "help1":
            txt1 = "<b>" + _lg.Use_keyboard + "</b><br>";
            txt2 = "<b>" + _lg.Options + "</b><br>";
            txt3 = "<b>" + _lg.Memory + "</b><br>";
            j = 11;
            break;
        case "help2":
            txt1 = "<b>" + _lg.exchange_rates + "</b><br>";
            txt2 = "<b>" + _lg.CAGR + '/' + _lg.Annuity + "</b><br>";
            txt3 = "<b>" + _lg.Cashflow + "</b><br>";
            j = 12;
            break;
        case "help3":
            txt1 = "<b>" + _lg.data_entry + "</b><br>";
            txt2 = "<b></b><br>";
            txt3 = "<b>" + _lg.complex_numbers + "</b><br>";
            j = 16;
            break;
        case "lastanswers":
            info(_lg.press_key_to_recall);
            txt1 = "<b>" + _lg.last_answers + "</b><br><br>";
            for (i = 0; i < 30; i++) {
                if (store.not === 'complex' || store.not === 'polar') {
                    m[13][i] = [ml[i], round4(lastanswers[i], lastanswers_im[i])];
                } else {
                    m[13][i] = [ml[i], round3(lastanswers[i])];
                }
            }
            j = 13;
            break;
        case "memx":
            if (shift == 's') {
                info(_lg.press_key_to_store);
            } else if (shift == 'r') {
                info(_lg.press_key_to_recall);
            }
            txt1 = "<b>" + _lg.Memory + "</b><br><br>";
            for (i = 0; i < 30; i++) {
                if (store.not === 'complex' || store.not === 'polar') {
                    m[14][i] = [ml[i], round4(memx[i], memx_im[i])];
                } else {
                    m[14][i] = [ml[i], round3(memx[i])];
                }
            }
            j = 14;
            break;
        default:
    }

    if (j == 10) { //entered financial values in bold
        for (i = 0; i < m[j].length; i++) {
            if (i < 10) {
                if (i == 1 || i == 3 || i == 5 || i == 7) {
                    txt1 += lb + m[j][i][0] + "</span><b>" + round3(m[j][i][1]) + '</b><br>';
                } else {
                    txt1 += lb + m[j][i][0] + "</span>  " + m[j][i][1] + "<br>";
                }
            } else if (i < 20) {
                if (i == 11 || i == 13 || i == 15 || i == 17 || i == 19) {
                    txt2 += lb + m[j][i][0] + "</span><b>" + round3(m[j][i][1]) + '</b><br>';
                } else {
                    txt2 += lb + m[j][i][0] + "</span>  " + m[j][i][1] + "<br>";
                }
            } else {
                if (i == 21) {
                    txt3 += lb + m[j][i][0] + "</span><b>" + round3(m[j][i][1]) + '</b><br>';
                } else {
                    txt3 += lb + m[j][i][0] + "</span>  " + m[j][i][1] + "<br>";
                }
            }
        }
    } else if (j == 4) { //xchange
        for (i = 0; i < m[j].length; i++) {
            if (i < 10) {
                txt1 += lb + m[j][i][0] + "</span>  " + '-> ' + m[j][i][2] + ' ' + calcrate(m[j][i][3]) + "<br>";
            } else if (i < 20) {
                txt2 += lb + m[j][i][0] + "</span>  " + '-> ' + m[j][i][2] + ' ' + calcrate(m[j][i][3]) + "<br>";
            } else {
                txt3 += lb + m[j][i][0] + "</span>  " + '-> ' + m[j][i][2] + ' ' + calcrate(m[j][i][3]) + "<br>";
            }
        }
    } else { //other values standard
        for (i = 0; i < m[j].length; i++) {
            if (i < 10) {
                txt1 += lb + m[j][i][0] + "</span>  " + m[j][i][1] + "<br>";
            } else if (i < 20) {
                txt2 += lb + m[j][i][0] + "</span>  " + m[j][i][1] + "<br>";
            } else {
                txt3 += lb + m[j][i][0] + "</span>  " + m[j][i][1] + "<br>";
            }
        }
    }
    if (j == 1 || j == 4) {
        if (cvdir == 'r') { //reverse convert
            txt1 = txt1.replace(/->/g, '\u21d2');
            txt2 = txt2.replace(/->/g, '\u21d2');
            txt3 = txt3.replace(/->/g, '\u21d2');
        } else { //reverse convert
            txt1 = txt1.replace(/->/g, '<span class=red>\u21d0</span>');
            txt2 = txt2.replace(/->/g, '<span class=red>\u21d0</span>');
            txt3 = txt3.replace(/->/g, '<span class=red>\u21d0</span>');
        }
    }
    document.getElementById("box31").innerHTML = txt1;
    document.getElementById("box32").innerHTML = txt2;
    document.getElementById("box33").innerHTML = txt3;
}

function showentry(value) { //entry menu for financial parameters
    if (value == 1) {
        var txt = "<b>Data entry</b><br><br>";
        txt += "Enter decimal value and press key to assign<br><br>";
        txt += "<div class=entryval>&nbsp" + entry + "</div><br>";
        txt += "<br> Press <b>z</b> to return to calculate menu<br>";
        document.getElementById("entry").innerHTML = txt;
    }
    if (value === 0) {
        if (document.layers) {
            document.layers.entry.visibility = 'hide';
        } else {
            document.getElementById('entry').style.visibility = 'hidden';
        }
    } else if (value == 1) {
        if (document.layers) {
            document.layers.entry.visibility = 'show';
        } else {
            document.getElementById('entry').style.visibility = 'visible';
        }
    }
}

function showbasecurrency(value) { //select base currency
    if (value == 1) {
        var txt = "<b>" + _lg.Set_base_currency + "</b><br><br>";
        for (var i = 0; i < m[4].length; i++) {
            if (i == store.bcn) {
                txt += "<span class=label4>" + m[4][i][0] + "</span><b>  " + m[4][i][2] + " " + m[4][i][1] + "</b><br>";
            } else {
                txt += "<span class=label4>" + m[4][i][0] + "</span>  " + m[4][i][2] + " " + m[4][i][1] + "<br>";
            }
        }
        document.getElementById("basecur").innerHTML = txt;
    }
    if (value === 0) {
        if (document.layers) {
            document.layers.basecur.visibility = 'hide';
        } else {
            document.getElementById('basecur').style.visibility = 'hidden';
        }
    } else if (value == 1) {
        if (document.layers) {
            document.layers.basecur.visibility = 'show';
        } else {
            document.getElementById('basecur').style.visibility = 'visible';
        }
    }
}

function shownotations(value) { //menu to select notation
    var notation = ['norm', 'fin', 'int', 'sci', 'eng', 'fxd', 'h:m', 'h:m:s', 'hex', 'oct', 'bin', 'frac', 'complex', 'polar'];
    if (value == 1) {
        var txt = "<b>" + _lg.Set_notation + "</b><br><br>";
        var j = notation.indexOf(store.not); //notation
        for (i = 0; i < notation.length; i++) {
            if (i == j) {
                txt += "<span class=label4>" + m[15][i][0] + "</span><b>  " + m[15][i][1] + "</b><br>";
            } else {
                txt += "<span class=label4>" + m[15][i][0] + "</span>  " + m[15][i][1] + "<br>";
            }
        }
        // console.log("not: " + txt +' '+value);
        txt += "<br>";
        txt += _lg.Precision + "<br>";
        txt += "<span class=label4>&#8593&#8595</span>" + store.rnd + " " + _lg.decimals + "<br>"; //precision
        txt += "<br> " + _lg.any_other_key_to_exit + "<br>";
        document.getElementById("notations").innerHTML = txt;
    }
    if (value === 0) {
        if (document.layers) {
            document.layers.notation.visibility = 'hide';
        } else {
            document.getElementById('notations').style.visibility = 'hidden';
        }
    } else if (value == 1) {
        if (document.layers) {
            document.layers.notation.visibility = 'show';
        } else {
            document.getElementById('notations').style.visibility = 'visible';
        }
    }
}

function showoptions(value) { //menu to select options, on = 1 off = 0
    var language = ['us', 'nl'];
    if (value == 1) {
        var txt = "<b>Options</b><br><br>";
        txt += "Calculator " + _lg.mode + "<br>";
        j = (store.rpnmode == 'rpn' ? 19 : 20); //mode
        for (var i = 19; i < 21; i++) {
            if (i == j) {
                txt += "<span class=label4>" + m[2][i][0] + "</span><b>  " + m[2][i][1] + "</b><br>";
            } else {
                txt += "<span class=label4>" + m[2][i][0] + "</span>  " + m[2][i][1] + "<br>";
            }
        }
        txt += "<br>";
        txt += _lg.language + "<br>";
        var j = language.indexOf(store.language); //language
        for (i = 0; i < 2; i++) {
            if (i == j) {
                txt += "<span class=label4>" + m[2][i][0] + "</span><b>  " + m[2][i][1] + "</b><br>";
            } else {
                txt += "<span class=label4>" + m[2][i][0] + "</span>  " + m[2][i][1] + "<br>";
            }
        }
        txt += "<br>";
        txt += _lg.Decimal_separator + "<br>";
        j = (store.comma == 'c' ? 14 : 15); //decimal separator
        for (i = 14; i < 16; i++) {
            if (i == j) {
                txt += "<span class=label4>" + m[2][i][0] + "</span><b>  " + m[2][i][1] + "</b><br>";
            } else {
                txt += "<span class=label4>" + m[2][i][0] + "</span>  " + m[2][i][1] + "<br>";
            }
        }
        txt += "<br>";
        txt += _lg.Angle + "<br>";
        j = (dgmode == '1' ? 16 : 17); //radian or degrees
        for (i = 16; i < 18; i++) {
            if (i == j) {
                txt += "<span class=label4>" + m[2][i][0] + "</span><b>  " + m[2][i][1] + "</b><br>";
            } else {
                txt += "<span class=label4>" + m[2][i][0] + "</span>  " + m[2][i][1] + "<br>";
            }
        }
        txt += "<br>";
        txt += _lg.Thousands_separator + "<br>";
        if (store.thousandssep === 'on') { //thousands separator
            txt += "<span class=label4>" + m[2][13][0] + "</span><b>on</b><br>";
        } else {
            txt += "<span class=label4>" + m[2][13][0] + "</span><b>off</b><br>";
        }
        txt += "<br>";
        txt += _lg.Precision + "<br>";
        txt += "<span class=label4>&#8593&#8595</span>" + store.rnd + " " + _lg.decimals + "<br>"; //precision
        txt += "<br> " + _lg.any_other_key_to_exit + "<br>";
        document.getElementById("options").innerHTML = txt;
    }
    if (value === 0) {
        if (document.layers) {
            document.layers.options.visibility = 'hide';
        } else {
            document.getElementById('options').style.visibility = 'hidden';
        }
    } else if (value == 1) {
        if (document.layers) {
            document.layers.options.visibility = 'show';
        } else {
            document.getElementById('options').style.visibility = 'visible';
        }
    }
}

function showpressedkey(char) { // for instructions: show pressed char
    if (char == ' ') char = "\u2423";
    document.getElementById("pressedkey").innerHTML = char;
    document.getElementById('pressedkey').style.visibility = 'visible';
    colorFade('pressedkey', 'text', 'F6F6F6', 'FF0000', 20, 15);
    setTimeout(function() {
        colorFade('pressedkey', 'text', 'FF0000', 'F6F6F6', 20, 15);
    }, 1000);
}

function callwindow() {
    if (run_as == 'ext') {
        chrome.windows.create({
            url: "popup.html",
            left: 200,
            top: 100,
            width: 640,
            height: 610,
            type: "popup"
        });
    }
}

function addChar(character) { // add a new character to the display
    f = document.rpncal;
    if (computed || enterpressed) {
        fillundostack();
    }
    if (stack[0] == 'Infinity' || stack[0] == 'Error') cx();
    if (computed) { // auto-push the stack if the last value was computed
        if (store.rpnmode == 'rpn') pushStack();
        stack[0] = "";
        stack_im[0] = "";
        hisstack[0] = "";
        hisopstack[0] = "";
        display();
        computed = false;
    }
    if (enterpressed) {
        stack[0] = "";
        stack_im[0] = "";
        hisstack[0] = "";
        hisopstack[0] = "";
        display();
        computed = false;
        enterpressed = false;
    }
    if (stack[0].match(/^[0-9\.\-eE+xobacdfi<\(:'\\\)]+$/)) { // make sure stack[0] is a string
        //debugger;
        stack_im[0] = '0';
        stack[0] += character;
        f.stack0.value += character;
    } else {
        stack[0] = '';
        stack_im[0] = '0';
        stack[0] += character;
        f.stack0.value = character;
    }
}

function deleteChar() {
    if (shift == 'fe') {
        entry = entry.substring(0, entry.length - 1);
        showentry(1);
    } else if (computed || enterpressed) {
        fillundostack();
        stack[0] = "";
        computed = false;
        enterpressed = false;
        display();
    } else {
        f.stack0.value = f.stack0.value.substring(0, f.stack0.value.length - 1);
        stack[0] = f.stack0.value;
    }
}

function getstack0() {
    return document.rpncal.stack0.value;
}

function getclipboard() { //paste clipboard to x
    var x = "";
    try { // works in kit
        var gui = require('nw.gui');
        var clipboard = gui.Clipboard.get();
        x = clipboard.get('text');
    } catch (e) {
        x = window.prompt(_lg.Paste_from_clipboard, "");
        pasteClipboard();
    }
    x = x.toString().replace(',', '.');
    // if (x !== null && x !== "" && !Decimal(x).isNaN() && Decimal(x).isFinite()) {
    if (x !== null && x !== "" && !isNaN(x) && isFinite(x)) {
        fillundostack();
        if (computed) pushStack();
        stack[0] = x;
        hisstack[0] = roundhis(stack[0]);
        computed = true;
        display();
    } else {
        info('not a number in clipboard');
    }
    showmenu("start");
}

function copyToClipboard(text) {
    try { // as kit
        var gui = require('nw.gui');
        var clipboard = gui.Clipboard.get();
        clipboard.set(stack[0].toString(), 'text');
    } catch (err) {
        // console.log("copyToClipboard: " + 'error...');
        document.querySelector("#stack0").select();
        document.execCommand("Copy", false, null);
    }
    info('x copied to clipboard');
}

function pasteClipboard() {
    var cliptext = document.createElement('input');
    document.body.appendChild(cliptext);
    cliptext.contentEditable = true;
    cliptext.focus();
    // console.log(document.execCommand('paste'), 'execCommand("paste") should return true');
    document.execCommand('paste');
    var clipboardContent = cliptext.value;
    //f.stack0.value=cliptext.value;
    cliptext.remove();
    // console.log('Clipboard content: ' + clipboardContent);
}

function enterx() { // the enter button in rpn-mode
    var cpl = complex2dec(stack[0]); //separate re- and im-part
    // var x = document.rpncal.stack0.value;
    var x = getstack0();
    if (x === stack[0]) { //only the case for new entered values
        stack[0] = cpl.re;
        stack_im[0] = cpl.im;
    }
    stack[0] = (stack[0] === '') ? '0' : stack[0];
    stack[0] = hms2dec(stack[0]);
    stack[0] = imp2dec(stack[0]);
    stack[0] = frac2dec(stack[0]);
    //stack[0] = date2dec(stack[0]);
    fillundostack();
    if (hisstack[0] == '') {
        fillhisstack0();
    }
    pushStack();
    display();
    // }
    enterpressed = true;
    computed = false;
}

function enterop(oper, dir) { //enter operator
    //dir is 'ifix' for infix and 'pfix' for postfix or prefix
    //oper is operator
    // var entry = document.rpncal.stack0.value;
    var entry = getstack0();
    var cpl = complex2dec(stack[0]); //separate re- and im-part
    if (entry === stack[0]) { //only new values if entry is given
        stack[0] = cpl.re;
        stack_im[0] = cpl.im;
    }
    stack[0] = hms2dec(stack[0]);
    stack[0] = imp2dec(stack[0]);
    stack[0] = frac2dec(stack[0]);
    sp = 0;
    if (stack[0] == "-") stack[0] = "";
    if (store.rpnmode == 'stack') { //stack mode
        if (stack[0].length == 0) { //only if stack[0]=="" (not if 0)
            if (dir == "ifix") {
                //no push
            } else { //operator is prefix
                pushStack();
            }
            opstack[0] = oper;
        } else {
            if (dir == "ifix") { //new operator
                //immediate calculate if there is no uncertainty
                if (oper == "+" && opstack[0] == "+") calculate(); // + followed after +
                if (oper == "-" && opstack[0] == "+") calculate(); // - followed after +
                if (oper == "*" && opstack[0] == "*") calculate(); // * followed after *
                if (oper == "/" && opstack[0] == "*") calculate(); // / followed after *
                pushStack();
                opstack[0] = oper;
            } else { //operator is postfix
                pushStack();
                opstack[0] = oper;
                stack[0] = stack[1];
                stack_im[0] = stack_im[1];
                hisstack[0] = hisstack[1];
                hisopstack[0] = hisopstack[1];
                calculate();
            }
        }
    } else { //rpn mode
        if (dir == 'pfix') {
            pushStack();
        }
        opstack[0] = oper;
        calculate();
    }
    display();
    //enterpressed=true;
}

// *****************************************************************************
// keyboard interface

// handle the differences between browsers
function getkey(e) {
    if (window.event) { //chrome
        return window.event.keyCode;
    } else if (e) { //firefox
        var key = e.which;
        return e.which;
    } else
        return null;
}

function chkkey_up(e) { //is triggered when 'onkeyup' **************************
    key = getkey(e);
    if (key == 17) {
        ctrl = false; //reset ctrl
        // function keys here because of different behaviour of web vs nodejs (no keypress detection in nodejs)
    } else if (key == 112) { //help F1
        shift = 'h';
        showmenu("help");
    }
}

function chkkey_down(e) { //is triggered when 'onkeydown' **************************
    var key, keychar;
    store.rnd = parseFloat(store.rnd);
    key = getkey(e);
    if (key == 17) ctrl = true; //reset when key_up
    key1 = key; //remember key for in chkkey, to use arrows in option menu
    if (key == 38) { // up arrow
        if (shift == 'o' || shift === 'not') { //if options menu or notations menu open
            store.rnd += 1;
            rnd_calc += 1;
            storerecord("rnd", store.rnd);
            statusnot(store.not + " " + store.rnd);
            display();
            if (shift === 'o') showoptions(1);
            if (shift === 'not') shownotations(1);
        } else {
            sp += 1;
            display();
        }
    } else if (key == 40) { // down arrow
        if (shift == 'o' || shift === 'not') {
            store.rnd -= 1;
            rnd_calc -= 1;
            store.rnd = (store.rnd < 1 ? 1 : store.rnd);
            rnd_calc = (rnd_calc < 16 ? 16 : rnd_calc);
            storerecord("rnd", store.rnd);
            statusnot(store.not + " " + store.rnd);
            display();
            if (shift === 'o') showoptions(1);
            if (shift === 'not') shownotations(1);
        } else {
            sp -= 1;
            if (sp < 0) sp = 0;
            display();
        }
    } else if (key == 86 && ctrl) { //ctrl-v
        getclipboard();
    } else if (key == 67 && ctrl) { //ctrl-c
        copyToClipboard(stack[0].toString());
        display();
    } else if (key == 81 && ctrl) { //ctrl-q: hidden key to go back to factory settings
        clrstack();
        clrmem();
        clrla();
        store = [];
        localStorage.setItem('st01', JSON.stringify(store));
    } else if (key == 222) { //foot '
        keychar = "'";
        addChar(keychar);
    } else if (key == 8) { // backspace
        if (e.preventDefault) {
            e.preventDefault();
        }
        deleteChar();
    } else if (key === 27) { // escape
        shift = '0';
        showoptions(0);
        shownotations(0);
        showbasecurrency(0);
        info('');
        showentry(0);
        display();
    }
}

function chkkey(e) { //is triggered when 'onkeypress' **************************
    var key, keychar;
    key = getkey(e);
    var n, s;
    var f = document.rpncal;
    window.getSelection().removeAllRanges(); //unselects all
    f.stack0.focus();
    if (key == 17) ctrl = true; //reset when key_up
    if (key === null) return true;
    keychar = String.fromCharCode(key).toLowerCase();
    // console.log("chkkey: " + key + ' ' + keychar + ' ' + ctrl);
    if (key1 == 38) keychar = 'arrowup';
    if (key1 == 40) keychar = 'arrowdown';
    if (key === 13) keychar = 'enter';
    // uncomment next line to show pressed keys for instruction
    // showpressedkey(keychar);
    if (shift == 'f') { //financial ********************************************
        shift = '0';
        if (keychar == m[9][0][0]) {
            cagr();
        } else if (keychar == m[9][1][0]) {
            console.log("chkkey pv: " + keychar);
            presentvalue();
        } else if (keychar == m[9][2][0]) {
            futurevalue();
        } else if (keychar == m[9][3][0]) {
            periodscagr();
        } else if (keychar == m[9][10][0]) {
            principal();
        } else if (keychar == m[9][11][0]) {
            payment();
        } else if (keychar == m[9][12][0]) {
            periods();
        } else if (keychar == m[9][13][0]) {
            interest();
        } else if (keychar == m[9][15][0]) {
            principalpart();
        } else if (keychar == m[9][16][0]) {
            interestpart();
        } else if (keychar == m[9][17][0]) {
            remainingprincipal();
        } else if (keychar == m[9][18][0]) {
            totalinterest();
        } else if (keychar == m[9][19][0]) {
            totalpayments();
        } else if (keychar == m[9][20][0]) {
            npv();
        } else if (keychar == m[9][21][0]) {
            irr();
        } else if (keychar == m[9][9][0]) {
            shift = 'fe';
            showmenu('finentry');
            showentry(1);
        } else {
            info('');
            display();
        }
    } else if (shift == 'fe') { // financial data entry ************************
        //shiftt = false;
        if (("0123456789,.").indexOf(keychar) > -1) {
            entry += keychar;
            showentry(1);
        } else if (("rpqfnmtx").indexOf(keychar) > -1) {
            dataentry(keychar);
            entry = '';
            showentry(1);
            //showmenu('finentry');
        } else if (keychar == 's') {
            showmenu("memx");
            showentry(0);
        } else if (keychar == 'z') {
            shift = 'f';
            showmenu('financial');
            showentry(0);
        } else {
            shift = 'f';
            showmenu('financial');
            showentry(0);
        }
    } else if (shift == 't') { //statistics ************************************
        shift = '0';
        if (keychar == "p") {
            enterop("nPr", "ifix");
        } else if (keychar == "c") {
            enterop("nCr", "ifix");
        } else if (keychar == "r") {
            random();
        } else if (keychar == "g") {
            enterop("!", "pfix");
        } else if (keychar == "!") {
            enterop("!", "pfix");
        } else if (keychar == "a") {
            avg();
        } else if (keychar == "s") {
            sum();
        } else if (keychar == "z") {
            sumsquares();
        } else if (keychar == "d") {
            dev();
        } else if (keychar == "t") {
            today();
        } else {
            display();
        }
    } else if (shift == 'l') { //lastanswers ***********************************
        shift = '0';
        n = ml.indexOf(keychar);
        if (n > -1) {
            larecall(n);
        } else {
            info('');
            display();
        }
    } else if (shift == 'h1' || shift == 'h2' || shift == 'h3') { //help *******
        shift = 'h';
        showmenu("help");
    } else if (shift == 'h') { //help ******************************************
        shift = '0';
        if (keychar == "h") {
            scalchelp();
            // window.open("http://www.stack-calculator.com", "_blank", "width=1000,height=800,top=50,left=50");
        } else if (keychar == "b") {
            shift = 'h1';
            showmenu("help1");
        } else if (keychar == "f") {
            shift = 'h2';
            showmenu("help2");
        } else if (keychar == "d") {
            shift = 'h3';
            showmenu("help3");
        } else {
            info('');
            display();
        }
    } else if (shift == 'a') { //algebra ***************************************
        shift = '0';
        if (keychar == "q") {
            enterop("^q", "pfix");
        } else if (keychar == "e") {
            enterop("exp", "pfix");
        } else if (keychar == "r") {
            enterop("^r", "pfix");
        } else if (keychar == "n") {
            enterop("ln", "pfix");
        } else if (keychar == "l") {
            enterop("log", "pfix");
        } else if (keychar == "s") {
            enterop("sin", "pfix");
        } else if (keychar == "c") {
            enterop("cos", "pfix");
        } else if (keychar == "t") {
            enterop("tan", "pfix");
        } else if (keychar == "i") {
            enterop("asin", "pfix");
        } else if (keychar == "o") {
            enterop("acos", "pfix");
        } else if (keychar == "a") {
            enterop("atan", "pfix");
        } else if (keychar == "x") {
            enterop("sinh", "pfix");
        } else if (keychar == "y") {
            enterop("cosh", "pfix");
        } else if (keychar == "z") {
            enterop("tanh", "pfix");
        } else if (keychar == "m" || keychar == "%") {
            enterop("%", "ifix");
        } else if (keychar == "g") {
            enterop("gcd", "ifix");
        } else if (keychar == "h") {
            enterop("lcm", "ifix");
        } else if (keychar == "u") {
            enterop("y+ix", "ifix");
        } else if (keychar == "v") {
            enterop("y<x", "ifix");
        } else if (keychar == "w") {
            enterop("conj", "pfix");
        } else {
            info('');
            display();
        }
    } else if (shift == 's') { //store in memory *******************************
        shift = '0';
        n = ml.indexOf(keychar);
        if (n > -1) {
            storemem(n);
        } else {
            info('');
            display();
        }
    } else if (shift == 'r') { //recall from memory ****************************
        shift = '0';
        n = ml.indexOf(keychar);
        if (n > -1) {
            recall(n);
        } else {
            info('');
            display();
        }
    } else if (shift == 'c') { //clear copy ************************************
        shift = '0';
        if (keychar == m[3][2][0]) {
            clrmem();
        } else if (keychar == m[3][0][0]) {
            cx();
        } else if (keychar == m[3][1][0]) {
            clrstack();
        } else if (keychar == m[3][3][0]) {
            clrla();
        } else if (keychar == m[3][4][0]) {
            clrstack();
            clrmem();
            clrla();
        } else if (keychar == m[3][10][0]) {
            copyToClipboard(stack[0].toString());
            display();
        } else if (keychar == m[3][11][0]) {
            getclipboard();
        } else {
            info('');
            display();
        }
    } else if (shift == 'not') { //notations ************************************
        if (("nfisemcxob\\rp").indexOf(keychar) > -1) {
            if (keychar == m[15][0][0]) { //normal
                storerecord("not", m[15][0][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][3][0]) { //scientific
                storerecord("not", m[15][3][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][4][0]) { //engineering
                store.not = m[15][4][2];
                storerecord("not", m[15][4][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][6][0]) { //hours, minutes
                store.rnd = (store.rnd < 3) ? 3 : store.rnd;
                storerecord("not", m[15][6][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][7][0]) { //hours, minutes, seconds
                store.rnd = (store.rnd < 4) ? 4 : store.rnd;
                storerecord("not", m[15][7][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][2][0]) { //integer
                storerecord("not", m[15][2][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][5][0]) { //fixed
                storerecord("not", m[15][5][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][1][0]) { //financial: fixed 2
                //rnd = 2;
                storerecord("not", m[15][1][2]);
                display();
                statusnot("fin");
            } else if (keychar == m[15][8][0]) { //hexadecimal
                storerecord("not", m[15][8][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][9][0]) { //octal
                storerecord("not", m[15][9][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][10][0]) { //binary
                storerecord("not", m[15][10][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][11][0]) { //fraction
                storerecord("not", m[15][11][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][12][0]) { //complex rectangular
                storerecord("not", m[15][12][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            } else if (keychar == m[15][13][0]) { //complex polar
                storerecord("not", m[15][13][2]);
                display();
                statusnot(store.not + " " + store.rnd);
            }
            shift = '0';
            shownotations(0);
        } else {
            if (!(keychar == 'arrowup' || keychar == 'arrowdown')) {
                shift = '0';
                display();
                shownotations(0);
            }
        }
        // shift = '0';
        // shownotations(0);
    } else if (shift == 'o') { //options ***************************************
        if (("drtpane,.").indexOf(keychar) > -1) {
            if (keychar == m[2][14][0]) { //decimal separator
                storerecord('comma', 'c');
                document.rpncal.status2.value = 'rate: ' + dpsep((100 * store.rate).toPrecision(3)).toString() + '%';
                display();
            } else if (keychar == m[2][15][0]) { //decimal separator
                storerecord('comma', 'd');
                document.rpncal.status2.value = 'rate: ' + dpsep((100 * store.rate).toPrecision(3)).toString() + '%';
                display();
            } else if (keychar == m[2][19][0]) { //RPN mode
                storerecord('rpnmode', 'rpn');
                rpnmodeon();
            } else if (keychar == m[2][20][0]) { //Stack mode
                storerecord('rpnmode', 'stack');
                rpnmodeoff();
            } else if (keychar == m[2][0][0]) { //English
                _lg = languages.us;
                storerecord('language', 'us');
                defineconstants();
                setFooter();
                info(_lg.language_set_to);
                display();
            } else if (keychar == m[2][1][0]) { //Dutch
                _lg = languages.nl;
                storerecord('language', 'nl');
                defineconstants();
                setFooter();
                info(_lg.language_set_to);
                display();
            } else if (keychar == m[2][16][0]) { //radian
                dgmode = '1';
                storerecord('deg', 'rad');
                statusangle(_lg.radian);
                display();
            } else if (keychar == m[2][17][0]) { //degrees
                dgmode = pi.div(180);
                storerecord('deg', 'deg');
                statusangle(_lg.degrees);
                display();
            } else if (keychar == m[2][13][0]) {
                if (store.thousandssep === 'on') {
                    storerecord('thousandssep', 'off');
                } else {
                    storerecord('thousandssep', 'on');
                }
                display();
            }
            shift = '0';
            showoptions(0);
            //			}
        } else {
            if (!(keychar == 'arrowup' || keychar == 'arrowdown')) {
                shift = '0';
                display();
                showoptions(0);
            }
        }
    } else if (shift == 'g') { //physical constants ****************************
        shift = '0';
        n = ml.indexOf(keychar);
        if (n > -1 && n < 23) {
            getconstant(n);
        } else {
            info('');
            display();
        }
    } else if (shift == 'v') { //convert units *********************************
        shift = '0';
        n = ml.indexOf(keychar);
        if (keychar == 'z') { //reverse
            shift = 'v';
            cvdir = (cvdir == 'l') ? 'r' : 'l';
            showmenu('convert');
        } else if (n > -1 && n < 13) {
            convert(n, cvdir);
            cvdir = 'r';
        } else if (n == 13) {
            if (cvdir == 'r') {
                enterop("F>C", "pfix");
            } else {
                enterop("C>F", "pfix");
            }
            cvdir = 'r';
        } else {
            info('');
            cvdir = 'r';
            display();
        }
    } else if (shift == 'x') { //exchange rates ********************************
        shift = '0';
        n = ml.indexOf(keychar);
        if (keychar == 'z') { //reverse
            shift = 'x';
            cvdir = (cvdir == 'l') ? 'r' : 'l';
            showmenu('xrates');
        } else if (keychar == 'y') {
            shift = 'bc';
            showbasecurrency(1);
            //shift='x';
            //showmenu('xrates');
        } else if (n > -1 && n < 30) {
            convertrate(n, cvdir);
            cvdir = 'r';
        } else {
            info('');
            cvdir = 'r';
            display();
        }
    } else if (shift == 'bc') { //set base currency ****************************
        shift = 'x';
        n = ml.indexOf(keychar);
        if (n > -1 && n < 30) {
            setbasecurrency(n);
            showbasecurrency(0);
            showmenu("xrates");
        } else {
            info('');
            showbasecurrency(0);
        }
    } else { //no shifts active ************************************************
        var s0 = stack[0].toString();
        // console.log("noshifts: " + keychar+' '+ctrl);
        if ((("0123456789.()e:\\").indexOf(keychar) > -1)) {
            addChar(keychar);
        } else if (keychar == "E") {
            addChar('e-');
        } else if (keychar == ",") {
            keychar = ".";
            addChar(keychar);
        } else if (keychar == "[") {
            keychar = "(";
            addChar(keychar);
        } else if (keychar == "]") {
            keychar = ")";
            addChar(keychar);
        } else if (keychar == ";") {
            keychar = ":";
            addChar(keychar);
        } else if (keychar == "<") {
            addChar(keychar);
        } else if (key == 32) { // space bar
            if (stack[0] == 'Error' || stack[0] == 'Infinity') {
                cx();
            } else {
                popStackdisplay();
            }
        } else if (key == 13 || keychar == '=') { // enter
            if (store.rpnmode == 'rpn') {
                enterx();
            } else {
                //--------------CHECK ------
                var stack0 = document.rpncal.stack0.value;
                var cpl = complex2dec(stack[0]); //separate re- and im-part
                if (stack0 === stack[0]) { //only new values if entry is given
                    stack[0] = cpl.re;
                    stack_im[0] = cpl.im;
                }
                stack[0] = hms2dec(stack[0]);
                stack[0] = imp2dec(stack[0]);
                stack[0] = frac2dec(stack[0]);
                //----------------------------------
                calculate();
            }
        } else if (keychar == "f") {
            if (!(computed || enterpressed) && (s0.substring(0, 2) == '0x')) {
            // if (!(computed || enterpressed) && s0.substring(0, 1) == "0" && s0.length == 1) {
                addChar(keychar);
            } else {
                shift = 'f';
                showmenu("financial");
            }
        } else if (keychar == "g") {
            shift = 'g';
            showmenu("constants");
        } else if (keychar == "l") {
            shift = 'l';
            showmenu("lastanswers");
        } else if (keychar == "h") {
            shift = 'h';
            showmenu("help");
        } else if (keychar == "a") {
            if (!(computed || enterpressed) && (s0.substring(0, 2) == '0x')) {
                addChar(keychar);
            } else {
                shift = 'a';
                showmenu("algebra");
            }
        } else if (keychar == "t") {
            shift = 't';
            showmenu("statistics");
        } else if (keychar == "s") {
            shift = 's';
            showmenu("memx");
        } else if (keychar == "r") {
            shift = 'r';
            showmenu("memx");
        } else if (keychar == "c" && !ctrl) { //no response on ctrl-c
            if (!(computed || enterpressed) && (s0.substring(0, 2) == '0x')) {
            // if (!(computed || enterpressed) && ((s0.substring(0, 1) == "0" &&
                    // s0.length == 1) || s0.substring(0, 2) == '0x')) {
                addChar(keychar);
            } else {
                shift = 'c';
                showmenu("clear");
            }
        } else if (keychar == "z") {
            shift = 'not';
            shownotations(1);
        } else if (keychar == "o") {
            if (!(computed || enterpressed) && s0.substring(0, 1) == "0" && s0.length == 1) {
                addChar(keychar);
            } else {
                shift = 'o';
                showoptions(1);
            }
        } else if (keychar == "v" && !ctrl) { //no response on ctrl-v
            shift = 'v';
            showmenu("convert");
        } else if (keychar == "x") {
            if (!(computed || enterpressed) && s0.substring(0, 1) == "0" && s0.length == 1) {
                addChar(keychar);
            } else {
                shift = 'x';
                showmenu("xrates");
            }
        } else if (keychar == "!") {
            enterop("!", "pfix");
        } else if (keychar == "^" || keychar == "y") {
            enterop("^", "ifix");
        } else if (keychar == "d") { //drop
            if (!(computed || enterpressed) && s0.substring(0, 1) == "0" && s0.length == 1) {
                addChar(keychar);
            } else {
                cx();
            }
        } else if (keychar == "u") {
            undoall();
        } else if (keychar == "m") {
            storefree();
        } else if (keychar == "n") {
            // changeSign();
            enterop("*-1", "pfix");
        } else if (keychar == "w") {
            swapxy();
        } else if (keychar == "i") {
            if (!(computed || enterpressed) && stack[0].toString().substring(0, 1) === "(" &&
                stack[0].toString().indexOf(')') < 0) {
                addChar(keychar);
            } else {
                enterop("^-1", "pfix");
            }
        } else if (keychar == "-") {
            var x = stack[0].toString();
            var y = x.replace('e-', 'E');
            if (x.substring(x.length - 1, x.length) == "e" && x.substring(0, 1) != "0") { //negate if last digit is e (enter exponent) and not hex/oct/bin
                addChar(keychar);
            } else if (!(computed || enterpressed) && x.substring(0, 1) === "(" && y.indexOf('+') < 0 &&
                (y.indexOf('-') < 0 || y.substring(0, 2) === '(-')) { //exception for first '-' in complex numbers
                addChar(keychar);
            } else {
                enterop("-", "ifix");
            }
        } else if (keychar == "+") {
            s = stack[0].toString();
            if (!(computed || enterpressed) && s.substring(0, 1) === "(" && s.indexOf('+') < 0 &&
                (s.indexOf('-') < 0 || s.substring(0, 2) === '(-')) { //exception for first '+' in complex numbers
                addChar(keychar);
            } else {
                enterop("+", "ifix");
            }
        } else if (keychar == "*") {
            enterop("*", "ifix");
        } else if (keychar == "q") {
            enterop("^q", "pfix");
        } else if (keychar == "/") {
            enterop("/", "ifix");
        } else if (keychar == "p") {
            pix();
        } else if (keychar == "b") { //0b.. -> binary input; 0x..b.. -> hex input
            if (!(computed || enterpressed) && ((s0.substring(0, 1) == "0" &&
                    s0.length == 1) || s0.substring(0, 2) == '0x')) {
                addChar(keychar);
            } else {
                callwindow();
            }
        } else if (keychar == "%") {
            enterop("%", "ifix");
        } else if (keychar == "k") {
            getlastx();
        } else if (keychar == "j") {
            changemode();
        }
    }
}
