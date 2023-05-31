class KeyPressListener {
   constructor(keyCode, callback) {
     this.isKeyPressed = false;
     this.keydownFunction = function(event) {
       if (event.code === keyCode) {
         if (!this.isKeyPressed) {
           this.isKeyPressed = true;
           callback();
           this.intervalId = setInterval(callback, 100); // Adjust the interval as needed
         }
       }
     }.bind(this);
     this.keyupFunction = function(event) {
       if (event.code === keyCode) {
         this.isKeyPressed = false;
         clearInterval(this.intervalId);
       }
     }.bind(this);
     document.addEventListener("keydown", this.keydownFunction);
     document.addEventListener("keyup", this.keyupFunction);
   }
 
   unbind() { 
     document.removeEventListener("keydown", this.keydownFunction);
     document.removeEventListener("keyup", this.keyupFunction);
     if (this.isKeyPressed) {
       clearInterval(this.intervalId);
     }
   }
 }
 