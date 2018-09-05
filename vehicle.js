// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class

class Vehicle {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -0.001);
    this.pos = createVector(x, y);
    this.r = 6;
    this.maxspeed = 8;
    this.maxforce = 0.2;
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.pos.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {

    var desired = p5.Vector.sub(target.pos, this.pos); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    this.applyForce(steer);
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + PI/2;
    fill(127);
    stroke(200);
    strokeWeight(2);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
    
    this.see();
  }

  see() {

    let theta = this.velocity.heading() + PI/2;

    fill('red');
    // noStroke();
    stroke(255);
    strokeWeight(2);
    push();
    translate(this.pos.x , this.pos.y - 2*this.r);
    rotate(theta);
    beginShape();

    // sensors
    push()
    for(let i = -PI/3 ; i < PI/3 ; i+= PI/20){ 
      rotate(i);
      stroke('green');
      point(0,-50);
      rotate(-i);
    }
    pop()
    
    endShape();
    pop();
  }
}