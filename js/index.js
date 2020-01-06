count = 1
let contents = [["レビュー内容", "バージョン", "レーティング"]]
function tapped() {
    if (document.getElementById('text-input').value == '') {
        PNotify.notice('IDが入力されていません。');
        count = 1
        exit;
    }
    try {
        getReview(count)
        showPage()
        count++
    } catch (error) {
        console.log(error)
        PNotify.notice('不明なエラーが発生しました。')
    }
}
async function getReview(page) {
    const id = document.getElementById("text-input").value;
    const url = 'https://itunes.apple.com/jp/rss/customerreviews/page=' + page + '/id=' + id + '/json';
    console.log(url)
    const response = await fetch(url, { mode: 'cors' })
    const json = await response.json()
    const entry = json.feed.entry
    if (entry == undefined) {
        PNotify.notice('IDが無効です。');
        count = 1;
        exit;
    }
    entry.forEach(function(value) {
        contents.push([value.content.label, value['im:version'].label, value['im:rating'].label])
        result.innerHTML += value.content.label + "<br/><br/>"
    })
    makeCSV()
}

function makeCSV() {
    let csvData = "data:text/csv;charset=utf-8,"
    contents.forEach(function(rows) {
        const row = rows.join(",")
        csvData += row + "\r\n"
    })
    const encodeUri = encodeURI(csvData)
    const link = document.getElementById("download-csv")
    link.setAttribute("href", encodeUri)
    link.setAttribute("download", "csvdata.csv")
}

function showPage() {
    const object = document.getElementById("output-page-number")
    object.innerHTML = "current page = " + count
}
