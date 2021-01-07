import $ from 'jquery';


$( document ).ready(function() {
    var listDiv = $( "#root" ).nextAll();
    listDiv.each(function( index ) {
        if($(this).prop("tagName") === 'DIV'){
            listDiv[index].setAttribute('hidden','hidden')
        }

    });
});