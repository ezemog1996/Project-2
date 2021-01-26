$(document).ready(() => {
  console.log("Ready!");
});

var searchButton = $("#search");

let item = 1;

searchButton.click(function() {
  var search = $("#inputSearch").val();

  $.ajax({
    url: "https://api.rainforestapi.com/request?api_key=C042717A282A49FAAABB8D1663D1E7B7&amazon_domain=amazon.com&type=search&search_term="+ search,
    type: "GET",
    dataType: "JSON",
  }).then(function(data){

    let results = [];

    for (i = 0; i < data.search_results.length; i++) {
      if (data.search_results[i].price) {
        results.push(data.search_results[i]);
      }
    }

    console.log(results);

    let resultsMarkup = "";


    for (i = 0; i < results.length; i++) {
      resultsMarkup += 

          `
          <div class="card m-2" style="width: 18rem;">
            <img src="${results[i].image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${results[i].title}</h5>
              <p class="card-text">Price: ${results[i].price.raw}</p>
              <p>ASIN: ${results[i].asin}</p>
              <a target="_blank" href="${results[i].link}" class="btn btn-danger text-white">View on Amazon</a>
              <button id="${i}" class="addToList mt-1">Add to Wish List</button>
              <button id=${results[i].asin} class="addToCart mt-1">Add to Cart</p>
            </div>
          </div>
          `
    }
    $("#markup-container").html(resultsMarkup);

    const addToListArray = document.querySelectorAll(".addToList");

    for (i = 0; i < addToListArray.length; i++) {
      addToListArray[i].addEventListener("click", function(event) {
        console.log(results[parseInt(event.target.id)])
        $.post("/api/rewards", {
          image: results[parseInt(event.target)].id,
          title: results[parseInt(event.target)].title,
          price: results[parseInt(event.target.id)].price.raw,
          asin: results[parseInt(event.target.id)].asin,
          link: results[parseInt(event.target.id)].link
        }).then(() => {
          alert("Added to list!");
        }).catch();
      })
    }

    const addToCartArray = document.querySelectorAll(".addToCart");

    for (i = 0; i < addToCartArray.length; i++) {
      addToCartArray[i].addEventListener("click", function(event) {
        if (item !== 1) {
          cartMarkup =
          `
          Item ${item}:<br/>
          ASIN:<input class="mt-1" value="${event.target.id}"id="asinForm" type="text" name="ASIN.${item}"/><br/> 
          Quantity:<input class="mt-1 mb-3" value="1" id="quantity" type="text" name="Quantity.${item}"/><br/>
          `

          $("#cartForms").append(cartMarkup);

          item++;
        } else {
          let cartMarkup =
          `
          <div class="row bg-light borderTopSides mt-3" style="border-bottom: 5px solid gold;">
              <div class="col-12 col-sm-12 col-md-12 px-4">
                <div class="col-12 col-sm-12 col-md-12">
                  <div class="row overflow-scroll">
                    <form class="mb-2" id="cart" method="GET" target="_blank" action="https://www.amazon.com/gp/aws/cart/add.html"> 
                      <input class="mt-1" type="hidden" name="AWSAccessKeyId" value="Access Key ID" /><br/> 
                      <input class="mt-1" type="hidden" name="AssociateTag" value="Associate Tag" /><br/> 
                      <h5>Products</h5>
                      <p id="cartForms">Item ${item}:<br/>
                        ASIN:<input class="mt-1" value="${event.target.id}"id="asinForm" type="text" name="ASIN.${item}"/><br/> 
                        Quantity:<input class="mt-1 mb-3" value="1" id="quantity" type="text" name="Quantity.${item}"/><br/> 
                      </p>
                      <input type="submit" name="add" value="add"/> 
                    </form>
                  </div>
                </div>
              </div>
            </div>
          `
          $("#contentContainer").append(cartMarkup);

          item++
        }
      })
    }



    // const addToListArray

  }).catch(function(error){
    alert("We couldn't find what you're looking for");
  })
},





);