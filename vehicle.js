// The "Vehicle" class

class Vehicle {
  constructor(x, y) {
    this.obj_type = 'vehicle';
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -0.001);
    this.pos = createVector(x, y);
    this.r = 6;
    this.health = 256;
    this.maxspeed = 1;
    this.maxforce = 0.1;
    this.sensors = this.assingSensors(100);
  }

  assingSensors(dist) {
    let sensors = [];
    let ang = 3;

    for (let i = -PI / ang; i < PI / ang; i += PI / 8) {
      //Outhest loop
      let v3 = p5.Vector.fromAngle(this.velocity.heading() + i);
      v3.mult(1.5 * dist);
      v3.add(this.pos);
      point(v3.x, v3.y);

      let s3 = new Sensor(createVector(v3.x, v3.y), 0, this, 1.5 * dist);
      s3.angle = i;
      sensors.push(s3);
      //Outher loop
      let v = p5.Vector.fromAngle(this.velocity.heading() + i);
      v.mult(dist);
      v.add(this.pos);
      point(v.x, v.y);

      let s = new Sensor(createVector(v.x, v.y), 0, this, dist);
      s.angle = i;
      sensors.push(s);
      // Inner loop
      let v2 = p5.Vector.fromAngle(this.velocity.heading() + i);
      v2.mult(dist / 2);
      v2.add(this.pos);
      point(v2.x, v2.y);

      let s2 = new Sensor(createVector(v2.x, v2.y), 0, this, dist / 2);
      s2.angle = i;
      sensors.push(s2);
    }

    return sensors;
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
    // Slowdown in time
    this.velocity.mult(0.98);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY

  search(target) {
    for (let sensor of this.sensors) {
      if (sensor.state == 1) {
        this.arrive(sensor);
        // this.seek(target);

      }
    }
  }

  seek(target) {
    // A vector pointing from the location to the target
    var desired = p5.Vector.sub(target.pos, this.pos);

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.add(target.velocity); // Arrive Motion

    this.applyForce(steer);
  }

  arrive(target) {
    // A vector pointing from the location to the target
    var desired = p5.Vector.sub(target.pos, this.pos);

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.add(target.velocity); // Arrive Motion
    steer.limit(this.maxforce); // Limit to maximum steering force

    this.applyForce(steer);
  }

  display(target) {

    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + PI / 2;
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

    //Also show attached sensors 
    this.showSensors(target);
  }

  showSensors(target) {
    for (let s of this.sensors) {
      s.update(target);
      s.display();
    }
  }
}

