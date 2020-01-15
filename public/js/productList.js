console.log("wired");

// function reply_click(clicked_id) {
//   console.log(clicked_id);
// }
$(document).ready(
  $("button").on("click", function(e) {
    console.log(e.target.value);
  })
  .ajax({
    type: "POST",
    url: "localhost:7000/add_to_cart",
    data: e.target.value
    success: function(){
      alert("ID successfully sent to server")
    },
    dataType: dataType
  });
);
