console.log("started yet")
$(document).ready(function(){
    //for filter
    $("#filter").show()
    $('.custom-control-input').click(function(){
        $('#filter').hide()
        if( $(this).is(':checked')) {
            $("#filter").hide();
            $.ajax({type:'get', 
            dataType:'json' ,
            url: "/api/category",
        success: function(data)
        {
        var favorite = [];
        var subcategory = [];
        data.forEach(function(ele,ind){
            subcategory.push(ele.subcategory)
        })
        
        $.each($("input[name='category']:checked"), function(){
            favorite.push($(this).val());
        });
        const intersection = [...new Set(data.filter(element => favorite.includes(element.subcategory)))]
                
        for(var i=0 ;i<intersection.length;i++){
                var html = ' <div class="col-md-3 ml-5 shadow1  ">';
                html += ' <div class="row" >';
                html += '<i class="fas fa-heart" style="margin:20px; width:"></i>';
                html += '<div class="col-md-9 offset-3 userimg" ><img class="card-img-top" src="'+intersection[i].url+'" alt="..."> </div>';
                html += ' </div>';
                html += '<ul>';
                html += '<li>';
                html += '<p class="product-title " id="title">'+intersection[i].name+ '</p>';
                html += ' </li>';
                html += '<li>';
                html += ' <div>';
                html += '<p class="discount-container" style="text-align: center;"> ';
                html += ' <span class="after-discount"> <strong style="font-family: Whitney-SemiBold, Whitney;color: #282C3F;font-size: 20px;">'+intersection[i].price+'</strong> </span></b> </h2>';
                html += ' <span class="discount-mrp"><s><!-- react-text: 60 -->Rs.5555 <!-- /react-text --><!-- react-text: 61 --><!-- /react-text --></s></span>';
                html += '<span class="discount">(40% OFF)</span>';
                html += '</p>';
                html += '</div>';
                html += '</li>';
                html += ' <li>';
                html += '<div class="filled-stars" style="width:84.00000000000001%; text-align:center;">';
                html += '<span class="fa fa-star checked"></span>';
                html += '<span class="fa fa-star checked"></span>';
                html += '<span class="fa fa-star checked"></span>';
                html += '<span class="fa fa-star checked"></span>';
                html += '<span class="fa fa-star checked"></span>';
                html += '</div>';
                html += '</li>';
                html += '</ul>'
                html += '</div>';
                $('#printcard').append(html);
                return;
                
        }
        
        }});
    
    } else {
        $("#filter").show();
    }
})

       
        
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
  
    
})