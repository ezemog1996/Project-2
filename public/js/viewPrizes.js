$(document).ready(function() {

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