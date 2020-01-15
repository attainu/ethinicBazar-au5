$("#p-alert").hide();

$("#confirm-password").keyup(function() {
  $("#p-alert").show();
  if ($("#password").val() !== $("#confirm-password").val()) {
    console.log("Not matching");
  } else {
    $("#p-alert").hide();
    console.log("Matching");
  }
});

//onsubmitform= checkPassword()
function checkPassword(form) {
  // If Not same return False.
  if ($("#password").val() !== $("#confirm-password").val()) {
    alert("\nPassword did not match. Please try again...");
    return false;
  }
  // If same return True.
  else {
    return true;
  }
}
