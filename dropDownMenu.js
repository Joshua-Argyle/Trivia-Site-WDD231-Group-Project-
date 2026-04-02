export function dropDown() {
  const dropDown = document.querySelector("#myDropdown");
  const dropDownButton = document.querySelector(".dropbtn")
  const closeBtn = document.querySelector(".close")
if (dropDownButton && dropDown) {


  dropDownButton.onclick = function() {
  dropDown.style.width = "150px";
  document.getElementById("main").style.marginLeft = "150px";
};

// Close the sidebar
closeBtn.onclick = function() {
  dropDown.style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
};
}
}