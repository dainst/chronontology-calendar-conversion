
/* Copyright: http://www.islamicity.com/PrayerTimes/defaultHijriConv.asp */

function intPart(floatNum){
    if (floatNum< -0.0000001){
        return Math.ceil(floatNum-0.0000001)
    }
    return Math.floor(floatNum+0.0000001)
}

function convert_ad_ah(ad, ah) {
    console.debug("element ad:", ad.value, "> ah:", ah.value);
    ah.value = convert_text_to_dates("C", ad.value);
}

function convert_ah_ad(ah, ad) {
    console.debug("element ah:", ah.value, "> ad:", ad.value);
    ad.value = convert_text_to_dates("H", ah.value);
}

function convert_text_to_dates(format, txt) {
    // convert dates
    var txt = txt.trim();
    var from, to, spl, has_to, to_date, from_date;
    if (txt.length == 0) {
        return [null, null];
    }
    spl = txt.split(" - ");
    from = spl[0].trim()
    if (spl.length > 1) {
        to = spl[1].trim()
        has_to = true
    }

    console.debug(format, txt, spl, "from:", from, "to:", to);// , "from_date:", from_date, "to_date:", to_date);
    from_date = convert_text_to_date(format, from);
    if (has_to) {
        to_date = convert_text_to_date(format, to)
    }


    if (has_to) {
        return from_date+" - "+to_date;
    } else {
        return from_date;
    }
}

function convert_text_to_date(format, txt) {
    var spl, year, month, day, mode, use_format;

    console.debug("convert:", txt);

    if (txt == null) {
        return null;
    }
    if (txt.indexOf(".") > -1) {
        spl = txt.split(".");
        day = spl[0];
        month = spl[1];
        year = spl[2];
        mode = ".";
    } else {
        // this also covers the "year only case"
        spl = txt.split("-");
        year = spl[0];
        month = spl[1];
        day = spl[2];
        mode = "-";
    }

    var map = {}
    map[format+"Day"] = parseInt(day) || 1;
    map[format+"Month"] = parseInt(month) || 1;
    map[format+"Year"] = parseInt(year);

    if (format == "C") {
        GregToIsl(map);
    } else {
        IslToGreg(map);
    }

    if (format == "C") {
        use_format = "H";
    } else {
        use_format = "C";
    }

    if (mode == "-") {
        arr = [
            map[use_format+"Year"],
            map[use_format+"Month"],
            map[use_format+"Day"]
        ];
    } else {
        arr = [
            map[use_format+"Day"],
            map[use_format+"Month"],
            map[use_format+"Year"]
        ];
    }

    console.debug(txt, map);
    if (spl.length == 1) {
        // mode is always "-"
        return arr[0];
    } else {
        return arr.join(mode);
    }
}

function isnumeric(num)  {
    var strlen = num.length
    var i
    for ( i = 0; i < strlen ; ++i ) {
        //if (!((num.charAt(i) >= '0') && (num.charAt(i)<='9') || (num.charAt(i)=='.')))
        if (!((num.charAt(i) >= '0') && (num.charAt(i)<='9') || (num.charAt(i)=='.') || (num.charAt(i)=='-')))
        {
            return false;
        }
    }
}

