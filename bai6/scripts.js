var a = 1;
var b = 0;
var pheptinh = 'chia';
if (pheptinh === 'cong') {
    var result = a + b;
} else if (pheptinh === 'tru') {
    var result = a - b;
} else if (pheptinh === 'nhan') {
    var result = a * b;
} else if (pheptinh === 'chia') {
    if(b === 0) {
        console.log("Không thể chia cho 0");
    } else {
        var result = a / b;
    }
}
console.log(result);