

    // Password Matching
    $('#confirm_password').on('keyup', function () {
      if ($('#password').val() == $('#confirm_password').val()) {
          $('#message').html('Password Matching').css('color', 'yellow');
      } else 
          $('#message').html('Not Matching').css('color', 'red');
    });

    function checkPassword(form) { 
            
      
      if ($('#password').val() !== $('#confirm_password').val()) { 
          alert ("\nPassword did not match: Please try again...") 
          return false; 
      } 

      
      else{ 
          
        return true; 
      } 
    }

 
    //Delete Account
    function deleteSelected(event) {

        var confirmation = confirm('Are you sure you want to delete this user?');
      
        
        if (confirmation === true) {
      
         
          $.ajax({
            type: 'DELETE',
            url: '/deleteaccount/' + $('#btndel').attr('value')
          }).done(function( response ) {
      
            
            if (response.msg === '') {
              window.location.href = "/logout";
               
            }
            else {
              alert('Error: ' + response.msg);
             
            }
        
          });
      
        }
        else {
      
          return false;
      
        }
      
      };

    //Delete a product
    $(".btn.btn-primary.btnprod").click(function() {
      var attrval =  $(this).attr('value')
    
      var confirmation = confirm('Are you sure you want to delete this product?');

    
      if (confirmation === true) {

        
        $.ajax({
          type: 'DELETE',
          url: '/deleteitem/' + attrval
        }).done(function( response ) {
      
          if (response.msg === '') {
              window.location.href = "/listings";
          }
          else {
            alert('Error: ' + response.msg);
          }

        });

      }
      else {

        // If they said no to the confirm, do nothing
        return false;

      }

    });


   

