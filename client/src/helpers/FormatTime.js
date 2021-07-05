const FormatTime = (t, forceHours) => {
    let res, sec, min, hour;

    t = Math.max(t, 0);
    sec = Math.floor(t % 60);
    res = (sec < 10) ? '0'+sec : sec;
    t = Math.floor(t / 60);
    min = t % 60;
    res = min+':'+res;
    t = Math.floor(t / 60);

    if (t > 0 || forceHours) {
        if (min < 10) res = '0' + res;
        res = t+':'+res;
    }

    return res;
};
export default FormatTime;