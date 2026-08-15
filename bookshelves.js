// console.log("IN DA SCRIPT!")
export default function bookshelves(url, json, id) {
    fetch(url + json, { cache: "no-store" })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            // console.log(data, id)
            const dest = document.getElementById(id)
            const pick = Math.floor(Math.random() * data.length)
            dest.src = url + data[pick]
            dest.parentNode.href = url + "scatter/?image=/" + data[pick] // .replace("thumbs/", "thumbs2/")
            console.log(`random pick from ajax response: ${dest.src}`)
        }).catch(function (err) {
            alert("Request failed: " + err.message);
        })
    return `sent ajax GET ${url + json}`
}