// console.log("IN DA SCRIPT!")
function bookshelves(url, json, id) {
    $.ajax({
        type: "GET",
        dataType: "json",
        cache: false,
        url: url + json,
    }).done(function (data, textStatus, jqXHR) {
        // console.log(data, id)
        const dest = document.getElementById(id)
        const pick = Math.floor(Math.random() * data.length)
        dest.src = url + data[pick]
        dest.parentNode.href = url + "scatter/?type=rgb&image=/" + data[pick]
        // console.log(dest.src)
    }).fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    })
}