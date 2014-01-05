function sub(x, y) {
//#ifdef DEBUG
    console.log("sub(" +  x + ", " + y + ")");
//#endif
    return x - y;
}

sub(1, 2);
sub(3, 4);