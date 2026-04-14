let student={
    name : "sudarshan",
    math: 85,
    science : 90,
    english : 78,
    history : 88,
    geography : 92
}

function calculateTotal(){
    let total = student.math + student.science + student.english + student.history + student.geography;
    console.log(total)
}
calculateTotal();