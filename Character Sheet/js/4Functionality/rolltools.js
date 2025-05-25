function randbetween(lo, hi) {
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function checkcritfail(rollval) {
    if (rollval == 1) { return "fail" }
    else if (rollval == 10) { return "success" }
    else {
        return "none";
    }
}
