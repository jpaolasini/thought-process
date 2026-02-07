document.querySelector(".theme-toggle")?.addEventListener("click",()=>{
document.documentElement.dataset.theme =
document.documentElement.dataset.theme==="dark"?"light":"dark";
});