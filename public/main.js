var socket = io.connect('http://localhost:3030', { 'forceNew': true });
var image = new Image();
var listOnMemory; 

socket.on('makeList', function(data) {
  listOnMemory = data;
  render(data);
})

// render list on html
function render (data) {
  var html = data.map(function(elem, index) {
    return(`<li data-id=${elem.id}>
              <img src=${elem.image}>
              <div class="description">${elem.description}</div>
              <div class=buttons>
                <div class="action modify"></div>
                <div class="action delete"></div>
               </div>
            </li>`);
  }).join(" ");
  document.getElementById('list').innerHTML = html;
  updateNumberOfElements ();
}

// manage the upload of pictures
var dropBox = document.getElementById('dropBox');

dropBox.ondragover = function () { this.className = 'hover'; return false; };
dropBox.ondragend = function () { this.className = ''; return false; };
dropBox.ondrop = function (e) {
  this.className = '';
  e.preventDefault();

  var file = e.dataTransfer.files[0];
  var reader = new FileReader();
  reader.onload = function (event) {
    image.src = event.target.result; 
    dropBox.style.background = 'url(' + event.target.result + ') no-repeat center';
  };
  reader.readAsDataURL(file);
  return false;
}


//update number of elements on list
function updateNumberOfElements (){
  $("#counter").html($('#list li').length);
}

//validate image to be 320 square
function validateImage(){
  var size = 320;
    if (image.width == size && image.height == size){
      return true;
    }else{
      alert ("Check image dimentions")
      return false;;
    }
}

window.onload = function(){
  // initialization of plugin sortable list
  // every drop element fires and update message to Node to save the order of elements.
  $('#list').sortable({
    update: function(event, ui) {
      var order = []; 
        $('li').each( function(e) {
          var obj = { id: $(this).data('id') , image: $(this).children("img").attr("src"), description: $(this).children("div .description")[0].innerHTML};
          order.push( obj );
        });
      updateNumberOfElements ();
      // send to the front the list of items to render
      socket.emit('update',order);
    }
  });

  // Delete a record from the list
  $( "#list" ).on('click','.delete', function() {

    var elem = this.parentNode.parentNode;
    listOnMemory = listOnMemory.filter(function(e) {
      return e.id !== $(elem).data("id");
    });
    this.parentNode.parentNode.remove();
    updateNumberOfElements ();
    socket.emit('delete',listOnMemory);
  });

  // open modal with data from selected item
  $( "#list" ).on('click','.modify', function() {
    $( "#modal" ).removeClass( "hide" )
    var elem = this.parentNode.parentNode;
    $("#id_item").val( $(elem).data("id") );
    $("#dropBox").css("background" , "url(" +$(elem).children("img").attr("src")+ ")" );
    $("#picDescription").val ( $(elem).children(".description")[0].innerHTML );
  });

  // opens blank modal to create new idem 
  $( "body" ).on('click','#addItem', function() {
    $("#modal").removeClass( "hide" )
    $("#id_item").val( "" );
    $("#dropBox").css("background" , "" );
    $("#picDescription").val ( "" );
  });

  // add or update update a record of the list
  $( "#submitButton" ).on('click', function() {
      if ( $("#id_item").val() == "" ){
        //Creation of NEW RECORD
        if (validateImage()){
          var imgSrc = $("#dropBox").attr("style").substring($("#dropBox").attr("style").indexOf('data'), $("#dropBox").attr("style").lastIndexOf('"')); 
          var obj = { id: "i"+new Date().valueOf(), image: imgSrc , description: $(picDescription).val()};
          listOnMemory.push( obj );
          updateNumberOfElements ();
          socket.emit('add',listOnMemory);
          $( "#modal" ).addClass("hide");
        }
      }else{
        //Update of selected record
          var position;
          listOnMemory.some(function(item, i) {
            if (item.id == $("#id_item").val()) {
              position = i;
            }
          });

          var imgSrc = $("#dropBox").attr("style").substring($("#dropBox").attr("style").indexOf('data'), $("#dropBox").attr("style").lastIndexOf('"')); 
          var obj = { id: "i"+new Date().valueOf(), image: imgSrc , description: $(picDescription).val()};

          listOnMemory[position] = obj;
          socket.emit('update',listOnMemory);
          $( "#modal" ).addClass("hide");
      }
  });

  // closes the modal
  $( "#cancelButton" ).on('click', function() {
      $( "#modal" ).addClass("hide");
  });

};












