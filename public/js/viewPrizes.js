$(document).ready(function() {
  const cashBtn = document.querySelectorAll(".cash");

  var id;
  var childId;
  var points;
  var childName

  const confirm = document.querySelector("#confirm");


  cashBtn.forEach(btn => btn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    id = btn.id;
    childId = btn.getAttribute("data-id");
    points = btn.getAttribute("data-points");

    childName = $(`.${childId}`)[0].textContent;
    $(".modal-title").text("Are you sure?")
    document.getElementById("cash?").textContent = `Are you sure you want to cash ${childName}'s points for this item?`;
    $("#losePoints").html(`They will lose ${points} points.`);
  }))

  confirm.addEventListener("click", () => {
    $.ajax({
      method: "DELETE",
      url: `/api/cash_points/${id}/${childId}/${points}`
    }).then(function(res) {
      confirm.classList.add("hide")
      if (res === "They don't have enough points for this item!") {
        $(".modal-title").text("Sorry!");
        document.getElementById("cash?").innerHTML = res;
        $("#losePoints").html("");
      } else {
        $(".modal-title").text("Success!");
        document.getElementById("cash?").innerHTML = `${points} of ${childName}'s points have successfully been cashed for this item`;
        $("#losePoints").html("")
        document.getElementById("close").addEventListener("click", reload);
      }
    })
  })

  function reload() {
    location.reload();
  }

  
  let item = 1;
  
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

});