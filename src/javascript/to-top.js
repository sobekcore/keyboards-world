// Scroll back to top button
myButton = document.getElementById("top");
myButton.addEventListener("click", backToTop);
window.onscroll = function() { scrollFunction(); };

function scrollFunction()
{
  if(document.documentElement.scrollTop > 350)
  { myButton.style.display = "block"; }
  else { myButton.style.display = "none"; }
}

function backToTop()
{ scroll({ top: 0, behavior: "smooth"} ); }
