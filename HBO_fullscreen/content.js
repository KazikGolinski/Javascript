
var video = document.body.querySelector('.video-js .vjs-tech');
if (video.getAttribute("style") == null) {
    video.setAttribute("style", "height: 134.375% !important; transform: translateY(-12.79%) !important;"); 
} else {
    video.removeAttribute("style"); 
}
