
$(document).ready(function(){

$.ajax({
    url: "https://api.rainforestapi.com/request?api_key=C042717A282A49FAAABB8D1663D1E7B7&amazon_domain=amazon.com&type=search&search_term=phone case",
    type: "GET",
    dataType: "JSON",

}).then(function(data){
    
console.log(data.search_results);
}).catch(function(error){
console.log(error);
})

});


// $searchString = trim($searchString);