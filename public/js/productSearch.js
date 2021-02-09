$(document).ready(() => {
  console.log("Ready!");

  
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
                <button id="${i}" type="button" class="btn btn-primary addToList mt-1" data-bs-toggle="modal" data-bs-target="#exampleModal">Add To Wishlist</button>
                <button id=${results[i].asin} class="addToCart mt-1">Add to Cart</p>
              </div>
            </div>
            `
      }
      $("#markup-container").html(resultsMarkup +
      `<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Need more details for this item</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h6>Who is this reward for?</h6>
              <select id="child" class="form-select" aria-label="Value">
                <option id="selectedChild" selected>Select Child</option>
              </select>
              <h6>How many points is this reward worth?</h6>
              <input id="points" type="text" aria-label="Value of Task" class="form-control" style="max-width: 20rem;">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="confirm" type="button" class="btn btn-primary">Confirm</button>
            </div>
          </div>
        </div>
      </div>`);

      const addToListArray = document.querySelectorAll(".addToList");
      function getChildren() {
        $.get("/api/get_children", function(res) {
          for (i = 0; i < res.length; i++) {
            $("#child").append(`<option value="${res[i].id}">${res[i].name}</option>`)
          }
        });
      }
      getChildren();
      
      var image;
      var title;
      var price;
      var asin;
      var link;

      for (i = 0; i < addToListArray.length; i++) {
        addToListArray[i].addEventListener("click", function(event) {
          $("#confirm").removeClass("hide");
          $(".modal-title").text("Need more details for this item");
          $(".modal-body").html(
            `<h6>Who is this reward for?</h6>
            <select id="child" class="form-select" aria-label="Value">
              <option id="selectedChild" selected>Select Child</option>
            </select>
            <h6>How many points is this reward worth?</h6>
            <input id="points" type="text" aria-label="Value of Task" class="form-control" style="max-width: 20rem;">`
          );

          getChildren();

          console.log(results[parseInt(event.target.id)])

          image = results[parseInt(event.target.id)].image;
          title = results[parseInt(event.target.id)].title;
          price = results[parseInt(event.target.id)].price.raw;
          asin = results[parseInt(event.target.id)].asin;
          link = results[parseInt(event.target.id)].link;
          
          
        })
      }

      document.querySelector("#confirm").addEventListener("click", function() {

        const itemData = {
          childId: $("#child").val(),
          points: $("#points").val(),
          image,
          title,
          price,
          asin,
          link
        }

        console.log(itemData);

        $.post("/api/add_reward", itemData).then(() => {
          $("#confirm").addClass("hide");
          $(".modal-title").text("Success!")
          $(".modal-body").text(`Item added to ${$("#child").find("option:selected").text()}'s rewards!`)
        }).catch();
      })

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
});

  

