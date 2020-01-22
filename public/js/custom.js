console.log("started yet")
$(document).ready(function(){
    //for filter
    $("#filter").show()
    var a = $('.custom-control-input').val();
    console.log(a)
    $('.filterproduct').click(function(){
        $('#filter').hide()
        // var checkboxes = document.getElementsByClassName("checkbox");
        // var name =[]

        // for (var i = checkboxes.length -1 ; i>= 0; i--) {
        //     if (checkboxes[i].type === "checkbox" && checkboxes[i].checked) {
        //         name.push(checkboxes[i].value);
        //     }
        // }
    
        // var link = "/filter/product?";
    
        // for(var i = 0; i <= name.length; i++){
        //     link += "productName=" + namer[i] + "&";
        // }
    
        // $(this).attr("href", link);
        
      var favorite = []
      var category =[]
    
      
        
        $.each($("input[name='productName']:checked"), function(){
            favorite.push($(this).val());
        });
       
        
        // var url=favorite[0];
        for(var i=0;i<favorite.length ;i++){
            window.location.href='/filter/product/?productName='+favorite[i]
          
        }
 

          
        
       
   
})
$('.filtercategory').click(function(){
    console.log("helllo9")
    $('#filter').hide()
  
    
  
  var category =[]

  
    
    $.each($("input[name='category']:checked"), function(){
        category.push($(this).val());
    });
    console.log(category)
    
    // var url=favorite[0];
    for(var i=0;i<category.length ;i++){
        window.location.href='/filter/category/?category='+category[i]
      
    }

    var checkboxescategory = document.getElementsByClassName('subcategory');
    // var checkboxes1 = document.getElementsByClassName('categoryfilter')
    
    for (var i=0; i<checkboxescategory.length; i++)  {
      if (checkboxescategory[i].type == 'checkbox')   {
        checkboxescategory[i].checked = true;
      }
    }
      
    
   

})
// $('#categoryfilter').click(function(){
//     var category = []
//     $.each($("input[name='category']:checked"), function(){
//         favorite.push($(this).val());
//     });
//     console.log(category)

// })

var checkboxes = document.getElementsByClassName('filter');
// var checkboxes1 = document.getElementsByClassName('categoryfilter')

for (var i=0; i<checkboxes.length; i++)  {
  if (checkboxes[i].type == 'checkbox')   {
    checkboxes[i].checked = true;
  }
}




       
        
//pin code api 
    $('#pin').hide()
    $('#service').hide()
    console.log("hello")
    $('#searchpincode').click(function(){
        console.log("hehhehe")
    
        $.ajax({
    
            type: "GET",
            url: "https://api.postalpincode.in/pincode/"+$('#pincode').val(),
          
            success: function(data){
                console.log(data[0].PostOffice[0].Pincode)
                bootstrap_alert = function() {}
                bootstrap_alert.warning = function(message) {
                    $('#error').html('<div class="alert"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')
                }
                
                if($('#pincode').val() === data[0].PostOffice[0].Pincode){
                    $('#pin').show()
                    $('#service').show()
                    $('#message').hide()
                    
                    var area=data[0].PostOffice[0].District
                    console.log(area)
                    
                    $('#pindata').append(area)
                    return;
                }
               
                else{
                    bootstrap_alert.warning('Unfortunately we do not ship to your pincode');
                }
                
                
               
               
            }
    
        }); // Ajax Call
    }); //event handler

  
  

    $('#data').click(function(){
        console.log("hehhe")
        var Text = $('#search').val();
        window.location.href='/search/?searchText='+Text

    })
    $('#clear').click(function(){
        var subcategory = $('#subcategory').text()
        window.location.href='/category/'+subcategory
    })
    $('#clearcategory').click(function(){
        window.location.href = '/ethinicBazar/product/category/Men'
    })
  
    
})