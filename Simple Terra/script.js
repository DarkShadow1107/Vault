setStargazer = {
  // Set quantity of genereted Elements
    quantity: 500,
  // Set id or class of parent element which shell contain the generated Elemenets
    selectContainer: "body",
  // Set the Tag name of the generated item (Div, Span, p, etc.)
    generateItemTag: "span",
  // Set classname which will title the generated Elements (also id -> classname-i will be generated)
    generateItemClass: "backgroundstars",
  // Morphclass will be the classname of morphed Elements to set morph state of generated elements
    setMorphClass: "blink",
  // Morphspeed will set how fast the Morph will be executed in milliseconds
    setMorphSpeed: 1000,
  // Morphquantity will set how many Elements will morph in a MorpSpeed execution
    setMorphQuantity: 160,
  // Morphquantity will set how many Elements will morph in a MorpSpeed execution
    devMode: "on"
};
  
document.addEventListener("DOMContentLoaded", function() {
  
  //////
  // Execution

  // Select star-divs
    const CONTAINER = document.querySelector(setStargazer["selectContainer"]);

  // Set while loop for generating stars
    let quantityCounter = 0;
    while ( setStargazer["quantity"] >= quantityCounter ){
      CONTAINER.insertAdjacentHTML('afterbegin', '<div class="' + setStargazer["generateItemClass"] + '" id="' + setStargazer["generateItemClass"] + '-' + quantityCounter +'"></div>');
      ++quantityCounter;
    };

  // Selct generatedItems by class
    const GENERATEDITEM = document.querySelectorAll(setStargazer["selectContainer"] + " > ." + setStargazer["generateItemClass"]);
    
  // Set counter  
    let i = 0;
  // Select every star and reposition it by coincidence
    GENERATEDITEM.forEach( function() {
      // defining x coordinate
        let x = Math.floor((Math.random() * 99) + 1);
      // defining y coordinate
        let y = Math.floor((Math.random() * 99) + 1);
      // Setting star position x & Y
        GENERATEDITEM[i].style.left = x + "%";
        GENERATEDITEM[i].style.top = y + "%";
      // Counting up the counter
        ++i;
    });


  //////
  // lets do some bling bling (super easy, super simple) 

  // Setup interval timing
    function blink(){
      // Setup of a random selektor
        let startID = Math.floor((Math.random() * 100) + 1);
      // Selekting random star
        let selection = document.querySelector( "#" + setStargazer["generateItemClass"] + "-"+ startID);
      // Adding blink-classs to selektion
        selection.classList.add(setStargazer["setMorphClass"]);
        setTimeout(function(){ 
          // Removing Blink-class after timeout
            selection.classList.remove(setStargazer["setMorphClass"]);
        }, setStargazer["setMorphSpeed"]/2);
    };

  // Let the magic beginn
    setInterval( blink, setStargazer["setMorphSpeed"]/setStargazer["setMorphQuantity"] );
  
});
  
// Setting up the comet event
  document.querySelector(".fire-comet").addEventListener( "click", function() {
    
  let comet = document.querySelector("#comet").classList;
  let btnStatus = this;
    
  comet.add("fire");
  btnStatus.style.backgroundColor = "#999";

  setTimeout(function(){ 
    comet.remove("fire");
    btnStatus.style.backgroundColor = "#fff"; 
  }, 1000);
    
});
  
// Setting up the ufi event
  document.querySelector(".fire-ufo").addEventListener( "click", function() {
    
  let comet = document.querySelector("#ufo").classList;
  let btnStatus = this;
    
  comet.add("fire");
  btnStatus.style.backgroundColor = "#999";

  setTimeout(function(){ 
    comet.add("explode");
  }, 5000);

  setTimeout(function(){ 
    comet.add("done");
  }, 10000);

  setTimeout(function(){ 
    comet.remove("fire");
    btnStatus.style.backgroundColor = "#fff"; 
  }, 10000);
    
});
  
// Setting up the explode event
  document.querySelector(".explode-earth").addEventListener( "click", function() {

  let comet = document.querySelector(".orbit").classList;
  let btnStatus = this;
    
  comet.add("fire");
  btnStatus.style.backgroundColor = "#999";

  setTimeout(function(){ 
    comet.add("explode");
  }, 2500);

  setTimeout(function(){ 
    comet.add("done");
  }, 5000);

  setTimeout(function(){ 
    comet.remove("fire");
    btnStatus.style.backgroundColor = "#fff"; 
  }, 10000);

  setTimeout(function(){ 
    comet.remove("fire");
    comet.remove("explode");
    comet.remove("done");
    btnStatus.style.backgroundColor = "#fff"; 
  }, 12500);
    
});