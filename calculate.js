/*jshint eqeqeq:false, -W041, -W098 */

// uncomment scalc.js line 825 to show pressed keys for instruction

var version = '1.201'; //set for web-version; kit and ext get version number from package/manifest
var run_as = 'web'; //run as web-application (default: web), as chrome-extension (ext), as chrome-app (app) or as NodeWebkit-app (kit)
try {
    var gui = require('nw.gui');
    version = gui.App.manifest.version;
    run_as = 'kit';
} catch (e) {
    try {
        var manifest = chrome.runtime.getManifest(); //OK for ext
        run_as = manifest.name.slice(-3).toLowerCase(); //get last 3 characters of name (='ext')
        version = manifest.version;
    } catch (err) {
        //run_as = 'web';
    }
}
var _lg = languages.us; //refers to languages.js
var shift = '0'; //function keys
var cvdir = 'r'; //default conversion direction
var computed = true;
var enterpressed = false;
var dgmode = 1; // conversion factor rad/degrees; rad mode is default; =pi.div(180) for degrees
var entry = ''; //financial data entry value
var stack = new Array(1); // stack real part
var stack_im = new Array(1); //stack imaginary part
var opstack = new Array(1); //stack of operators
var hisstack = new Array(1); //stack of formulas
var hisopstack = new Array(1); //stack of last used operators
var store = { //global variables that are stored in localstorage
    rpnmode: 'stack', //stack or rpn
    rnd: 18, //number of decimals to be shown
    deg: 'rad',
    comma: 'd', //default dot instead of comma
    thousandssep: 'off',
    not: "norm", //notation
    rate: 0.06, //interest rate
    bcn: 0, //base currency number (USD)
    pv: 100, //present value for cagr
    prv: 100, //principal value for annuity
    fv: 200, //future value for cagr
    pmt: 12, //payment for annuity
    xpmt: 1, //payment x for annuity
    nper: 12, //number of periods cagr
    npr: 12, //number of periods annuity
    language: 'us' //gui language
};
var rnd_calc = store.rnd + 10; //# of decimals to calculate with
Decimal.config({
    precision: rnd_calc + 4,
    errors: false
});
var pi = Decimal(-1).acos();
var ml = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't'
]; //used in menu
var key1; //needed for arrows to work in options menu
var lastx = { //last added value
    re: '',
    im: ''
};
var ctrl = false; //needed to detect control-key
var undoreg1 = new Array(1); //undo register for stack
var undoreg2 = new Array(1); //undo register for hisstack
var undoreg3 = new Array(1); //undo register for hisopstack
var undoreg4 = new Array(1); //undo register for hisopstack
var undoreg5 = new Array(1); //undo register for stack_im
var lastanswers = new Array(1);
var lastanswers_im = new Array(1);
var memx = new Array(1);
var memx_im = new Array(1);
var sp = 0; //stack pointer defines which stacks are visible
var m = new Array(25); //array with menu items
for (var i = 0; i < m.length; ++i)
    m[i] = new Array(1);

