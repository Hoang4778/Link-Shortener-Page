let urls = []
let childNodes = ""

$(document).ready(() => {
    urls = localStorage.getItem("URLs") ? JSON.parse(localStorage.getItem("URLs")) : []
    urls.forEach(item => {
        childNodes += `
            <div class="bg-white rounded-[.5rem] py-4 px-4 grid grid-cols-[9fr_1fr] items-center gap-4 max-[500px]:grid-cols-[1fr] max-[500px]:mx-4 max-[500px]:px-0">
                <div class="flex justify-between items-center max-[700px]:flex-col max-[700px]:items-start max-[500px]:gap-4">
                    <p class="max-[500px]:border-b max-[500px]:w-full max-[500px]:pb-2 max-[500px]:border-slate max-[500px]:px-4 max-[500px]:break-all">${item.originalUrl}</p>
                    <p class="text-cyan max-[500px]:px-4">${item.shortenedUrl}</p>
                </div>
                <button class="bg-cyan py-4 w-30 text-white font-bold rounded-[.5rem] hover:opacity-50 max-[500px]:mx-4" onclick="copyToClipboard(this)">Copy</button>
            </div>
        `
    });
    $("#link-list").append(childNodes)
})

function copyToClipboard(element) {
    const copiedLinked = element.previousElementSibling.lastElementChild.textContent
    navigator.clipboard.writeText(copiedLinked)
    element.textContent = "Copied!"
    element.classList.add("bg-dark-blue")
    setTimeout(() => {
        element.classList.remove("bg-dark-blue")
        element.textContent = "Copy"
    }, 3000)
}


$("#link-input").on("input", () => {
    $("#link-input").removeClass("placeholder:text-red outline outline-red")
    $("#error-message").addClass("hidden")
})

$("form").submit((e) => {
    e.preventDefault();
    if ($("#link-input").val()) {
        let input = $("#link-input").val()
        if (!input.includes("https://")) {
            input = "https://" + input
        }
        $.get(`https://api.shrtco.de/v2/shorten?url=${input}`, (res) => {
            urls.unshift({
                originalUrl: input,
                shortenedUrl: res.result["full_short_link"]
            })
            const newLink = `
            <div class="bg-white rounded-[.5rem] py-4 px-4 grid grid-cols-[9fr_1fr] items-center gap-4 max-[500px]:grid-cols-[1fr] max-[500px]:mx-4 max-[500px]:px-0">
                <div class="flex justify-between items-center max-[700px]:flex-col max-[700px]:items-start max-[500px]:gap-4">
                    <p class="max-[500px]:border-b max-[500px]:w-full max-[500px]:pb-2 max-[500px]:border-slate max-[500px]:px-4 max-[500px]:break-all">${input}</p>
                    <p class="text-cyan max-[500px]:px-4">${res.result["full_short_link"]}</p>
                </div>
                <button class="bg-cyan py-4 w-30 text-white font-bold rounded-[.5rem] hover:opacity-50 max-[500px]:mx-4" onclick="copyToClipboard(this)">Copy</button>
            </div>`
            $("#link-list").prepend(newLink)
        })
        $("#link-input").val("")

    } else {
        $("#link-input").addClass("placeholder:text-red outline outline-red")
        $("#error-message").removeClass("hidden")
    }
})

window.onunload = () => {
    localStorage.setItem("URLs", JSON.stringify(urls))
}

$("#hamburger").click(() => {
    $("#menu").toggleClass("max-[600px]:hidden")
})