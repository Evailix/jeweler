time = null

function show_message() {
    clearTimeout(time)
    message = document.getElementById("message")
    message.innerText = "Скопійовано"
    message.style.display = "block"
    message.style.top = `${event.pageY}`
    message.style.left = `${event.pageX}`
    time = setTimeout(()=>{
        message.style.display = "none";
    }, 1000)
}

function copyToClipboard(text) {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(text);
    }
    else {
        alert(text);
    }
}