function analytics() {
    if (run_as != 'app') { //analytics not permitted in app
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-3587690-5']);
        _gaq.push(['_trackPageview']);
        (function() {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = 'https://ssl.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    }
}

function thisYear() { // for copyright statement
    var d = new Date();
    var n = d.getFullYear();
    return n;
}

function scalchelp() { //open website
    var win;
    try { // as kit
        var gui = require('nw.gui');
        win = gui.Window.open('http://www.stack-calculator.com', {
            position: 'center',
            width: 1000,
            height: 800
        });
    } catch (err) {
        win = window.open("http://www.stack-calculator.com", "_blank");
        win.focus();
    }
}

function getLocalStorage() {
    var st = localStorage.getItem('st01');
    st = JSON.parse(st);
    for (var key in st) {
        if (st[key]) store[key] = st[key];
    }
    if (store.language === 'nl') {
        _lg = languages.nl;
    } else {
        _lg = languages.us;
    }
}

// function getChromeStorage() {
//     chrome.storage.local.get(store[0], function(result) {
//         //console.log(JSON.stringify(result));
//         for (var key in result) {
//             if (result[key]) store[key] = result[key];
//             //console.log(key+' '+store[key])
//         }
//         applyStorage();
//     });
// }

function applyStorage() { //set memories, stacks, etc
    var i, n, f, r, x;
    f = document.rpncal;
    if (store.rnd) {
        rnd_calc = store.rnd + 10;
    }
    f.status1.value = store.not + " " + store.rnd;
    if (store.deg == 'deg') {
        dgmode = pi.div(180);
        f.status0.value = _lg.degrees;
    } else {
        dgmode = 1;
        f.status0.value = _lg.radian;
    }
    for (i = 0; i < 30; i++) { // initial setting of memories
        lastanswers[i] = [''];
        lastanswers_im[i] = [''];
        memx[i] = [''];
        memx_im[i] = [''];
    }
    r = store.lastanswers;
    if (r) {
        for (i = 0; i < 30; i++) { //30 la's
            n = r.search(/,/);
            if (n !== 0) {
                lastanswers[i] = r.substring(0, n);
            }
            r = r.substring(n + 1, r.length);
            if (n < 0) {
                break;
            }
        }
    }
    r = store.lastanswers_im;
    if (r) {
        for (i = 0; i < 30; i++) { //30 la's
            n = r.search(/,/);
            if (n !== 0) {
                lastanswers_im[i] = r.substring(0, n);
            }
            r = r.substring(n + 1, r.length);
            if (n < 0) {
                break;
            }
        }
    }
    for (i = 0; i < 30; i++) {
        memx[i] = [''];
        memx_im[i] = [''];
    }
    r = store.memx;
    if (r) {
        for (i = 0; i < 30; i++) { //30 mem's
            n = r.search(/,/);
            if (n !== 0) {
                memx[i] = r.substring(0, n);
            }
            r = r.substring(n + 1, r.length);
            if (n < 0) {
                break;
            }
        }
    }
    r = store.memx_im;
    if (r) {
        for (i = 0; i < 30; i++) { //30 mem's
            n = r.search(/,/);
            if (n !== 0) {
                memx_im[i] = r.substring(0, n);
            }
            r = r.substring(n + 1, r.length);
            if (n < 0) {
                break;
            }
        }
    }
    r = store.stackstr;
    if (r) {
        for (i = 0; i < 20; i++) { //read first 20 stack registers
            n = r.search(/,/);
            x = r.substring(0, n);
            if (n !== 0 && x.length > 0) stack[i] = x;
            r = r.substring(n + 1, r.length);
            if (n < 0) {
                break;
            }
        }
    }
    r = store.stack_imstr;
    if (r) {
        for (i = 0; i < 20; i++) { //read first 20 stack registers
            n = r.search(/,/);
            x = r.substring(0, n);
            if (n !== 0 && x.length > 0) stack_im[i] = x;
            r = r.substring(n + 1, r.length);
            if (n < 0) {
                break;
            }
        }
    }
    r = store.opstackstr;
    if (r) {
        for (i = 0; i < 20; i++) { //read first 20 stack registers
            n = r.search(/,/);
            if (n !== 0) opstack[i] = r.substring(0, n);
            r = r.substring(n + 1, r.length);
            if (n < 0) {
                break;
            }
        }
    }
    r = store.hisstackstr;
    if (r) {
        for (i = 0; i < 20; i++) {
            n = r.search(/,/);
            if (n !== 0) hisstack[i] = r.substring(0, n);
            r = r.substring(n + 1, r.length);
            if (n < 0) {
                break;
            }
        }
    }
    r = store.hisopstackstr;
    if (r) {
        for (i = 0; i < 20; i++) {
            n = r.search(/,/);
            if (n !== 0) hisopstack[i] = r.substring(0, n);
            r = r.substring(n + 1, r.length);
            if (n < 0) {
                break;
            }
        }
    }
    m[10][1] = ['&#160', store.rate, _lg.rate];
    m[10][11] = ['&#160', store.rate, _lg.rate];
    m[10][21] = ['&#160', store.rate, _lg.rate];
    f.status2.value = _lg.rate + ': ' + dpsep((100 * store.rate).toPrecision(3)).toString() + '%';
    m[10][3] = ['&#160', store.pv, 'pv'];
    m[10][13] = ['&#160', store.prv, 'prv'];
    m[10][5] = ['&#160', store.fv, 'fv'];
    m[10][7] = ['&#160', store.nper, 'nper'];
    m[10][15] = ['&#160', store.npr, 'npr'];
    m[10][17] = ['&#160', store.pmt, 'pmt'];
    m[10][19] = ['&#160', store.xpmt, 'xpmt'];
    if (store.rpnmode == 'stack') {
        rpnmodeoff();
    } else {
        rpnmodeon();
    }
    display(); //chrome storage is asynchronous, so new display needed
}

function setFooter() { // status bar + footer change if language changes
    var f = document.rpncal;
    f.status0.value = (store.deg == 'deg') ? _lg.degrees : _lg.radian;
    f.status2.value = _lg.rate + ': ' + dpsep((100 * store.rate).toPrecision(3)).toString() + '%';
    document.getElementById("version").innerHTML = version + ' ' + run_as;
    document.getElementById("thisYear").innerHTML = thisYear();
    document.getElementById("byTitle").innerHTML = _lg.byTitle;
    document.getElementById("versionTitle").innerHTML = _lg.versionTitle;
}

function savestacks() {
    var str = "";
    str = stack.join(","); //all stacks in string
    str = str.replace(/NaN/g, ""); //skip empty ones
    str = str + ",";
    // if (str.length > 5) storerecord("stackstr", str); //no saving of values at init (records not yet retrieved)
    storerecord("stackstr", str);
    str = stack_im.join(","); //all stacks in string
    str = str.replace(/NaN/g, ""); //skip empty ones
    str = str + ",";
    // if (str.length > 5) storerecord("stack_imstr", str); //no saving of values at init (records not yet retrieved)
    storerecord("stack_imstr", str);
    str = hisstack.join(","); //all stacks in string
    str = str.replace(/NaN/g, ""); //skip empty ones
    str = str + ",";
    // if (str.length > 5) storerecord("hisstackstr", str);
    storerecord("hisstackstr", str);
    str = hisopstack.join(","); //all stacks in string
    str = str.replace(/NaN/g, ""); //skip empty ones
    str = str + ",";
    // if (str.length > 5) storerecord("hisopstackstr", str);
    storerecord("hisopstackstr", str);
}

function changemode() { //from rpnmode to standard mode vv
    if (store.rpnmode == 'rpn') {
        // rpnmode = 'stack';
        rpnmodeoff();
    } else {
        // rpnmode = 'rpn';
        rpnmodeon();
    }
}

function round(x) { //remove trailing zeros
    x = x.toPrecision(15);
    var third = "";
    var ePos = x.indexOf("e");
    if (ePos > -1) {
        third = x.substring(ePos, x.length);
        x = x.substring(0, ePos);
    }
    var decPos = x.indexOf(".");
    if (decPos > -1) {
        var first = x.substring(0, decPos);
        var second = x.substring(decPos, x.length);
        while (second.charAt(second.length - 1) == "0") {
            second = second.substring(0, second.length - 1);
        }
        if (second.length > 1) {
            return first + second + third;
        } else {
            return first + third;
        }
    } else {
        return x;
    }
}

function round3(s) { //round numbers to show in lastanswers view
    if (isNaN(s) || s == '') {
        return '';
    } else {
        s = Decimal(s).toString();
        if (s.length > 18) {
            var i = s.indexOf('e');
            if (i > -1) {
                var j = s.length - i;
                //s=s[:18-j]+'..'+s[-j:];
                s = s.slice(0, 16 - j) + '..' + s.slice(-j, s.length);
            } else {
                s = s.slice(0, 18);
            }
        }
        s = (store.comma == 'c' ? s.replace('.', ',') : s);
        return s;
    }
}

function round4(re, im) { //round complex numbers to show in lastanswers view
    var ret = '';
    var n, j;
    if (isNaN(re) || re == '') {
        ret += '';
    } else {
        re = Decimal(re).toString();
        if (re.length > 9) {
            n = re.indexOf('e');
            if (n > -1) {
                j = re.length - n;
                re = re.slice(0, 7 - j) + '..' + re.slice(-j, re.length);
            } else {
                re = re.slice(0, 9);
            }
        }
        ret += re;
    }
    if (isNaN(im) || im == '' || im === '0') {
        ret += '';
    } else {
        im = Decimal(im).toString();
        if (im.length > 9) {
            n = im.indexOf('e');
            if (n > -1) {
                j = im.length - n;
                im = im.slice(0, 7 - j) + '..' + im.slice(-j, im.length);
            } else {
                im = im.slice(0, 9);
            }
        }
        im = (im.substring(0, 1) === '-') ? im : '+' + im;
        ret += im + 'i';
    }
    ret = (store.comma == 'c' ? ret.replace('.', ',') : ret);
    return ret;
}

function fillhisstack0() {
    hisstack[0] = roundhis(stack[0]);
    var im = stack_im[0].toString();
    if (im !== '' && im != '0') { //if complex
        if (im.substring(0, 1) == '-') {
            hisstack[0] = '(' + hisstack[0] + roundhis(im) + 'i)';
        } else {
            hisstack[0] = '(' + hisstack[0] + '+' + roundhis(im) + 'i)';
        }
    }
}

function roundhis(s) { //round numbers to show in hisstack
    var t = Decimal(s);
    var r;
    if (!(t.isNaN())) {
        t = t.toSD(6);
        if (t.abs().gte(10000) || t.abs().lt(0.1)) {
            r = t.toExponential(1).toString(); //scientific notation
        } else {
            if (t.lt(0)) {
                r = t.toString().slice(0, 5);
            } else {
                r = t.toString().slice(0, 4);
            }
            if (r.slice(-3) == '.00') { //don't let it end with .0
                r = r.slice(0, -3);
            } else if (r.slice(-2) == '.0') { //don't let it end with .0
                r = r.slice(0, -2);
            } else if (r.slice(-1) == '.') { //or with .
                r = r.slice(0, -1);
            }
        }
    } else {
        r = s;
    }
    return r;
}

function makehisstack(o) { //creates history-line just before calculation
    var line = "";
    if (hisstack[0] == "" && sp == 0) {
        fillhisstack0();
    }
    var his0 = hisstack[0]; //stackpointer sp=0 in standard position
    var his1 = hisstack[1];
    var hisop0 = hisopstack[0];
    var hisop1 = hisopstack[1];

    if (o == "+") {
        if (hisop1 == "-") {
            line += "(" + his1 + ")" + o; //first part between () if + follows -
        } else {
            line += his1 + o;
        }
        line += his0; //no brackets
    } else if (o == "-") {
        if (hisop1 == "-") {
            line += "(" + his1 + ")" + o; //first part between () if - follows -
        } else {
            line += his1 + o;
        }
        if (hisop0 == "-" || hisop0 == "+") {
            line += "(" + his0 + ")"; //second part between () if - precedes -,+
        } else {
            line += his0;
        }
    } else if (o == "*") {
        if (opValue(o) > opValue(hisop1) || hisop1 == "/") {
            line += "(" + his1 + ")" + o; //first part between () if * follows +,- or /
        } else {
            line += his1 + o;
        }
        if (hisop0 !== "" && opValue(o) > opValue(hisop0)) {
            line += "(" + his0 + ")"; //second part between () if * precedes + or -
        } else {
            line += his0;
        }
    } else if (o == "/" || o == '%') {
        if (opValue(o) > opValue(hisop1) || hisop1 == "/") {
            line += "(" + his1 + ")" + o; //first part between () if / follows +,- or /
        } else {
            line += his1 + o;
        }
        if (hisop0 !== "" && opValue(o) >= opValue(hisop0)) {
            line += "(" + his0 + ")"; //second part between () if / precedes +,-,/ or *
        } else {
            line += his0;
        }
    } else if (o == "^" || o == "lcm" || o == "gcd" || o == "nPr" || o == "nCr" || o == "rndn") {
        if (opValue(o) >= opValue(hisop1)) {
            line += "(" + his1 + ")" + o; //first part between () if operator follows lower or equal order operator
        } else {
            line += his1 + o;
        }
        if (hisop0 !== "" && opValue(o) >= opValue(hisop0)) {
            line += "(" + his0 + ")"; //second part between () if operator precedes lower or equal order operator
        } else {
            line += his0;
        }
    } else if (o == "^-1") {
        if (hisop0 == "" && opValue(o) >= opValue(hisop0)) {
            line += "1/(" + his0 + ")"; //in case there was no previous calculation
        } else {
            line += "1/" + his0;
        }
    } else if (o == "^q" || o == "!") {
        if (hisop0 == "") {
            line += his0 + o; //in case there was no previous calculation
        } else {
            line += "(" + his0 + ")" + o;
        }
    } else if (o == "*-1") {
        if (opValue(hisop0) == 2 && his0.substring(0, 2) != "-(") { //after + or - with exception for -(a+b)
            line += "-(" + his0 + ")";
        } else if (opValue(hisop0) == 2 && his0.substring(0, 2) == "-(") { //after + or - and -(a+b)
            line += his0.substring(2, his0.length - 1);
        } else { //all other cases: flip minus sign
            if (his0.substring(0, 1) == "-") {
                line += his0.substring(1, his0.length);
            } else {
                line += "-" + his0;
            }
        }
    } else if (o == "npv" || o == "irr" || o == 'pv' || o == 'prv' || o == 'fv' || o == 'nper' || o == 'npr' || o == 'cagr' || o == 'pmt' || o == 'rate' || o == 'prc' || o == 'i%' || o == 'avg' || o == 'sum' || o == 'sum2' || o == 'dev' || o == 'pprt' || o == 'iprt' || o == 'rbal' || o == 'tint' || o == 'tpmt') {
        line += o + "()";
    } else if (o == "^r") { //is changed in root symbol in dpsep()
        if (hisop0 !== "" && opValue(o) >= opValue(hisop0)) {
            line += o + "(" + his0 + ")"; //second part between () if operator precedes lower or equal order operator
        } else {
            line += o + his0;
        }
    } else if (o == "y+ix" || o === 'y<x') {
        line += his0; // nothing
    } else { //operators like sin
        line += o + "(" + his0 + ")";
    }
    hisstack[0] = line;
    if (o != "*-1") hisopstack[0] = o; //changesign not interpreted as new operator
    //        console.log(hisstack[0]);
}

function opValue(n) { //relative order of operation
    if (n == "+" || n == "-") return 2;
    else if (n == "*" || n == "/" || n == '^-1') return 4;
    else if (n == "^") return 6;
    else if (n == "%" || n == "lcm" || n == "gcd" || n == "nPr" || n == "nCr" || n == "rndn") return 1;
    else return 8;
}

function dpsep(s) {
    if (s == undefined) s = '';
    s = s.toString();
    s = s.replace(/gpi/g, '\u03C0');
    s = s.replace(/\^q/g, '\u00B2');
    s = s.replace(/\^r/g, '\u221A');
    s = s.replace(/theta/g, '\u03B8');
    s = s.replace(/\*/g, '\u2217');
    //if (comma!=0){
    if (store.comma == 'c') {
        s = s.replace(/,/g, '');
        s = s.replace(/\./g, ',');
    }
    return s;
}

function formatoutput(s) {
    var t;
    var not = store.not;
    s = (s === undefined) ? '' : s;
    // console.log("formatoutput s: " + s);
    s = s.toString();
    var n = s.search(/\./);
    if (store.comma == 'c') {
        s = s.replace(/\./g, ",");
    }
    if (store.thousandssep === 'on' && s.indexOf('e') < 0 && not != 'h:m:s' && not != 'h:m' &&
        not != 'frac' && not != 'complex' && not != 'polar' && s != 'Infinity' &&
        s != '-Infinity' && s != 'Error') {
        var thssep = (store.comma != 'c') ? "," : ".";
        var m = 1; //default string has decimal point
        var neg = "";
        if (s.substring(0, 1) == "-") {
            s = s.substring(1, s.length);
            neg = "-";
            n -= 1;
        }
        if (n < 0) {
            n = s.length;
            m = -1;
        } //string is integer
        //alert(n);
        var x = Math.floor(n / 3);
        var pos = n % 3;
        t = s.substring(0, pos);
        for (i = 0; i < x; i++) {
            if (!(pos == 0 && i == 0)) t += thssep;
            t += s.substring(pos + 3 * i, pos + 3 * i + 3);
        }
        t = neg + t;
        if (m > 0) t += s.substring(n, s.length);
    } else t = s;
    var i = t.indexOf('e+0'); //don't display e+0 or e-0
    var j = t.indexOf('e-0');
    if (i > 0) t = t.slice(0, i);
    if (j > 0) t = t.slice(0, j);
    return t;
}

function toEng(s) { //engineering notation
    var pfix = ['yocto', 'zepto', 'atto', 'femto', 'pico', 'nano', 'micro', 'milli', '', 'kilo', 'mega', 'giga', 'tera', 'peta', 'exa', 'zetta', 'yotta'];
    var symb = ['y', 'z', 'a', 'f', 'p', 'n', '\u03BC', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    var t = Decimal(s).toExponential().toString();
    var i = t.indexOf('e'); //index of 'e'
    var exp = t.slice(i + 1, t.length); //exponent
    var man = t.slice(0, i); //mantisse
    var f = parseInt(exp) % 3; //correction factor
    f = (f < 0 ? f + 3 : f);
    man = Decimal(man).times(Decimal('10').pow(f));
    exp = parseInt(exp) - f;
    var j = (exp + 24) / 3; //index for prefixes
    exp = (exp < 0) ? exp.toString() : '+' + exp.toString();
    var r = man + 'e' + exp;
    r = (j < 0 || j > 16) ? r : r + '  ' + symb[j] + ' (' + pfix[j] + ')';
    return r;
}

function toHms(s) { //display hours:min:sec notation
    var sc, hr, mn;
    s = s.toString();
    var i = s.indexOf('.'); //index of '.'
    if (i > -1) { //convert fraction hours to minutes
        hr = s.slice(0, i); //hours
        hr = (hr.length < 1 ? '0' : hr);
        mn = Decimal('0.' + s.slice(i + 1, s.length)).times(60).toString(); //minutes
        var j = mn.indexOf('.'); //index of '.'
        if (j > -1) { //convert fraction minutes to seconds
            var t = Decimal(10).pow(store.rnd - 4);
            sc = Decimal('0.' + mn.slice(j + 1, mn.length)).times(60).times(t).round().div(t).toString(); //seconds
            if (Math.floor(parseFloat(sc)) < 10 && sc != '00') { //get 2 digits
                sc = '0' + sc;
            }
            mn = mn.slice(0, j);
        } else { //no fraction minutes
            sc = '00';
        }
        mn = (mn.length < 2 ? '0' + mn : mn);
    } else { //no fraction hours
        hr = s;
        mn = '00';
        sc = '00';
    }
    var r = hr + ':' + mn + ':' + sc;
    return r;
}

function toHm(s) { //display hours:min notation
    var hr, mn;
    s = s.toString();
    var i = s.indexOf('.'); //index of '.'
    if (i > -1) { //convert fraction hours to minutes
        hr = s.slice(0, i); //hours
        hr = (hr.length < 1 ? '0' : hr);
        var t = Decimal(10).pow(store.rnd - 3);
        mn = Decimal('0.' + s.slice(i + 1, s.length)).times(60).times(t).round().div(t).toString(); //seconds
        if (Math.floor(parseFloat(mn)) < 10) {
            mn = '0' + mn;
        }
    } else { //no fraction hours
        hr = s;
        mn = '00';
    }
    var r = hr + ':' + mn;
    return r;
}

function toFrac(s) { //display fraction
    var r;
    var max_den; //max_denominator value
    max_den = new Decimal(10).pow(store.rnd);
    r = Decimal(s).toFraction(max_den).toString();
    r = r.replace(",", "\\");
    return r;
}

function toComplex(re, im) {
    // to decide:
    // show im-part if zero?
    // complex number between brackets?
    if (im === undefined || im === '') im = '0';
    if (re === undefined || re === '') re = '0';
    re = Decimal(re);
    im = Decimal(im);
    // kill rounding errors by comparing re- and im-part of number
    var p = Decimal.precision;
    Decimal.config({
        precision: p + 4
    });
    if (!im.isZero()) {
        if (re.div(im).abs().lt(Decimal(10).pow(Decimal(p).plus(2).neg()))) {
            re = Decimal(0);
        }
    }
    if (!re.isZero()) {
        if (im.div(re).abs().lt(Decimal(10).pow(Decimal(p).plus(2).neg()))) {
            im = Decimal(0);
        }
    }
    Decimal.config({
        precision: p
    });
    var s = '(' + re.times(1);
    s += (im.isNeg()) ? ' - ' : ' + ';
    s += im.abs().times(1);
    s += 'i)';
    return s;
}

function toPolar(re, im) {
    if (im === undefined || im === '') im = '0';
    if (re === undefined || re === '') re = '0';
    re = Decimal(re);
    im = Decimal(im);
    var phi;
    // kill rounding errors by comparing re- and im-part of number
    var p = Decimal.precision;
    Decimal.config({
        precision: p + 4
    });
    var r = Decimal.hypot(re, im);
    if (r.isZero()) {
        phi = Decimal(0);
    } else {
        phi = Decimal.atan2(im, re).div(dgmode);
        if (phi.div(r).abs().lt(Decimal(10).pow(Decimal(p).plus(2).neg()))) {
            phi = Decimal(0);
        }
    }
    Decimal.config({
        precision: p
    });
    r = Decimal(r).times(1);
    phi = Decimal(phi).times(1);
    // var s = r + ' \u2220 ' + phi;
    var s = r + ' ∠ ' + phi;
    return s;
}

function recall(n) {
    fillundostack();
    if (!(isNaN(memx[n]) || memx[n] == '')) {
        if (store.rpnmode == 'rpn') pushStack();
        stack[0] = memx[n];
        // if (!(isNaN(memx_im[n]) || memx_im[n] == '')) {
        if (isNaN(memx_im[n]) || memx_im[n] == '') {
            stack_im[0] = '';
        } else {
            stack_im[0] = memx_im[n];
        }
        fillhisstack0();
        hisopstack[0] = '';
        display();
        info('memory ' + n);
        computed = true;
    }
    showmenu("start");
}

function larecall(n) {
    fillundostack();
    if (!(isNaN(lastanswers[n]) || lastanswers[n] == '')) {
        if (store.rpnmode == 'rpn') pushStack();
        stack[0] = lastanswers[n];
        if ((isNaN(lastanswers_im[n]) || lastanswers_im[n] == '')) {
            stack_im[0] = '';
        } else {
            stack_im[0] = lastanswers_im[n];
        }
        // hisstack[0] = roundhis(stack[0]);
        fillhisstack0();
        hisopstack[0] = '';
        display();
        info('lastanswer ' + n);
        computed = true;
    }
    showmenu("start");
}

function clrmem() {
    memx = [];
    memx_im = [];
    var memstr = memx.join(","); //all memories in string
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("memx", memstr);
    memstr = memx_im.join(","); //all memories in string
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("memx_im", memstr);
    showmenu("start");
    display();
    info(_lg.memory_cleared);
    computed = true;
}

function clrla() {
    lastanswers = [];
    lastanswers_im = [];
    var memstr = lastanswers.join(",");
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("lastanswers", memstr);
    memstr = lastanswers_im.join(",");
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("lastanswers_im", memstr);
    showmenu("start");
    display();
    info(_lg.lastanswers_cleared);
    computed = true;
}

function storemem(n) {
    var memstr = "";
    memx[n] = Decimal(stack[0]).toString();
    memx_im[n] = Decimal(stack_im[0]).toString();
    memstr = memx.join(","); //all memories in string
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("memx", memstr);
    memstr = memx_im.join(","); //all memories in string
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("memx_im", memstr);
    showmenu("start");
    info(_lg.stored_in_memory + n);
    computed = true;
}

function storefree() {
    for (var n = 0; n < 30; n++) {
        if (isNaN(memx[n]) || memx[n] == "") {
            memx[n] = Decimal(stack[0]).toString();
            //memx_im[n] = Decimal(stack_im[0]).toString();
            break;
        }
    }
    var memstr = memx.join(","); //all memories in string
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("memx", memstr);
    memstr = memx_im.join(","); //all memories in string
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("memx_im", memstr);
    computed = true;
    info(_lg.stored_in_memory + n);
}

function storelastanswer() {
    for (var n = 30; n > 0; n--) {
        lastanswers[n] = lastanswers[n - 1];
        lastanswers_im[n] = lastanswers_im[n - 1];
    }
    if (!isNaN(stack[0]) && stack[0] !== '') lastanswers[0] = Decimal(stack[0]).toString();
    if (!isNaN(stack_im[0]) && stack_im[0] !== '') lastanswers_im[0] = Decimal(stack_im[0]).toString();
    var memstr = lastanswers.join(","); //all memories in string
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("lastanswers", memstr);
    memstr = lastanswers_im.join(","); //all memories in string
    memstr = memstr.replace(/NaN/g, ""); //skip emptie ones
    memstr = memstr + ",";
    storerecord("lastanswers_im", memstr);
}

function hms2dec(x) { //check if ':' is entered. In that case convert to decimal
    var s = x.toString();
    var i = s.indexOf(':'); //index of ':'
    var hr, mn;
    if (i > -1) {
        hr = (i == 0 ? '0' : s.slice(0, i)); //hours
        mn = s.slice(i + 1, s.length); //minutes
        var j = mn.indexOf(':'); //index of second ':'
        if (j > -1) {
            var sc = mn.slice(j + 1, mn.length);
            mn = (j == 0 ? '00' : mn.slice(0, j));
            s = Decimal(hr).plus(Decimal(mn).div(60)).plus(Decimal(sc).div(3600)).toString();
        } else {
            s = Decimal(hr).plus(Decimal(mn).div(60)).toString();
        }
    }
    return s;
}

function imp2dec(x) { //foot and inches to meters; check if '"' or "'" is entered. In that case convert to decimal
    var s = x.toString();
    var i = s.indexOf("'"); //index of "'"
    var ft, inch;
    if (i > -1) { //standard case: 3'4 means 3 foot + 4 inches
        ft = (i == 0 ? '0' : s.slice(0, i)); //foot
        ft = frac2dec(ft); //in case a fraction is used in ft
        inch = s.slice(i + 1, s.length); //inch
        inch = frac2dec(inch); //in case a fraction is used in inch
        inch = (inch == '') ? '0' : inch;
        var j = inch.indexOf("'"); //index of "'"
        if (j > -1) {
            if (j == 0) { //two succeeding '' : 3'' means 3 inches
                inch = ft;
                ft = '0';
            } else {
                inch = inch.slice(0, j); //in case user entered 3'4''
            }
        }
        s = (Decimal(ft).times(0.305)).plus(Decimal(inch).times(0.0254)).toString();
    }
    return s;
}

function frac2dec(x) { //fraction to decimal; fraction given by '\', e.g. 3\4
    var s = x.toString();
    var i = s.indexOf("\\"); //index of '\'
    var num, den; //numerator, denominator
    if (i > -1) {
        num = (i == 0 ? '0' : s.slice(0, i)); //numerator
        den = s.slice(i + 1, s.length); //denominator
        den = (den == '') ? '1' : den;
        s = Decimal(num).div(Decimal(den)).toString();
    }
    return s;
}

// date2dec not yet used
function date2dec(x) { //check if '\' is entered. In that case convert to #days since 1 Jan 1970
    var s = x.toString();
    var i = s.indexOf('\\'); //index of ':'
    var d = new Date();
    var dd, mm, yyyy;
    if (i > -1) {
        dd = (i == 0 ? '0' : s.slice(0, i)); //day
        mm = s.slice(i + 1, s.length); //month
        var j = mm.indexOf('\\'); //index of second '\'
        if (j > -1) {
            yyyy = mm.slice(j + 1, mm.length);
            yyyy = (yyyy.length == 2) ? '20' + yyyy : yyyy;
            dd = parseInt(dd);
            mm = parseInt(mm) - 1;
            yyyy = parseInt(yyyy);
            d.setFullYear(yyyy, mm, dd);
            s = Math.round(d.getTime() / (24 * 1000 * 3600));
            s = s.toString();
        } else { //only 1 '\'
            s = '';
        }
    }
    return s;
}

function complex2dec(z) { //split complex entry in re and im
    var s = z.toString();
    var i = s.indexOf('('); //index of '[', so complex rectangular
    var p = s.indexOf('<'); //index of '<', so complex polar
    var re, im, r, phi; //real and imaginary parts, radius, angle
    if (p > -1) {
        r = s.slice(0, p);
        phi = Decimal(s.slice(p + 1, s.length)).times(dgmode); //still has i at end
        re = Decimal(r).times(Decimal.cos(phi));
        im = Decimal(r).times(Decimal.sin(phi));
    } else if (i > -1) { // complex numbers start with [
        var j = s.indexOf(')'); //index of ']'
        if (j > -1) {
            s = s.slice(0, j); //skip ]
        }
        s = s.replace(/e-/gi, "E"); //no confusion with negative 10power
        j = s.indexOf('+');
        if (j > -1) {
            re = s.slice(1, j);
            im = s.slice(j + 1, s.length); //still has i at end
        } else {
            j = s.indexOf('-', 2); //first '-' doesn't count, e.g. (-1-3i)
            if (j > -1) {
                re = s.slice(1, j);
                im = s.slice(j, s.length); // negative sign included
                // console.log("im: " + im);
            } else { //no '+' or '-' in string, so only real or imaginary part
                j = s.indexOf('i');
                if (j > -1) {
                    re = '';
                    im = s.slice(1, j);
                } else {
                    re = s.slice(1, s.length);
                    im = '';
                }
            }
        }
        re = re.replace(/E/gi, "e-"); //recover
        im = im.replace(/E/gi, "e-"); //recover
        im = (im === '-i') ? '-1' : im;
        im = (im === 'i') ? '1' : im.replace('i', '');
    } else { //not a complex number
        re = s;
        im = ''; //check
    }
    return {
        re: re,
        im: im
    };
}

function calculate() { //dir is 1 in case of direct calculation
    try {
        stack[0] = (stack[0] == '') ? Decimal(0) : Decimal(stack[0]);
        stack_im[0] = (stack_im[0] == '') ? Decimal(0) : Decimal(stack_im[0]);
        stack[1] = (stack[1] == '') ? Decimal(0) : Decimal(stack[1]);
        stack_im[1] = (stack_im[1] == '') ? Decimal(0) : Decimal(stack_im[1]);
        //      stack[1] = (stack[1] == '') ? Decimal(0) : Decimal(stack[1]);
        var o;
        o = opstack[sp + 0]; //define active operator
        fillundostack();
        if (o != "" && o !== undefined) {
            //hisline();
            makehisstack(o);
            if (o == "-") {
                subtract();
            } else if (o == "+") {
                add();
            } else if (o == "*") {
                multiply();
            } else if (o == "/") {
                divide();
            } else if (o == "^") {
                powxy();
            } else if (o == "^-1") {
                onebyx();
            } else if (o == "^q") {
                square();
            } else if (o == "*-1") {
                changeSign();
            } else if (o == "^r") {
                sqrtx();
            } else if (o == "!") {
                factx();
            } else if (o == "sin") {
                sin();
            } else if (o == "cos") {
                cos();
            } else if (o == "tan") {
                tan();
            } else if (o == "asin") {
                asin();
            } else if (o == "acos") {
                acos();
            } else if (o == "atan") {
                atan();
            } else if (o == "sinh") {
                sinh();
            } else if (o == "cosh") {
                cosh();
            } else if (o == "tanh") {
                tanh();
            } else if (o == "exp") {
                exp();
            } else if (o == "ln") {
                ln();
            } else if (o == "log") {
                log();
            } else if (o == "%") {
                mod();
            } else if (o == "y+ix") {
                makeComplex();
            } else if (o == "y<x") {
                makePolar();
            } else if (o == "conj") {
                conjugate();
            } else if (o == "gcd") {
                gcd();
            } else if (o == "lcm") {
                lcm();
            } else if (o == "nPr") {
                nPr();
            } else if (o == "nCr") {
                nCr();
            } else if (o == "F>C") {
                converttemp('m');
            } else if (o == "C>F") {
                converttemp('M');
            }
            o = o.replace('<', '\u2220');
            popStack(1);
            info(o);
        }
    } catch (e) { //catch error message from decimal.js
        if (e instanceof Error && /DecimalError/.test(e.message)) {
            stack[0] = 'Error';
        }
    }
}

function enterx() { // the enter button in rpn-mode
    var cpl = complex2dec(stack[0]); //separate re- and im-part
    var x = document.rpncal.stack0.value;
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
    var entry = document.rpncal.stack0.value;
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

function pushStack() {
    if (stack[0] != '') stack[0] = stack[0].toString(); //make it nice looking (.3 -> 0.3)
    // if (stack[0] != '' && hisstack[0] == "") hisstack[0] = roundhis(stack[0]); //only required in stack mode
    if (stack[0] != '' && hisstack[0] == "") fillhisstack0(); //only required in stack mode
    stack.unshift(stack[0]); //push from start
    stack_im.unshift(stack_im[0]); //push from start
    opstack.unshift(opstack[0]); //push from start
    hisstack.unshift(hisstack[0]); //push from start
    hisopstack.unshift(hisopstack[0]); //push from start
    if (store.rpnmode == 'stack') {
        hisopstack[0] = "";
        hisstack[0] = "";
        stack[0] = "";
        stack_im[0] = "";
    }
}

function popStack(n) {
    if (n == 1) {
        var tmp1 = stack[0];
        var tmp2 = hisstack[0];
        var tmp3 = hisopstack[0];
        var tmp4 = stack_im[0];
        stack.shift(); //pop from start
        stack_im.shift(); //pop from start
        opstack.shift(); //pop from start
        hisstack.shift(); //pop from start
        hisopstack.shift(); //pop from start
        stack[0] = tmp1;
        hisstack[0] = tmp2;
        hisopstack[0] = tmp3;
        stack_im[0] = tmp4;
    }
    computed = true;
    enterpressed = false;
    storelastanswer();
    display();
}

function fillundostack() {
    lastx.re = stack[0];
    lastx.im = stack_im[0];
    var st1 = stack.slice();
    var st2 = hisstack.slice();
    var st3 = hisopstack.slice();
    var st4 = opstack.slice();
    var st5 = stack_im.slice();
    undoreg1.push(st1);
    undoreg2.push(st2);
    undoreg3.push(st3);
    undoreg4.push(st4);
    undoreg5.push(st5);
    if (undoreg1.length > 200) {
        undoreg1 = undoreg1.slice(-200);
        undoreg2 = undoreg2.slice(-200);
        undoreg3 = undoreg3.slice(-200);
        undoreg4 = undoreg4.slice(-200);
        undoreg5 = undoreg5.slice(-200);
    }
}

function undoall() {
    if (undoreg1.length > 1) {
        stack = undoreg1.pop();
        hisstack = undoreg2.pop();
        hisopstack = undoreg3.pop();
        opstack = undoreg4.pop();
        stack_im = undoreg5.pop();
    }
    display();
    computed = true;
}

function popStackdisplay() { // select yellow box
    if (store.rpnmode == 'rpn' && stack[sp + 1]) {
        fillundostack();
        pushStack();
        stack[0] = stack[sp + 1];
        stack_im[0] = stack_im[sp + 1];
        hisstack[0] = hisstack[sp + 1];
        hisopstack[0] = hisopstack[sp + 1];
    }
    sp = 0;
    display();
    computed = true;
}

function cx() { // clear x
    fillundostack();
    stack[0] = stack[1];
    stack_im[0] = stack_im[1];
    hisstack[0] = hisstack[1];
    hisopstack[0] = hisopstack[1];
    popStack(1);
    enterpressed = true;
    computed = true;
}

function clrstack() {
    fillundostack();
    stack = [];
    stack_im = [];
    opstack = [];
    hisstack = [];
    hisopstack = [];
    sp = 0;
    savestacks();
    display();
    computed = true;
}

function add() {
    stack[0] = Decimal(stack[1]).plus(stack[0]);
    stack_im[0] = Decimal(stack_im[1]).plus(stack_im[0]);
}

function subtract() {
    stack[0] = Decimal(stack[1]).minus(stack[0]);
    stack_im[0] = Decimal(stack_im[1]).minus(stack_im[0]);
}

function multiply() {
    // (a+bi)*(c+di)
    // console.log("multiply stack[0]: " + stack[0]+' '+stack_im[0]+' '+stack[1]+' '+stack_im[1]);
    var a = Decimal(stack[1]);
    var b = Decimal(stack_im[1]);
    var c = Decimal(stack[0]);
    var d = Decimal(stack_im[0]);
    stack[0] = a.times(c).minus(b.times(d));
    stack_im[0] = a.times(d).plus(b.times(c));
}

function divide() {
    // var x = Decimal(stack[0]);
    // if (x.isZero()) {
    //     stack[0] = Number.POSITIVE_INFINITY;
    // } else {
    //     stack[0] = Decimal(stack[1]).div(x).toString();
    // }
    // (a+bi)/(c+di)
    var a = Decimal(stack[1]);
    var b = Decimal(stack_im[1]);
    var c = Decimal(stack[0]);
    var d = Decimal(stack_im[0]);
    if (c.isZero() && d.isZero()) {
        stack[0] = Number.POSITIVE_INFINITY;
        stack_im[0] = Number.POSITIVE_INFINITY;
    } else {
        var n = c.pow(2).plus(d.pow(2));
        var t_re = c.times(a).plus(d.times(b));
        var t_im = b.times(c).minus(a.times(d));
        stack[0] = t_re.div(n);
        stack_im[0] = t_im.div(n);
    }
}

function powxy() {
    // z_1^z_2 = (a + bi)^(c + di)
    //         = exp((c + di) * log(a + bi)
    //         = pow(a^2 + b^2, (c + di) / 2) * exp(i(c + di)atan2(b, a))
    // =>...
    // Re = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * cos(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
    // Im = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * sin(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
    // =>...
    // Re = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * cos(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))
    // Im = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * sin(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))

    var a = Decimal(stack[1]);
    var b = Decimal(stack_im[1]);
    var c = Decimal(stack[0]);
    var d = Decimal(stack_im[0]);
    var loghypot = Decimal.hypot(a, b).ln();
    var arg = Decimal.atan2(b, a);
    var p1 = c.times(loghypot).minus(d.times(arg)).exp();
    var p2 = d.times(loghypot).plus(c.times(arg));
    stack[0] = p1.times(p2.cos());
    stack_im[0] = p1.times(p2.sin());
    // stack[0] = Decimal(stack[1]).pow(stack[0]);
}

function makeComplex() { // y,x to y+xi
    var a = Decimal(stack[1]);
    var b = Decimal(stack[0]);
    stack[0] = a;
    stack_im[0] = b;
    fillhisstack0();
    store.not = m[2][11][2]; //set notation to complex
    storerecord("not", m[15][11][2]);
    display();
    statusnot(store.not + " " + store.rnd);
}

function makePolar() { //y,x to y<x
    var r = Decimal(stack[1]);
    var phi = Decimal(stack[0]).times(dgmode);
    stack[0] = r.times(Decimal.cos(phi));
    stack_im[0] = r.times(Decimal.sin(phi));
    fillhisstack0();
    store.not = m[2][12][2]; // set notation to polar
    storerecord("not", m[15][12][2]);
    display();
    statusnot(store.not + " " + store.rnd);
}

function conjugate() { // y+xi to y-xi
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    stack[0] = a;
    stack_im[0] = b.neg();
}

function square() {
    var x_re = Decimal(stack[0]);
    var x_im = Decimal(stack_im[0]);
    stack[0] = x_re.pow(2).minus(x_im.pow(2));
    stack_im[0] = x_re.times(x_im).times(2);
    // stack[0] = Decimal(stack[0]).times(stack[0]);
}

function sqrt_int(re, im) { //(a+bi)^0,5
    var a = Decimal(re);
    var b = Decimal(im);
    var r = a.pow(2).plus(b.pow(2)).sqrt();
    var s = (b.lt(0)) ? Decimal(-1) : Decimal(1); //sign
    b = r.minus(a).div(2).sqrt().times(s);
    a = a.plus(r).div(2).sqrt();
    // stack[0] = Decimal(stack[0]).sqrt();
    return {
        re: a,
        im: b
    };
}

function sqrtx() { //(a+bi)^0,5
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    var sq = sqrt_int(a, b);
    stack[0] = sq.re;
    stack_im[0] = sq.im;
    // stack[0] = Decimal(stack[0]).sqrt();
}

function exp() { //exp(a+bi)
    var expa = Decimal(stack[0]).exp();
    var b = Decimal(stack_im[0]);
    // stack[0] = Decimal(stack[0]).exp();
    stack[0] = expa.times(b.cos());
    stack_im[0] = expa.times(b.sin());
}

function ln() { //ln(a+bi)
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    stack[0] = Decimal.hypot(a, b).ln();
    stack_im[0] = Decimal.atan2(b, a);

    // var x = Decimal(stack[0]);
    // stack[0] = x.ln();
}

function log() {
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    var l = Decimal.ln(10);
    stack[0] = Decimal.hypot(a, b).ln().div(l);
    stack_im[0] = Decimal.atan2(b, a).div(l);
    // stack[0] = Decimal(stack[0]).log();
}


function sin() {
    // sin(a+bi)=sin(a) * cosh(b) + icos(a) * sinh(b)
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    if (b.isZero()) {
        stack[0] = Decimal(stack[0]).times(dgmode).sin();
    } else {
        stack[0] = a.sin().times(b.cosh());
        stack_im[0] = a.cos().times(b.sinh());
    }
}

function cos() {
    // cos(a+bi)=cos(a) * cosh(b) − isin(a) * sinh(b)
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    if (b.isZero()) {
        stack[0] = Decimal(stack[0]).times(dgmode).cos();
    } else {
        stack[0] = a.cos().times(b.cosh());
        stack_im[0] = a.sin().times(b.sinh()).neg();
    }
}

function tan() {
    var a = Decimal(stack[0]).times(2);
    var b = Decimal(stack_im[0].times(2));
    var d = a.cos().plus(b.cosh());
    if (b.isZero()) {
        stack[0] = Decimal(stack[0]).times(dgmode).tan();
    } else {
        stack[0] = a.sin().div(d);
        stack_im[0] = b.sinh().div(d);
    }
}

function atan() {
    //atan(z) = i / 2 log((i + z) / (i - z))
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    var re, im;
    if (a.isZero() && b.eq(1)) {
        re = Decimal(0);
        im = Decimal(Infinity);
    } else if (a.isZero() && b.eq(-1)) {
        re = Decimal(0);
        im = Decimal(-Infinity);
    } else {
        // i+z/i-z: a + (b+1)i /(-a + (1-b)i)
        // division denominator: a^2 + (1-b)^2
        var d = a.pow(2).plus(Decimal(1).minus(b).pow(2));
        // (1-b^2-a^2)/d, -2a/d
        var a1 = Decimal(1).minus(b.pow(2)).minus(a.pow(2)).div(d);
        var b1 = Decimal(-2).times(a).div(d);
        //ln: ln(a1, b1)
        var a2 = Decimal.hypot(a1, b1).ln();
        var b2 = Decimal.atan2(b1, a1);
        // i/2 *..:
        re = b2.times(-0.5);
        im = a2.times(0.5);
    }
    stack[0] = re;
    stack_im[0] = im;

    // stack[0] = Decimal(stack[0]).atan().div(dgmode);
}

function asin() {
    // asin(z) = -i * log(zi + sqrt(1 - z^2))
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    //1-z^2: (b^2-a^2+1, -2ab)
    var a1 = b.pow(2).minus(a.pow(2)).plus(1);
    var b1 = a.times(b).times(-2);
    //sqrt(1 - z^2): sqrt(a1,b1)
    var r = a1.pow(2).plus(b1.pow(2)).sqrt();
    var s = (b1.lt(0)) ? Decimal(-1) : Decimal(1); //sign
    var a2 = a1.plus(r).div(2).sqrt();
    var b2 = r.minus(a1).div(2).sqrt().times(s);
    //zi + sqrt(1 - z^2): (a2-b, b2+a)
    var a3 = a2.minus(b);
    var b3 = b2.plus(a);
    //log(zi + sqrt(1 - z^2)): ln(a3, b3)
    var a4 = Decimal.hypot(a3, b3).ln();
    var b4 = Decimal.atan2(b3, a3);
    //-i * log(zi + sqrt(1 - z^2)): (b4, -a4)
    stack[0] = b4;
    stack_im[0] = a4.neg();

    // stack[0] = Decimal(stack[0]).asin().div(dgmode);
}

function acos() {
    // acos(z) = i * ln(z - i * sqrt(1 - z^2))
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    //1-z^2: (b^2-a^2+1, -2ab)
    var a1 = b.pow(2).minus(a.pow(2)).plus(1);
    var b1 = a.times(b).times(-2);
    //sqrt(1 - z^2): sqrt(a1,b1)
    var r = a1.pow(2).plus(b1.pow(2)).sqrt();
    var s = (b1.lt(0)) ? Decimal(-1) : Decimal(1); //sign
    var a2 = a1.plus(r).div(2).sqrt();
    var b2 = r.minus(a1).div(2).sqrt().times(s);
    //z - i*sqrt(1 - z^2): (a+b2, b-a2)
    var a3 = a.plus(b2);
    var b3 = b.minus(a2);
    //ln(z - i * sqrt(1 - z^2)): ln(a3, b3)
    var a4 = Decimal.hypot(a3, b3).ln();
    var b4 = Decimal.atan2(b3, a3);
    //i * ln(z - i * sqrt(1 - z^2)): (-b4, a4)
    stack[0] = b4.neg();
    stack_im[0] = a4;

    // stack[0] = Decimal(stack[0]).acos().div(dgmode);
}

function sinh() {
    // sinh(z) = (e^z - e^-z) / 2
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    stack[0] = a.sinh().times(b.cos());
    stack_im[0] = a.cosh().times(b.sin());
    // stack[0] = Decimal(stack[0]).sinh();
}

function cosh() {
    // cosh(z) = (e^z + e^-z) / 2
    var a = Decimal(stack[0]);
    var b = Decimal(stack_im[0]);
    stack[0] = a.cosh().times(b.cos());
    stack_im[0] = a.sinh().times(b.sin());
    // stack[0] = Decimal(stack[0]).cosh();
}

function tanh() {
    // tanh(z) = (e^z - e^-z) / (e^z + e^-z)
    var a = Decimal(stack[0]).times(2);
    var b = Decimal(stack_im[0]).times(2);
    var d = a.cosh().plus(b.cos());
    stack[0] = a.sinh().div(d);
    stack_im[0] = b.sin().div(d);

    // stack[0] = Decimal(stack[0]).tanh();
}

function factx() {
    if (stack[0] == parseInt(stack[0]) && stack[0] > 0) {
        stack[0] = st_fact(stack[0]);
    } else {
        stack[0] = internal_gamma(parseFloat(stack[0]) + 1);
    }
}

function st_fact(n) { //standard factorial
    // var d = new Date();
    // var d2 = null;
    // var ms = 2000;
    n = parseInt(n);
    if (n < 0 || n > 2000000) { // if negative
        return "Error";
    } else if ((n == 0) || (n == 1)) {
        return 1;
    } else { // positive integer
        var buf = Decimal('1');
        var i;
        var d3;
        for (i = 1; i <= n; i++) {
            buf = buf.times(i);
        }
        return buf.toString();
    }
    // while (d2 - d < ms);
}

function internal_loggamma(x) {
    //with(Math) {
    var v = 1;
    var w = 0;
    while (x < 8) {
        v *= x;
        x++;
    }
    w = 1 / (x * x);
    return ((((((((-3617 / 122400) * w + 7 / 1092) * w - 691 / 360360) * w + 5 / 5940) * w - 1 / 1680) * w + 1 / 1260) * w - 1 / 360) * w + 1 / 12) / x + 0.5 * Math.log(2 * Math.PI) - Math.log(v) - x + (x - 0.5) * Math.log(x);
    //}
}

// gamma function
// x is the actual value not a form object
function internal_gamma(x) {
    //with(Math) {
    if (x <= 0) {
        if (Math.abs(x) - Math.floor(Math.abs(x)) == 0)
        // should be complex infinity but we do not have
        // complex numbers
            return 'Error';
        else
            return Math.pi / (Math.sin(Math.PI * x) * Math.exp(internal_loggamma(1 - x)));
    } else
    //console.log(Math.exp(internal_loggamma(x)));
        return Math.exp(internal_loggamma(x));
    //}
}

function nPr() {
    stack[0] = Decimal(st_fact(stack[1])).div(Decimal(st_fact(stack[1] - stack[0]))).toString();
}

function nCr() {
    stack[0] = Decimal(st_fact(stack[1])).div((Decimal(st_fact(stack[1] - stack[0]))).times(Decimal(st_fact(stack[0]))));
}

function random() { //random
    fillundostack();
    if (store.rpnmode == 'rpn') pushStack();
    makehisstack('rnd');
    stack[0] = Decimal.random();
    hisstack[0] = 'rnd';
    hisopstack[0] = '';
    popStack(0);
    display();
    info(_lg.random01);
}

function avg() {
    fillundostack();
    if (computed) {
        pushStack();
    }
    makehisstack('avg');
    var n = 0;
    var x = Decimal(0);
    for (var i = 0; i < 30; i++) {
        if (!isNaN(memx[i]) && memx[i] != '') {
            x = x.plus(memx[i]); //only real parts
            n += 1;
        }
    }
    stack[0] = (n == 0) ? 'Error' : x.div(n);
    computed = true;
    display();
    info(_lg.average_memory);
}

function sum() {
    fillundostack();
    if (computed) {
        pushStack();
    }
    makehisstack('sum');
    var x = Decimal(0);
    for (var i = 0; i < 30; i++) {
        if (!isNaN(memx[i]) && memx[i] != '') {
            x = x.plus(memx[i]); //only real parts
        }
    }
    stack[0] = x;
    popStack(0);
    info(_lg.sum_memory);
}

function sumsquares() {
    fillundostack();
    if (computed) {
        pushStack();
    }
    makehisstack('sum2');
    var x = Decimal(0);
    for (var i = 0; i < 30; i++) {
        if (!isNaN(memx[i]) && memx[i] != '') {
            x = x.plus(Decimal(memx[i]).times(memx[i])); //only real parts
        }
    }
    stack[0] = x;
    popStack(0);
    info(_lg.sum_squares_memory);
}

function dev() {
    fillundostack();
    if (computed) {
        pushStack();
    }
    makehisstack('dev');
    var n = 0;
    var x = Decimal(0);
    var d = Decimal(0);
    for (var i = 0; i < 30; i++) {
        if (!isNaN(memx[i]) && memx[i] != '') {
            x = x.plus(memx[i]);
            n += 1;
        }
    }
    if (n == 0) {
        stack[0] = 'Error';
    } else {
        x = x.div(n); //average
        for (i = 0; i < 30; i++) {
            if (!isNaN(memx[i]) && memx[i] != '') {
                d = d.plus((Decimal(memx[i]).minus(x)).pow(2));
            }
        }
        d = d.div(n);
        stack[0] = d.sqrt();
    }
    popStack(0);
    info(_lg.deviation_memory);
}

// today() not yet used
function today() { // enter today into x
    fillundostack();
    if (store.rpnmode == 'rpn') pushStack();
    var t = new Date();
    var dd = t.getDate().toString();
    var mm = (t.getMonth() + 1).toString();
    var yyyy = t.getFullYear().toString();
    stack[0] = parseInt(date2dec(dd + '\\' + mm + '\\' + yyyy));
    hisstack[0] = 'today';
    hisopstack[0] = '';
    popStack(0);
    display();
    info(_lg.today);
}

function dataentry(keychar) { //enter financial variables from x:
    entry = entry.replace(',', '.');
    var r = parseFloat(entry);
    if (computed == false && enterpressed == false) {
        computed = true;
        // hisstack[0] = roundhis(stack[0]);
        fillhisstack0();
    }
    if (r != null && !isNaN(r)) {
        if (keychar == m[10][0][0]) {
            store.rate = r;
            m[10][1] = ['&#160', store.rate, 'rate'];
            m[10][11] = ['&#160', store.rate, 'rate'];
            m[10][21] = ['&#160', store.rate, 'rate'];
            statusrate(_lg.rate + ': ' + ((100 * store.rate).toPrecision(3)).toString() + '%');
            info(_lg.rate + ' ' + _lg.set_to + ' ' + ((100 * store.rate).toPrecision(3)).toString() + '%');
            storerecord('rate', store.rate.toString());
        } else if (keychar == m[10][2][0]) {
            store.pv = r;
            m[10][3] = ['&#160', store.pv, 'pv'];
            info(_lg.present_value + ' ' + _lg.set_to + ' ' + store.pv.toString());
            storerecord('pv', store.pv.toString());
        } else if (keychar == m[10][4][0]) {
            store.fv = r;
            m[10][5] = ['&#160', store.fv, 'fv'];
            info(_lg.future_value + ' ' + _lg.set_to + ' ' + store.fv.toString());
            storerecord('fv', store.fv.toString());
        } else if (keychar == m[10][6][0]) {
            store.nper = parseInt(r);
            m[10][7] = ['&#160', store.nper, 'nper'];
            info(_lg.number_of_periods + ' ' + _lg.set_to + ' ' + store.nper.toString());
            storerecord('nper', store.nper.toString());
        } else if (keychar == m[10][12][0]) {
            store.prv = r;
            m[10][13] = ['&#160', store.prv, 'prv'];
            info(_lg.principal + ' ' + _lg.set_to + ' ' + store.prv.toString());
            storerecord('prv', store.prv.toString());
        } else if (keychar == m[10][14][0]) {
            store.npr = parseInt(r);
            m[10][15] = ['&#160', store.npr, 'npr'];
            info(_lg.number_of_periods + ' ' + _lg.set_to + ' ' + store.npr.toString());
            storerecord('npr', store.npr.toString());
        } else if (keychar == m[10][16][0]) {
            store.pmt = r;
            m[10][17] = ['&#160', store.pmt, 'pmt'];
            info(_lg.payment + ' ' + _lg.set_to + ' ' + store.pmt.toString());
            storerecord('pmt', store.pmt.toString());
        } else if (keychar == m[10][18][0]) {
            store.xpmt = parseInt(r);
            m[10][19] = ['&#160', store.xpmt, 'xpmt'];
            info(_lg.payment_number + ' ' + _lg.set_to + ' ' + store.xpmt.toString());
            storerecord('xpmt', store.xpmt.toString());
        } else {
            shift = '0';
            display();
        }
    }
    showmenu('finentry');
}

function presentvalue() { //present value cagr
    fillundostack();
    var nper = Decimal(store.nper);
    var fv = Decimal(store.fv);
    var rate = Decimal(store.rate);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('pv');
    var result;
    // console.log('rate: '+store.rate+' fv: '+store.fv+' nper: '+store.nper);
    if (rate.isZero()) {
        result = Decimal(fv);
    } else {
        result = Decimal(fv).div((Decimal(1).plus(rate)).pow(nper));
        //console.log('result: '+result);
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.present_value + ' (' + _lg.fv + '=' + round3(fv) + '; ' + _lg.nper + '=' + nper + ')');
}

function futurevalue() { //future value cagr
    fillundostack();
    var nper = Decimal(store.nper);
    var pv = Decimal(store.pv);
    var rate = Decimal(store.rate);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('fv');
    var result;
    if (rate.isZero()) {
        result = Decimal(pv);
    } else {
        result = Decimal(pv).times((Decimal(1).plus(rate)).pow(nper));
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    //    console.log(pv);
    info(_lg.future_value + ' (' + _lg.pv + '=' + round3(pv) + '; ' + _lg.nper + '=' + nper + ')');
}

function cagr() { //cagr
    fillundostack();
    var fv = Decimal(store.fv);
    var pv = Decimal(store.pv);
    var nper = Decimal(store.nper);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('cagr');
    var result;
    if (pv.isZero() || nper.isZero()) {
        result = "Error";
    } else {
        result = Decimal(fv).div(pv).pow(Decimal(1).div(nper)).minus(Decimal(1));
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.CAGR + ' (' + _lg.pv + '=' + round3(pv) + '; ' + _lg.fv + '=' + round3(fv) + '; ' + _lg.nper + '=' + nper + ')');
}

function periodscagr() { //periods value cagr
    fillundostack();
    var fv = Decimal(store.fv);
    var pv = Decimal(store.pv);
    var rate = Decimal(store.rate);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('nper');
    var result;
    if (rate.isZero() || pv.isZero()) {
        result = "Error";
    } else {
        //result = (Math.log(fv/pv))/(Math.log(1+rate));
        result = Decimal(fv).div(pv).log().div(Decimal(1).plus(rate).log());
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.number_of_periods);
}

function principal() { //principal value for annuity
    fillundostack();
    // console.log("principal pmt: " + store.pmt);
    var pmt = Decimal(store.pmt);
    var rate = Decimal(store.rate);
    var npr = Decimal(store.npr);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('prv');
    var result;
    if (rate.isZero()) {
        // console.log("principal: " + rate);
        result = pmt.times(npr);
    } else {
        result = Decimal(1).minus(Decimal(1).div(Decimal(1).plus(rate).pow(npr))).times(pmt).div(rate);
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.principal + ' (' + _lg.pmt + '=' + pmt.round().toString() + '; ' + _lg.nper + '=' + npr + ')');
}

function payment() { //payment pr period for annuity
    fillundostack();
    var rate = Decimal(store.rate);
    var prv = Decimal(store.prv);
    var npr = Decimal(store.npr);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('pmt');
    var result;
    if (rate.isZero()) {
        result = prv.div(npr);
    } else {
        result = prv.times(rate).div(Decimal(1).minus(Decimal(1).div(Decimal(1).plus(rate).pow(npr))));
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.payment + ' (' + _lg.principal + '=' + prv.round().toString() + '; ' + _lg.per + '=' + npr + ')');
}

function periods() { //number of periods for annuity
    fillundostack();
    var pmt = Decimal(store.pmt);
    var prv = Decimal(store.prv);
    var rate = Decimal(store.rate);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('npr');
    var result;
    if (rate.isZero()) {
        result = prv.div(pmt);
    } else {
        result = rate.times(prv);
        result = Decimal(1).minus(result.div(pmt));
        result = result.log();
        result = result.div((Decimal(1).plus(rate)).log()).neg();
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.number_of_periods + ' (' + _lg.principal + '=' + prv.round().toString() + '; ' + _lg.pmt + '=' + pmt.round().toString() + ')');
}

function interest() { //for annuity
    var prec = Decimal(10).pow(Decimal(rnd_calc).minus(2).neg()); //precision
    var pmt = Decimal(store.pmt);
    var prv = Decimal(store.prv);
    var npr = Decimal(store.npr);
    var mn = pmt.minus(prv.div(npr)).div(prv); //minimum interest=(payment-principal/periods)/principal
    var mx = pmt.div(prv); //maximum interest=payment/principal
    var ittmax = 1000;
    var i = 0;
    var c; //result
    var pmt_c;
    do {
        i += 1;
        c = mn.plus(mx).div(2);
        pmt_c = prv.times(c).div(Decimal(1).minus(Decimal(1).div(Decimal(1).plus(c).pow(npr))));
        if (pmt_c.minus(pmt).lt(0)) {
            mn = c;
        } else {
            mx = c;
        }
        //console.log(i+' '+ pmt_c.minus(pmt).toString() +' '+prec+ " " + c.toString());
    } while (pmt_c.minus(pmt).abs().gt(prec) && i <= ittmax);
    stack[0] = c;
    stack_im[0] = '';
    popStack(0);
    var cd = c.times(1000).round().div(10).toString();
    info(_lg.int + '= ' + cd + '% (' + _lg.principal + '=' + prv.round().toString() + '; ' + _lg.pmt +
        '=' + pmt.round().toString() + '; ' + _lg.number_of_periods + '=' + npr + ')');
}

function principalpart() { //principal part of payment x for annuity
    fillundostack();
    var pmt = Decimal(store.pmt);
    var rate = Decimal(store.rate);
    var xpmt = Decimal(store.xpmt);
    var npr = Decimal(store.npr);
    var prv = Decimal(store.prv);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('pprt');
    var result;
    if (xpmt.gt(npr) || xpmt.isZero()) {
        result = 0;
    } else {
        //result=(pmt-(rate*prv))*Math.pow((1+rate),(xpmt-1));
        result = pmt.minus(rate.times(prv)).times((Decimal(1).plus(rate)).pow(xpmt.minus(1)));
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.principal_part_for_payment + ' ' + xpmt.toString());
}

function interestpart() { //interest part of payment x for annuity
    fillundostack();
    var pmt = Decimal(store.pmt);
    var rate = Decimal(store.rate);
    var xpmt = Decimal(store.xpmt);
    var prv = Decimal(store.prv);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('iprt');
    var result;
    if (xpmt > npr || xpmt == 0) {
        result = 0;
    } else {
        //result=pmt-((pmt-(rate*prv))*Math.pow((1+rate),(xpmt-1)));
        result = pmt.minus((pmt.minus(rate.times(prv))).times((Decimal(1).plus(rate)).pow(xpmt.minus(1))));
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.interest_part_for_payment + ' ' + xpmt.toString());
}

function totalinterest() { //total interest paid for annuity
    fillundostack();
    var pmt = Decimal(store.pmt);
    var npr = Decimal(store.npr);
    var prv = Decimal(store.prv);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('tint');
    var result;
    result = Decimal(pmt).times(npr).minus(prv);
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.total_interest_paid);
}

function totalpayments() { //total paid for annuity
    fillundostack();
    var pmt = Decimal(store.pmt);
    var npr = Decimal(store.npr);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('tpmt');
    var result;
    result = Decimal(pmt).times(npr);
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.total_payments);
}

function remainingprincipal() { //remaining balance after payment x for annuity
    fillundostack();
    var pmt = Decimal(store.pmt);
    var prv = Decimal(store.prv);
    var xpmt = Decimal(store.xpmt);
    var rate = Decimal(store.rate);
    var npr = Decimal(store.npr);
    if (computed && store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('rbal');
    var result;
    if (xpmt.gt(npr)) {
        result = 0; //error
    } else if (xpmt.eq(npr)) {
        result = 0;
    } else {
        result = prv.minus(pmt.minus(rate.times(prv)).times(((Decimal(1).plus(rate)).pow(xpmt)).minus(1)).div(rate));
    }
    stack[0] = result;
    stack_im[0] = '';
    popStack(0);
    info(_lg.balance_after_payment + ' ' + xpmt);
}

function npv() { //net present value of cashflows
    fillundostack();
    if (computed) {
        pushStack();
    }
    makehisstack('npv');
    var x = Decimal(memx[0]);
    var y = Decimal(1).div(Decimal(1).plus(store.rate));

    var n = 0; //# values in memory
    for (var i = 0; i < 30; i++) {
        if (isNaN(memx[i]) || memx[i] == '') {
            break;
        } else {
            n += 1;
        }
    }

    for (i = 1; i < n; i++) {
        if (!(Decimal(memx[i]).isNaN())) {
            x = x.plus(y.times(memx[i]));
            //console.log(n+" "+ memx[n] + " " + x.toString() + " " + y);
        }
        y = y.div(Decimal(1).plus(store.rate));
    }
    stack[0] = x;
    stack_im[0] = '';
    popStack(0);
    info(_lg.npv_of + ' ' + n + ' ' + _lg.cashflows);
}

function irr() {
    var prec = Decimal(10).pow(Decimal(rnd_calc).minus(2).neg()); //precision
    var mn = Decimal(0); //min
    var mx = Decimal(1); //max
    var ittmax = 1000;
    var i = 0;
    var c;
    var s = Decimal(0); //sum values
    var n = 0; //# values in memory
    for (i = 0; i < 30; i++) {
        if (isNaN(memx[i]) || memx[i] == '') {
            break;
        } else {
            s = s.plus(memx[i]);
            n += 1;
        }
    }
    if (store.rpnmode == 'rpn') {
        pushStack();
    }
    makehisstack('irr');
    hisopstack[0] = "";
    stack_im[0] = '';
    if (s < 0) {
        stack[0] = _lg.error;
        info(_lg.error + ': ' + _lg.negative_npv);
    } else if (!Decimal(memx[0]).isNeg()) {
        stack[0] = _lg.error;
        info(_lg.error + ': ' + _lg.first_CF_not_negative);
    } else if (s.isZero()) {
        stack[0] = s;
        info(_lg.irr + ' ' + _lg.cashflows + '= ' + s.toString() + '%');
    } else {
        i = 0;
        var npv_tozero, cd;
        do {
            i += 1;
            c = mn.plus(mx).div(2);
            npv_tozero = Decimal(0);
            for (var j = 0; j < n; j++) {
                if (!(Decimal(memx[j]).isNaN())) {
                    npv_tozero = npv_tozero.plus(Decimal(memx[j]).div((Decimal(1).plus(c)).pow(j)));
                    //                    console.log(i + ' ' + j + " " + memx[j] + " " + npv_tozero.toString() + " " + c);
                }
            }
            if (npv_tozero.gt(0)) {
                mn = c;
            } else {
                mx = c;
            }
        } while (npv_tozero.abs().gt(prec) && i <= ittmax);
        //        console.log('rnd_calc= '+rnd_calc+ 'Dec:'+Decimal(rnd_calc).minus(2));
        stack[0] = Decimal(c.toPrecision(rnd_calc - 2)); //to prevent rounding errors
        cd = c.times(1000).round().div(10).toString();
        info(_lg.irr + ' ' + _lg.cashflows + '= ' + cd + '%');
    }
    popStack(0);
}

function pix() { // put pi into x
    fillundostack();
    if (stack[0] == 'Infinity' || stack[0] == '-Infinity' || stack[0] == 'Error') cx();
    if (store.rpnmode == 'rpn') pushStack();
    stack[0] = pi;
    stack_im[0] = '0';
    hisstack[0] = 'gpi'; //replaced by greek letter pi
    hisopstack[0] = '';
    popStack(0);
    display();
    info('gpi'); //replaced by greek letter pi
}

function convert(n, dir) {
    fillundostack();
    pushStack();
    hisstack[0] = "";
    hisopstack[0] = "";
    stack[0] = m[1][n][2];
    stack_im[0] = '0';
    var inf = m[1][n][1];
    if (dir == 'r') { //direction right
        makehisstack('*');
        multiply();
        popStack(1);
    } else { //direction left
        makehisstack('/');
        divide();
        popStack(1);
        inf = inf.replace('->', ' <-'); //arrow left
    }
    info(inf);
}

function setbasecurrency(n) {
    var basecurrency = m[4][n][2];
    store.bcn = parseFloat(n);
    var bc = parseFloat(m[4][n][3]);
    for (i = 0; i < m[4].length; i++) { //fill array, we don't want to wait for getRates
        m[4][i][3] = (m[4][i][3] / bc).toString().slice(0, 7);
    }
    storerecord("bcn", store.bcn);
    //getRates();
    info(_lg.base_currency + ': ' + basecurrency);
}

function convertrate(n, dir) {
    stack_im[0] = (stack_im[0] == '') ? Decimal(0) : Decimal(stack_im[0]);
    stack_im[1] = (stack_im[1] == '') ? Decimal(0) : Decimal(stack_im[1]);
    fillundostack();
    pushStack();
    hisstack[0] = "";
    hisopstack[0] = "";
    // stack[0] = parseFloat(m[4][n][3]);
    stack[0] = m[4][n][3];
    // console.log("convertrate stack[0]: " + stack[0] + '  '+stack[1]);
    stack_im[0] = '0';
    var inf = m[4][store.bcn][2] + '->' + m[4][n][2] + ' (' + m[4][n][1] + '; ' + m[4][n][4] + ')';
    if (dir == 'r') { //direction right
        makehisstack('*');
        multiply();
        popStack(1);
    } else { //direction left
        makehisstack('/');
        divide();
        popStack(1);
        inf = inf.replace('->', '<-'); //arrow left
    }
    info(inf);
}

function calcrate(rate) { //calculates rate conversion for menu
    var r;
    if (cvdir == 'r') {
        r = Decimal(stack[0]).times(Decimal(rate)).toPrecision(6).toString();
    } else {
        r = Decimal(stack[0]).div(Decimal(rate)).toPrecision(6).toString();
    }
    if (store.comma == 'c') {
        r = r.replace(/\./g, ",");
    }
    return r;
}


function getYahooRate(from, to) {
    var script = document.createElement('script');

    script.setAttribute('src', "http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D" + from + to + "%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json&callback=parseExchangeRate");

    document.body.appendChild(script);
}


function parseExchangeRate(data) { //callback for getYahooRate
    try {
        var name = data.query.results.row.name.slice(4);
        //        console.log(data.query.results.row.rate);
        //        console.log(data.query.results.row.name+" "+name);
        var d = new Date();
        for (i = 0; i < m[4].length; i++) {
            if (name == m[4][i][2]) {
                m[4][i][3] = parseFloat(data.query.results.row.rate, 10);
                m[4][i][4] = 'Yahoo-' + d.toLocaleDateString();
            }
        }
    } catch (err) {
        console.log(err);
    }
}

function getRates() {
    var i, n, x;
    if (run_as == 'ext' || run_as == 'app') { //ECB-xml only works in Chrome extension or app
        //    if (run_as == 'xxx') { //ECB-xml only works in Chrome extension or app
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var xrates = xhr.responseText;
                if (xrates != '') {
                    n = xrates.search(m[4][store.bcn][2]);
                    if (n > 0) { //x =exchange rate of basecurrency to Euro in ecb-list
                        x = parseFloat(xrates.substring(n + 11, xrates.indexOf("'", n + 12)));
                    } else {
                        x = 1.0;
                    }
                    var d = new Date();
                    for (i = 0; i < m[4].length; i++) {
                        n = xrates.search(m[4][i][2]);
                        if (n > 0) {
                            m[4][i][3] = (parseFloat(xrates.substring(n + 11, xrates.indexOf("'", n + 12))) / x).toString().slice(0, 7);
                        } else { //as EUR is not in list ECB
                            m[4][i][3] = (1.0 / x).toString().slice(0, 7);
                        }
                        m[4][i][4] = 'ECB-' + d.toLocaleDateString();
                    }
                }
            }
        };
        xhr.send();
    } else { //run as web-application
        var d = new Date();
        for (i = 0; i < m[4].length; i++) {
            getYahooRate(m[4][store.bcn][2], m[4][i][2]);
            m[4][i][4] = 'Yahoo-' + d.toLocaleDateString();
        }
    }
}

function getconstant(n) {
    if (m[7][n][2] != '') {
        if (stack[0] == 'Infinity' || stack[0] == '-Infinity' || stack[0] == 'Error') cx();
        if (store.rpnmode == 'rpn') {
            pushStack();
        }
        hisstack[0] = "";
        hisopstack[0] = "";
        //console.log(m[7][n][2]);
        stack[0] = Decimal(m[7][n][2]).toString();
        popStack(0);
        info(m[7][n][1]);
    }
}

function getlastx(n) {
    if (lastx.re != '' && lastx.re != undefined) {
        if (stack[0] == 'Infinity' || stack[0] == '-Infinity' || stack[0] == 'Error') cx();
        if (store.rpnmode == 'rpn') {
            pushStack();
        }
        hisstack[0] = "";
        hisopstack[0] = "";
        //console.log(m[7][n][2]);
        stack[0] = lastx.re;
        if (lastx.im === undefined) lastx.im = '';
        stack_im[0] = lastx.im;
        popStack(0);
        info(_lg.last_x);
    }
}

function converttemp(a) { //fahrenheit to celcius
    if (a == "m") {
        stack[0] = Decimal(stack[0]).minus('32').div('1.8').toString();
    } else if (a == "M") {
        stack[0] = Decimal(stack[0]).times('1.8').plus('32').toString();
    }
}

function defineconstants() {
    m[0][0] = ['+-*/', _lg.calculate];
    m[0][1] = ['n', _lg.change_sign];
    m[0][2] = ['y', 'y^x'];
    m[0][3] = ['q', _lg.square];
    m[0][4] = ['i', _lg.inverse + '(1/x)'];
    m[0][5] = ['!', _lg.factorial_gamma];
    m[0][6] = ['p', _lg.pi];
    m[0][7] = ['%', _lg.modulo];
    m[0][8] = ['w', _lg.swap + ' x &hArr; y'];
    m[0][9] = ['d', _lg.drop_clearx];
    m[0][10] = ['&#8593&#8595', _lg.scroll_stack];
    m[0][11] = [_lg.space, '&#160&#160' + _lg.select_yellow_box];
    m[0][12] = ['u', _lg.undo];
    m[0][13] = ['j', 'RPN &hArr; Stack'];
    m[0][14] = ['m', _lg.store_in_free_mem];
    m[0][15] = ['k', _lg.last_x];
    m[0][16] = ['l', _lg.last_answers];
    m[0][17] = ['z', _lg.notation];
    m[0][18] = ['o', _lg.options];
    m[0][19] = ['h', _lg.help_about];
    m[0][20] = ['a&#160', _lg.algebra_trig];
    m[0][21] = ['t', _lg.statistics];
    m[0][22] = ['f', _lg.finance];
    m[0][23] = ['x', _lg.exchange_rates];
    m[0][24] = ['s', _lg.store_memory];
    m[0][25] = ['r', _lg.recall_memory];
    m[0][26] = ['c', _lg.clear_copy_paste];
    if (run_as == 'ext') {
        m[0][27] = ['b', _lg.open_in_window];
    } else {
        m[0][27] = ['', ''];
    }
    m[0][28] = ['g', _lg.constants];
    m[0][29] = ['v', _lg.convert];

    m[1][0] = ['0', _lg.nautical_mile + ' -> ' + _lg.meter, '1852.0'];
    m[1][1] = ['1', _lg.mile + ' -> ' + _lg.meter, '1609.344'];
    m[1][2] = ['2', _lg.yard + ' -> ' + _lg.meter, '0.9144'];
    m[1][3] = ['3', _lg.foot + ' -> ' + _lg.meter, '0.3048'];
    m[1][4] = ['4', _lg.inch + ' -> ' + _lg.meter, '0.0254'];
    m[1][5] = ['5', _lg.light_year + ' -> ' + _lg.meter, '9.4607304725808e15'];
    m[1][6] = ['6', _lg.barrel + ' -> ' + _lg.liter, '158.987295'];
    m[1][7] = ['7', _lg.gallon + ' -> ' + _lg.liter, '3.785411784'];
    m[1][8] = ['8', _lg.lqd_ounce + ' -> ' + _lg.liter, '0.02957353'];
    m[1][9] = ['9', _lg.pound_lb + ' -> ' + _lg.gram, '453.59237'];
    m[1][10] = ['a', _lg.horse_power + ' -> ' + _lg.watt, '745.69987'];
    m[1][11] = ['b', _lg.calory + ' -> ' + _lg.joule, '4.1868'];
    m[1][12] = ['c', _lg.degrees + ' -> ' + _lg.radian, pi.div(180)];
    m[1][13] = ['d', _lg.fahrenheit + ' -> ' + _lg.celcius, ];
    m[1][14] = ['', '', ''];
    m[1][15] = ['', _lg.any_other_key_to_exit, ''];

    m[2][0] = ['e', _lg.English, 'us'];
    m[2][1] = ['n', _lg.Dutch, 'nl'];
    m[2][2] = ['', '', ''];
    m[2][3] = ['', '', ''];
    m[2][4] = ['', '', ''];
    m[2][5] = ['', '', ''];
    m[2][6] = ['', '', ''];
    m[2][7] = ['', '', ''];
    m[2][8] = ['', '', ''];
    m[2][9] = ['', '', ''];
    m[2][10] = ['', '', ''];
    m[2][11] = ['', '', ''];
    m[2][12] = ['l', _lg.language, 'lan'];
    m[2][13] = ['t', _lg.thousands_separator_on, 'ths'];
    m[2][14] = [',', _lg.comma, 'dec'];
    m[2][15] = ['.', _lg.dot, 'dec'];
    m[2][16] = ['r', _lg.radian, _lg.radian];
    m[2][17] = ['d', _lg.degrees, _lg.degrees];
    m[2][18] = ['', _lg.any_other_key_to_exit, ''];
    m[2][19] = ['p', 'RPN Calculator', ''];
    m[2][20] = ['a', 'Stack Calculator', ''];
    m[2][21] = ['y', _lg.base_currency, ''];

    m[3][0] = ['x', _lg.clear + ' x'];
    m[3][1] = ['s', _lg.clear + ' ' + _lg.stack];
    m[3][2] = ['m', _lg.clear + ' ' + _lg.memory];
    m[3][3] = ['l', _lg.clear + ' ' + _lg.lastanswers];
    m[3][4] = ['a', _lg.clear + ' ' + _lg.all];
    m[3][5] = ['', ''];
    m[3][6] = ['', ''];
    m[3][7] = ['', ''];
    m[3][8] = ['', ''];
    m[3][9] = ['', ''];
    m[3][10] = ['c', _lg.copy_x_to_clipboard];
    m[3][11] = ['v', _lg.paste_from_clipboard];

    m[4][0] = ['0', 'US dollar', 'USD', 1.0, ''];
    m[4][1] = ['1', 'Euro', 'EUR', 1.0, ''];
    m[4][2] = ['2', 'Japanese yen', 'JPY', 1.0, ''];
    m[4][3] = ['3', 'Canadian dollar', 'CAD', 1.0, ''];
    m[4][4] = ['4', 'Pound sterling', 'GBP', 1.0, ''];
    m[4][5] = ['5', 'Swiss francs', 'CHF', 1.0, ''];
    m[4][6] = ['6', 'Australian dol', 'AUD', 1.0, ''];
    m[4][7] = ['7', 'New Zealnd dol', 'NZD', 1.0, ''];
    m[4][8] = ['8', 'Russian rouble', 'RUB', 1.0, ''];
    m[4][9] = ['9', 'South African rnd', 'ZAR', 1.0, ''];
    m[4][10] = ['a', 'Chinese yuan', 'CNY', 1.0, ''];
    m[4][11] = ['b', 'Hong Kong dollar', 'HKD', 1.0, ''];
    m[4][12] = ['c', 'South Kor. won', 'KRW', 1.0, ''];
    m[4][13] = ['d', 'Singapore dollar', 'SGD', 1.0, ''];
    m[4][14] = ['e', 'Brasilian real', 'BRL', 1.0, ''];
    m[4][15] = ['f', 'Czech koruna', 'CZK', 1.0, ''];
    m[4][16] = ['g', 'Danish krone', 'DKK', 1.0, ''];
    m[4][17] = ['h', 'Hungarian forint', 'HUF', 1.0, ''];
    m[4][18] = ['i', 'Polish zloty', 'PLN', 1.0, ''];
    m[4][19] = ['j', 'Swedish kronae', 'SEK', 1.0, ''];
    m[4][20] = ['k', 'Norwegian krn', 'NOK', 1.0, ''];
    m[4][21] = ['l', 'Turkish lirae', 'TRY', 1.0, ''];
    m[4][22] = ['m', 'Bulgarian lev', 'BGN', 1.0, ''];
    m[4][23] = ['n', 'Indonesian rup', 'IDR', 1.0, ''];
    m[4][24] = ['o', 'Israeli shekel', 'ILS', 1.0, ''];
    m[4][25] = ['p', 'Indian rupee', 'INR', 1.0, ''];
    m[4][26] = ['q', 'Mexican peso', 'MXN', 1.0, ''];
    m[4][27] = ['r', 'Malaysian ring', 'MYR', 1.0, ''];
    m[4][28] = ['s', 'Philippine peso', 'PHP', 1.0, ''];
    m[4][29] = ['t', 'Thai baht', 'THB', 1.0, ''];

    m[5][0] = ['e', _lg.exponential + ' e^x \u00b9', 'e^x'];
    m[5][1] = ['n', 'ln(x) (' + _lg.natural_logarithm + ') \u00b9', 'ln'];
    m[5][2] = ['l', '10log(x) \u00b9', '10log'];
    m[5][3] = ['q', _lg.square + '(x) \u00b9', 'sqr'];
    m[5][4] = ['r', _lg.root + '(x) \u00b9', 'root'];
    m[5][5] = ['', '', ''];
    m[5][6] = ['m', 'modulo y%x', 'y%x'];
    m[5][7] = ['g', _lg.greatest_common_divisor, 'gcd'];
    m[5][8] = ['h', _lg.least_common_multiple, 'lcm'];
    m[5][9] = ['', '', ''];
    m[5][10] = ['s', 'sin(x) \u00b9', 'sin'];
    m[5][11] = ['c', 'cos(x) \u00b9', 'cos'];
    m[5][12] = ['t', 'tan(x) \u00b9', 'tan'];
    m[5][13] = ['i', 'arcsin(x) \u00b9', 'asin'];
    m[5][14] = ['o', 'arccos(x) \u00b9', 'acos'];
    m[5][15] = ['a', 'arctan(x) \u00b9', 'atan'];
    m[5][16] = ['x', 'sinh(x) \u00b9', 'sinh'];
    m[5][17] = ['y', 'cosh(x) \u00b9', 'cosh'];
    m[5][18] = ['z', 'tanh(x) \u00b9', 'tanh'];
    m[5][19] = ['', '', ''];
    m[5][20] = ['u', _lg.set_yx_to + ' (y+xi)', 'y+ix'];
    m[5][21] = ['v', _lg.set_yx_to + ' y\u2220x', 'y<x'];
    m[5][22] = ['w', _lg.conjugate, 'conj'];
    m[5][23] = ['', '', ''];
    m[5][24] = ['', '', ''];
    m[5][25] = ['', ' \u00b9 <i>' + _lg.support_for_complex_numbers + '</i>', ''];

    m[6][0] = ['c', _lg.combinations + ' (y,x)', 'comb'];
    m[6][1] = ['p', _lg.permutations + ' (y,x)', 'perm'];
    m[6][2] = ['g', _lg.factorial_gamma, ''];
    m[6][3] = ['', '', ''];
    m[6][4] = ['r', _lg.random01, 'rnd'];
    m[6][5] = ['', '', ''];
    m[6][6] = ['', '', ''];
    m[6][7] = ['', '', ''];
    m[6][8] = ['', '', ''];
    m[6][9] = ['', '', ''];
    m[6][10] = ['a', _lg.average_memory, 'avg'];
    m[6][11] = ['d', _lg.standard_deviation, 'dev'];
    m[6][12] = ['s', _lg.sum_memory, 'sum'];
    m[6][13] = ['z', _lg.sum_squares_memory, 'sumx2'];
    m[6][14] = ['', '', ''];
    m[6][15] = ['', '', ''];
    m[6][16] = ['', '', ''];
    m[6][17] = ['', '', ''];
    m[6][18] = ['', '', ''];
    m[6][19] = ['', '', ''];
    //m[6][20]=['t','today','tod'];
    m[6][20] = ['', '', ''];
    m[6][21] = ['', '', ''];
    m[6][22] = ['', '', ''];
    m[6][23] = ['', '', ''];
    m[6][24] = ['', '', ''];

    m[7][0] = ['0', _lg.atomic_mass + ' ' + _lg.constant, 1.660538921e-27];
    m[7][1] = ['1', 'Avogadro ' + _lg.constant, 6.02214129e23];
    m[7][2] = ['2', 'Boltzmann ' + _lg.constant, 1.3806488e-23];
    m[7][3] = ['3', 'electron ' + _lg.mass, 9.10938291e-31];
    m[7][4] = ['4', 'electron volt', 1.602176565e-19];
    m[7][5] = ['5', 'molar gas ' + _lg.constant, 8.3144621];
    m[7][6] = ['6', 'gravitation ' + _lg.constant, 6.673284e-11];
    m[7][7] = ['7', 'Planck ' + _lg.constant + ' (h)', 6.62606957e-34];
    m[7][8] = ['8', 'proton mass', 1.672621777e-27];
    m[7][9] = ['9', _lg.speed_of_light, 299792458.0];
    m[7][10] = ['a', 'Stefan-Boltzmann ' + _lg.constant, 5.670400e-8];
    m[7][11] = ['b', _lg.acceleration_gravity, 9.80665];
    m[7][12] = ['c', _lg.permeability, 1.2566370614e-6];
    m[7][13] = ['d', _lg.permittivity, 8.854187817e-12];
    m[7][14] = ['', _lg.any_other_key_to_exit, ''];
    m[7][15] = ['', '', ''];
    m[7][16] = ['', '', ''];
    m[7][17] = ['', '', ''];
    m[7][18] = ['', '', ''];
    m[7][19] = ['', '', ''];
    m[7][20] = ['k', _lg.natural_log_base, Decimal(1).exp().toString()];
    m[7][21] = ['l', _lg.golden_ratio, Decimal(1).plus(Decimal(5).sqrt()).div(2).toString()];
    m[7][22] = ['', '', ''];

    //m[8][] = first help screen

    //##f## calculate financial
    m[9][0] = ['c', _lg.CAGR, 'i%']; //cagr
    m[9][1] = ['p', _lg.present_value, 'pv'];
    m[9][2] = ['f', _lg.future_value, 'fv'];
    m[9][3] = ['u', _lg.number_of_periods, 'nper'];
    m[9][4] = ['', '', ''];
    m[9][5] = ['', _lg.set_3_out_of_4, ''];
    m[9][6] = ['', _lg.variabes_and_calculate, ''];
    m[9][7] = ['', _lg.unknown_variable, ''];
    m[9][8] = ['', '', ''];
    m[9][9] = ['z', '<span style="color:#0404B4"><b>' + _lg.set_finance_variables + '</b></span>', ''];
    m[9][10] = ['q', _lg.principal, 'prv']; //annuity
    m[9][11] = ['t', _lg.payment_per_period, 'pmt'];
    m[9][12] = ['m', _lg.number_of_periods, 'npr'];
    m[9][13] = ['r', _lg.interest_per_period, 'rate'];
    m[9][14] = ['', '', ''];
    m[9][15] = ['a', _lg.principal_part_for_payment, 'prprt'];
    m[9][16] = ['b', _lg.interest_part_for_payment, 'iprt'];
    m[9][17] = ['l', _lg.balance_after_payment, 'rbal'];
    m[9][18] = ['d', _lg.total_interest_paid, 'tint'];
    m[9][19] = ['e', _lg.total_payments, 'tpmt'];
    m[9][20] = ['n', _lg.net_present_value, 'npv']; //cashflow
    m[9][21] = ['i', _lg.internal_rate_of_return, 'irr'];
    m[9][22] = ['', ''];
    m[9][23] = ['', _lg.store_cfs_in_memory];
    m[9][24] = ['', _lg.negative_cash_out];
    m[9][25] = ['', _lg.positive_cash_in];
    m[9][26] = ['', '', ''];
    m[9][27] = ['', '', ''];
    m[9][28] = ['', '', ''];

    //##x## set financial variables
    m[10][0] = ['r', _lg.set_rate_cagr, 'rate']; //cagr
    m[10][1] = ['&#160', store.rate, 'rate'];
    m[10][2] = ['p', _lg.set_present_value, 'pv'];
    m[10][3] = ['&#160', store.pv, ''];
    m[10][4] = ['f', _lg.set_future_value, 'fv'];
    m[10][5] = ['&#160', store.fv, ''];
    m[10][6] = ['n', _lg.set_number_of_periods, 'nper'];
    m[10][7] = ['&#160', store.nper, ''];
    m[10][8] = ['', '', ''];
    m[10][9] = ['z', _lg.calculate, ''];
    m[10][10] = ['r', _lg.set_interest_rate, 'rate']; //annuity
    m[10][11] = ['&#160', store.rate, 'rate'];
    m[10][12] = ['q', _lg.set_present_value, 'pv'];
    m[10][13] = ['&#160', store.pv, ''];
    m[10][14] = ['m', _lg.set_number_of_periods, 'nper'];
    m[10][15] = ['&#160', store.nper, ''];
    m[10][16] = ['t', _lg.set_payment_per_period, 'pmt'];
    m[10][17] = ['&#160', store.pmt, ''];
    m[10][18] = ['x', _lg.set_payment_number, 'xpmt'];
    m[10][19] = ['&#160', store.xpmt, ''];
    m[10][20] = ['r', _lg.set_discount_rate]; //cashflow
    m[10][21] = ['&#160', store.rate];
    m[10][22] = ['s', _lg.show_cashflows];
    m[10][23] = ['', ''];
    m[10][24] = ['', _lg.store_cfs_in_memory];
    m[10][25] = ['', _lg.negative_cash_out];
    m[10][26] = ['', _lg.positive_cash_in];
    m[10][27] = ['', _lg.set_discount_rate];
    m[10][28] = ['', ''];
    m[10][29] = ['', ''];

    //m[11][] = second help screen
    //m[12][] = third help screen
    //m[13][] = last answers
    //m[14][] = memx
    //m[16][] = fourth help screen

    m[15][0] = ['n', _lg.normal, 'norm'];
    m[15][1] = ['f', _lg.financial_2, 'fin'];
    m[15][2] = ['i', _lg.integer, 'int'];
    m[15][3] = ['s', _lg.scientific, 'sci'];
    m[15][4] = ['e', _lg.engineering, 'eng'];
    m[15][5] = ['d', _lg.fixed, 'fxd'];
    m[15][6] = ['m', _lg.h_m, 'h:m'];
    m[15][7] = ['c', _lg.h_m_s, 'h:m:s'];
    m[15][8] = ['x', _lg.hexadecimal, 'hex'];
    m[15][9] = ['o', _lg.octal, 'oct'];
    m[15][10] = ['b', _lg.binary, 'bin'];
    m[15][11] = ['\\', _lg.fraction, 'frac'];
    m[15][12] = ['r', _lg.complex_rectangular, 'complex'];
    m[15][13] = ['p', _lg.complex_polar, 'polar'];

    //Help screens
    var h1 = _lg.help_h1;
    var h2 = _lg.help_h2;
    var h3 = _lg.help_h3a + version + ' ' + run_as + _lg.help_h3b + thisYear() + _lg.help_h3c;
    m[8][0] = ['', h1];
    for (i = 1; i < 10; i++) m[8][i] = ['', ''];
    m[8][10] = ['', h2];
    for (i = 11; i < 20; i++) m[8][i] = ['', ''];
    m[8][20] = ['', h3];

    //Second help screen
    var g1 = _lg.help_g1;
    var g2 = _lg.help_g2;
    var g3 = _lg.help_g3;
    m[11][0] = ['', g1];
    for (i = 1; i < 10; i++) m[11][i] = ['', ''];
    m[11][10] = ['', g2];
    for (i = 11; i < 20; i++) m[11][i] = ['', ''];
    m[11][20] = ['', g3];

    //Third help screen (finance)
    var i1 = _lg.help_i1;
    var i2 = _lg.help_i2;
    var i3 = _lg.help_i3;
    m[12][0] = ['', i1];
    for (i = 1; i < 10; i++) m[12][i] = ['', ''];
    m[12][10] = ['', i2];
    for (i = 11; i < 20; i++) m[12][i] = ['', ''];
    m[12][20] = ['', i3];

    //Fourth help screen ()
    var j1 = _lg.help_j1;
    var j2 = _lg.help_j2;
    var j3 = _lg.help_j3;
    m[16][0] = ['', j1];
    for (i = 1; i < 10; i++) m[16][i] = ['', ''];
    m[16][10] = ['', j2];
    for (i = 11; i < 20; i++) m[16][i] = ['', ''];
    m[16][20] = ['', j3];

}

function onebyx() {
    var x_re = Decimal(stack[1]);
    var x_im = Decimal(stack_im[1]);
    if (x_re.isZero() && x_im.isZero()) {
        stack[0] = Number.POSITIVE_INFINITY;
        stack_im[0] = Number.POSITIVE_INFINITY;
    } else {
        var n = x_re.pow(2).plus(x_im.pow(2));
        stack[0] = x_re.div(n);
        stack_im[0] = x_im.div(n).neg();
    }
}

function swapxy() {
    fillundostack();
    var tmp1 = stack[0];
    var tmp2 = hisstack[0];
    var tmp3 = hisopstack[0];
    var tmp4 = opstack[0];
    var tmp5 = stack_im[0];
    if (isNaN(tmp1) || tmp1 == "") {
        tmp1 = "0";
    }
    if (tmp2 == '') tmp2 = tmp1;
    stack[0] = stack[1];
    stack_im[0] = stack_im[1];
    stack[1] = tmp1;
    stack_im[1] = tmp5;
    hisstack[0] = hisstack[1];
    hisstack[1] = tmp2;
    hisopstack[0] = hisopstack[1];
    hisopstack[1] = tmp3;
    opstack[0] = opstack[1];
    opstack[1] = tmp4;
    computed = true;
    display();
    info(_lg.swap + ' x-y');
}

function mod() { //modulo (division remainder)
    var x = Decimal(stack[0]);
    if (x.isZero()) {
        stack[0] = Number.POSITIVE_INFINITY;
    } else {
        stack[0] = Decimal(stack[1]).mod(x).toString();
    }
}

function gcd() { //greatest common divisor
    var a = Decimal(stack[0]);
    var b = Decimal(stack[1]);
    if (a.round() == a.toString() && b.round() == b.toString() && a >= 0 && b >= 0) {
        stack[0] = gcd2(a.toString(), b.toString());
    } else {
        stack[0] = _lg.error;
    }
}

function lcm() { //least common multiple
    var a = Decimal(stack[0]);
    var b = Decimal(stack[1]);
    if (a.round() == a.toString() && b.round() == b.toString() && a >= 0 && b >= 0) {
        stack[0] = a.times(b).div(gcd2(a.toString(), b.toString()));
    } else {
        stack[0] = _lg.error;
    }
}

function gcd2(a, b) {
    if (b == '0') {
        return a;
    } //Euclidean algorithm
    else {
        return gcd2(Decimal(b).toString(), Decimal(a).mod(b));
    }
}

function changeSign() {
    var x_re = Decimal(stack[0]);
    var x_im = Decimal(stack_im[0]);
    // fillundostack();
    // makehisstack('*-1');
    stack[0] = x_re.neg();
    stack_im[0] = x_im.neg();
    // display();
}