function GregToIsl(arg) {

    if(gvalidate(arg)==false){
        return false
    }

    d=parseInt(arg.CDay)
    m=parseInt(arg.CMonth)
    y=parseInt(arg.CYear)
    delta=0

    if ((y>1582)||((y==1582)&&(m>10))||((y==1582)&&(m==10)&&(d>14)))
    {
        //added delta=1 on jd to comply isna rulling 2007
        jd=intPart((1461*(y+4800+intPart((m-14)/12)))/4)+intPart((367*(m-2-12*(intPart((m-14)/12))))/12)-
            intPart( (3* (intPart(  (y+4900+    intPart( (m-14)/12)     )/100)    )   ) /4)+d-32075+delta
    }
    else
    {
        //added +1 on jd to comply isna rulling
        jd = 367*y-intPart((7*(y+5001+intPart((m-9)/7)))/4)+intPart((275*m)/9)+d+1729777+delta
    }
    // arg.JD.value=jd
    //added -1 on jd1 to comply isna rulling
    jd1=jd-delta
    // arg.wd.value=weekDay(jd1%7)
    l=jd-1948440+10632
    n=intPart((l-1)/10631)
    l=l-10631*n+354
    j=(intPart((10985-l)/5316))*(intPart((50*l)/17719))+(intPart(l/5670))*(intPart((43*l)/15238))
    l=l-(intPart((30-j)/15))*(intPart((17719*j)/50))-(intPart(j/16))*(intPart((15238*j)/43))+29
    m=intPart((24*l)/709)
    d=l-intPart((709*m)/24)
    y=30*n+j-30

    arg.HDay=d
    arg.HMonth=m
    arg.HYear=y
}
function IslToGreg(arg) {

    if(hvalidate(arg)==false){
        return false
    }

    d=parseInt(arg.HDay)
    m=parseInt(arg.HMonth)
    y=parseInt(arg.HYear)
    //added - delta=1 on jd to comply isna rulling
    jd=intPart((11*y+3)/30)+354*y+30*m-intPart((m-1)/2)+d+1948440-385-delta
    // arg.JD.value=jd
    // arg.wd.value=weekDay(jd%7)
    if (jd> 2299160 )
    {
        l=jd+68569
        n=intPart((4*l)/146097)
        l=l-intPart((146097*n+3)/4)
        i=intPart((4000*(l+1))/1461001)
        l=l-intPart((1461*i)/4)+31
        j=intPart((80*l)/2447)
        d=l-intPart((2447*j)/80)
        l=intPart(j/11)
        m=j+2-12*l
        y=100*(n-49)+i+l
    }
    else
    {
        j=jd+1402
        k=intPart((j-1)/1461)
        l=j-1461*k
        n=intPart((l-1)/365)-intPart(l/1461)
        i=l-365*n+30
        j=intPart((80*i)/2447)
        d=i-intPart((2447*j)/80)
        i=intPart(j/11)
        m=j+2-12*i
        y=4*k+n+i-4716
    }

    arg.CDay=d
    arg.CMonth=m
    arg.CYear=y

}


function hvalidate(arg) {
    var hdays=new Array(30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29);
    var dh,mh,yh,m1h,leaph;
    dh=arg.HDay;
    mh=arg.HMonth;
    yh=arg.HYear;

    if(arg.HYear=="")
    {
        alert("Hijri Year can not be empty");
        return false;
    }

    if(isnumeric(yh)==false)
    {
        alert("Hijri Year should be in numerics")
        return false;
    }


    m1h=yh%30;

   //the 2nd, 5th, 7th, 10th, 13th, 16th, 18th, 21st, 24th, 26th, and 29th years are leap years.

    leaph=((mh==12)&&(m1h==2||m1h==5||m1h==7||m1h==10||m1h==13||m1h==16||m1h==18||m1h==21||m1h==24||m1h==26||m1h==29))?1:0;
    if(dh>(hdays[mh-1]+leaph))
    {
        alert(mh+"/"+dh+"/"+yh+" is not a valid Hijri date.");
        return false;
    }

    return true;
}


//adji added

function gvalidate(arg) {
    var cdays=new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var yleap,d,m,y,m1,m2,m3,leap;
    d=arg.CDay;
    m=arg.CMonth;
    y=arg.CYear;

    if(arg.CYear=="") {
         alert("Gregorian Year can be not empty");
        return false;
    }

    if(isnumeric(y)==false) {
        alert("Gregorian Year should be in numerics")
        return false;
    }

    m1=y%4;
    m2=y%100;
    m3=y%400;

    leap=((m==2)&&((m3==0)||((m1==0)&&(m2!=0))))?1:0;
    if(d>(cdays[m-1]+leap))
    {
        alert(m+"/"+d+"/"+y+" is not a valid Gregorian date.");
        return false;
    }
    return true;
}

//adji added

