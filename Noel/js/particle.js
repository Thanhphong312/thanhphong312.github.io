/*
 * Settings
 */
var settings = {
  particles: {
    length: 2000, // maximum amount of particles
    duration: 8, // particle duration in sec
    velocity: 9, // particle velocity in pixels/sec
    effect: -0.75, // play with this for a nice effect
    size: 90, // particle size in pixels
  },
};

/*
 * RequestAnimationFrame polyfill by Erik M?ller
 */
(function() {
  var b = 0;
  var c = ["ms", "moz", "webkit", "o"];
  for (var a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
    window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[c[a] + "CancelAnimationFrame"] ||
      window[c[a] + "CancelRequestAnimationFrame"];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(h, e) {
      var d = new Date().getTime();
      var f = Math.max(0, 16 - (d - b));
      var g = window.setTimeout(function() {
        h(d + f);
      }, f);
      b = d + f;
      return g;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(d) {
      clearTimeout(d);
    };
  }
})();

/*
 * Point class
 */
var Point = (function() {
  function Point(x, y) {
    this.x = typeof x !== "undefined" ? x : 0;
    this.y = typeof y !== "undefined" ? y : 0;
  }
  Point.prototype.clone = function() {
    return new Point(this.x, this.y);
  };
  Point.prototype.length = function(length) {
    if (typeof length == "undefined")
      return Math.sqrt(this.x * this.x + this.y * this.y);
    this.normalize();
    this.x *= length;
    this.y *= length;
    return this;
  };
  Point.prototype.normalize = function() {
    var length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  };
  return Point;
})();

/*
 * Particle class
 */
var Particle = (function() {
  function Particle() {
    this.position = new Point();
    this.velocity = new Point();
    this.acceleration = new Point();
    this.age = 0;
  }
  Particle.prototype.initialize = function(x, y, dx, dy) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.acceleration.x = dx * settings.particles.effect;
    this.acceleration.y = dy * settings.particles.effect;
    this.age = 0;
  };
  Particle.prototype.update = function(deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    this.age += deltaTime;
  };
  Particle.prototype.draw = function(context, image) {
    function ease(t) {
      return --t * t * t + 1;
    }
    var size = image.width * ease(this.age / settings.particles.duration);
    context.globalAlpha = 1 - this.age / settings.particles.duration;
    context.drawImage(
      image,
      this.position.x - size / 2,
      this.position.y - size / 2,
      size,
      size
    );
  };
  return Particle;
})();

/*
 * ParticlePool class
 */
var ParticlePool = (function() {
  var particles,
    firstActive = 0,
    firstFree = 0,
    duration = settings.particles.duration;

  function ParticlePool(length) {
    // create and populate particle pool
    particles = new Array(length);
    for (var i = 0; i < particles.length; i++)
      particles[i] = new Particle();
  }
  ParticlePool.prototype.add = function(x, y, dx, dy) {
    particles[firstFree].initialize(x, y, dx, dy);

    // handle circular queue
    firstFree++;
    if (firstFree == particles.length) firstFree = 0;
    if (firstActive == firstFree) firstActive++;
    if (firstActive == particles.length) firstActive = 0;
  };
  ParticlePool.prototype.update = function(deltaTime) {
    var i;

    // update active particles
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].update(deltaTime);
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].update(deltaTime);
      for (i = 0; i < firstFree; i++) particles[i].update(deltaTime);
    }

    // remove inactive particles
    while (
      particles[firstActive].age >= duration &&
      firstActive != firstFree
    ) {
      firstActive++;
      if (firstActive == particles.length) firstActive = 0;
    }
  };
  ParticlePool.prototype.draw = function(context, image) {
    // draw active particles
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].draw(context, image);
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].draw(context, image);
      for (i = 0; i < firstFree; i++) particles[i].draw(context, image);
    }
  };
  return ParticlePool;
})();

/*
 * Putting it all together
 */

(function(canvas) {
  var context = canvas.getContext("2d"),
    particles = new ParticlePool(settings.particles.length),
    particleRate = settings.particles.length / settings.particles.duration, // particles/sec
    time;

  // get point on heart with -PI <= t <= PI
  function pointOnHeart(t) {
    return new Point(
      160 * Math.pow(Math.sin(t), 3),
      130 * Math.cos(t) -
      50 * Math.cos(2 * t) -
      20 * Math.cos(3 * t) -
      10 * Math.cos(4 * t) +
      25
    );
  }
  if(window.innerWidth<=980){
    //han n
    function pointN1(t) {
      return new Point(
        1,
        -40*t
      );
    }
    function pointN2(t) {
      return new Point(
        16*t+49,
        -40*t-30
      );
    }
    function pointN3(t) {
      return new Point(
        1,
        -40*t
      );
    }
      // han a
    function pointA1(t) {
      return new Point(
        -10*t+30,
        -40*t
      );
    }
    function pointA2(t) {
      return new Point(
        13*t+15,
        -90
      );
    }
    function pointA3(t) {
      return new Point(
        15*t+10,
        -40*t
      );
    }
    // hân ^
    function pointA4(t) {
      return new Point(
        7*t+50,
        -9*t-20
      );
    }
    function pointA5(t) {
      return new Point(
        -9*t+50,
        -12*t-20
      );
    }
    //han h
    function pointH1(t) {
      return new Point(
        2,
        -40*t
      );
    }
    function pointH2(t) {
      return new Point(
        15*t,
        -90
      );
    }
    function pointH3(t) {
      return new Point(
        50,
        -40*t
      );
    }

    //phong p
    function pointP1(t) {
      return new Point(
        2,
        -40*t
      );
    }
    function pointP2(t) {
      return new Point(
        5*t,
        -90
      );
    }
    function pointP3(t) {
      return new Point(
        5*t,
        -26
      );
    }
    //
    function pointP4(t) {
      return new Point(
        30 * Math.sin(t)-2,
        -30 * Math.cos(t)-28
      );
    }
    //phong h
    function pointpH1(t) {
      return new Point(
        2,
        -40*t
      );
    }
    function pointpH2(t) {
      return new Point(
        15*t,
        -90
      );
    }
    function pointpH3(t) {
      return new Point(
        50,
        -40*t
      );
    }
    //phong o
    function pointpO1(t) {
      return new Point(
        23 * Math.sin(t)+90,
        60 * Math.cos(t)-60
      );
    }
    //phong n
    function pointpN1(t) {
      return new Point(
        1,
        -40*t
      );
    }
    function pointpN2(t) {
      return new Point(
        16*t+47,
        -40*t-30
      );
    }
    function pointpN3(t) {
      return new Point(
        1,
        -40*t
      );
    }
    //phong g
    function pointpG1(t) {
      return new Point(
        50 * Math.sin(t)+125,
        55 * Math.cos(t)-60
      );
    }
    function pointpG2(t) {
      return new Point(
        1,
        -15*t-70
      );
    }
    function pointpG3(t) {
      return new Point(
        10*t,
        -70
      );
    }
  }else{
      //han n
  function pointN1(t) {
    return new Point(
      1,
      -40*t
    );
  }
  function pointN2(t) {
    return new Point(
      20*t+49,
      -40*t-30
    );
  }
  function pointN3(t) {
    return new Point(
      1,
      -40*t
    );
  }
  //han h
  function pointH1(t) {
    return new Point(
      2,
      -40*t
    );
  }
  function pointH2(t) {
    return new Point(
      23*t,
      -90
    );
  }
  function pointH3(t) {
    return new Point(
      50,
      -40*t
    );
  }
  // han a
  function pointA1(t) {
    return new Point(
      -10*t+30,
      -40*t
    );
  }
  function pointA2(t) {
    return new Point(
      13*t+15,
      -90
    );
  }
  function pointA3(t) {
    return new Point(
      15*t+10,
      -40*t
    );
  }
  // hân ^
  function pointA4(t) {
    return new Point(
      7*t+50,
      -9*t-20
    );
  }
  function pointA5(t) {
    return new Point(
      -9*t+50,
      -12*t-20
    );
  }
  //phong p
  function pointP1(t) {
    return new Point(
      2,
      -40*t
    );
  }
  function pointP2(t) {
    return new Point(
      12*t,
      -90
    );
  }
  function pointP3(t) {
    return new Point(
      12*t,
      -26
    );
  }
  //
  function pointP4(t) {
    return new Point(
      38 * Math.sin(t)+13,
      -32 * Math.cos(t)-28
    );
  }
  //phong h
  function pointpH1(t) {
    return new Point(
      2,
      -40*t
    );
  }
  function pointpH2(t) {
    return new Point(
      23*t,
      -90
    );
  }
  function pointpH3(t) {
    return new Point(
      50,
      -40*t
    );
  }
  //phong o
  function pointpO1(t) {
    return new Point(
      40 * Math.sin(t)+105,
      60 * Math.cos(t)-60
    );
  }
  //phong n
  function pointpN1(t) {
    return new Point(
      1,
      -40*t
    );
  }
  function pointpN2(t) {
    return new Point(
      20*t+47,
      -40*t-30
    );
  }
  function pointpN3(t) {
    return new Point(
      1,
      -40*t
    );
  }
  //phong g
  function pointpG1(t) {
    return new Point(
      65 * Math.sin(t)+125,
      55 * Math.cos(t)-60
    );
  }
  function pointpG2(t) {
    return new Point(
      1,
      -15*t-70
    );
  }
  function pointpG3(t) {
    return new Point(
       15*t,
      -70
    );
  }
  }
  // creating the particle image using a dummy canvas
  var image = (function() {
    var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");
      // if(window.innerWidth<=980){
      //   canvas.width = 1300;
      // }elseƠ
    canvas.width = settings.particles.size;
    canvas.height = settings.particles.size;
    // helper function to create the path
    function to(t) {
      var point = pointOnHeart(t);
      point.x =
        settings.particles.size / 2 +
        (point.x * settings.particles.size) / 350;
      point.y =
        settings.particles.size / 2 -
        (point.y * settings.particles.size) / 350;
      return point;
    }
    // create the path
    context.beginPath();
    var t = -Math.PI;
    var point = to(t);
    context.moveTo(point.x, point.y);
    while (t < Math.PI) {
      t += 0.02; // baby steps!
      point = to(t);
      context.lineTo(point.x, point.y);
    }
    context.closePath();
    // create the fill
    context.fillStyle = "red";
    context.fill();
    // create the image
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  })();

  // render that thing!
  function render() {
    // next animation frame
    requestAnimationFrame(render);

    // update time
    var newTime = new Date().getTime() / 1000,
      deltaTime = newTime - (time || newTime);
    time = newTime;

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // create new particles
    var amount = particleRate * deltaTime;
    for (var i = 0; i < amount; i++) {
      //HAN
      var posN1 = pointN1(3*Math.random());
      var posN2 = pointN2(3*Math.random());
      var posN3 = pointN3(3*Math.random());
      var dirN1 = posN1.clone().length(settings.particles.velocity);
      var dirN2 = posN2.clone().length(settings.particles.velocity);
      var dirN3 = posN3.clone().length(settings.particles.velocity);

      var posH1 = pointH1(3*Math.random());
      var posH2 = pointH2(3*Math.random());
      var posH3 = pointH3(3*Math.random());
      var dirH1 = posH1.clone().length(settings.particles.velocity);
      var dirH2 = posH2.clone().length(settings.particles.velocity);
      var dirH3 = posH3.clone().length(settings.particles.velocity);

      var posA1 = pointA1(3*Math.random());
      var posA2 = pointA2(3*Math.random());
      var posA3 = pointA3(3*Math.random());
      var posA4 = pointA4(4*Math.random());
      var posA5 = pointA5(3*Math.random());
      var dirA1 = posA1.clone().length(settings.particles.velocity);
      var dirA2 = posA2.clone().length(settings.particles.velocity);
      var dirA3 = posA3.clone().length(settings.particles.velocity);
      var dirA4 = posA4.clone().length(settings.particles.velocity);
      var dirA5 = posA5.clone().length(settings.particles.velocity);
      //PHONG
      //p
      var posP1 = pointP1(3*Math.random());
      var posP2 = pointP2(3*Math.random());
      var posP3 = pointP3(3*Math.random());
      var posP4 = pointP4(3*Math.random());
      var dirP1 = posP1.clone().length(settings.particles.velocity);
      var dirP2 = posP2.clone().length(settings.particles.velocity);
      var dirP3 = posP3.clone().length(settings.particles.velocity);
      var dirP4 = posP4.clone().length(settings.particles.velocity);
      //h
      var pospH1 = pointpH1(3*Math.random());
      var pospH2 = pointpH2(3*Math.random());
      var pospH3 = pointpH3(3*Math.random());
      var dirpH1 = pospH1.clone().length(settings.particles.velocity);
      var dirpH2 = pospH2.clone().length(settings.particles.velocity);
      var dirpH3 = pospH3.clone().length(settings.particles.velocity);
      //o
      var pospO1 = pointpO1(Math.PI - 4 * Math.PI * Math.random());
      var dirpO1 = pospO1.clone().length(settings.particles.velocity);
      //n
      var pospN1 = pointpN1(3*Math.random());
      var pospN2 = pointpN2(3*Math.random());
      var pospN3 = pointpN3(3*Math.random());
      var dirpN1 = pospN1.clone().length(settings.particles.velocity);
      var dirpN2 = pospN2.clone().length(settings.particles.velocity);
      var dirpN3 = pospN3.clone().length(settings.particles.velocity);
      //g
       //o
      var pospG1 = pointpG1( - 3.2 * Math.random());
      var dirpG1 = pospG1.clone().length(settings.particles.velocity);
      var pospG2 = pointpG2( 3*Math.random());
      var dirpG2 = pospG2.clone().length(settings.particles.velocity);
      var pospG3 = pointpG3(3*Math.random());
      var dirpG3 = pospG3.clone().length(settings.particles.velocity);
      //han n
      if(window.innerWidth<=980){
        //han h
        particles.add(
           120 + posH1.x,
           130 - posH1.y,
          dirH1.x,
          -dirH1.y
        );
        particles.add(
           122 + posH2.x,
           100 - posH2.y,
          dirH2.x,
          -dirH2.y
        );
        particles.add(
           120 + posH3.x,
           130 - posH3.y,
          dirH3.x,
          -dirH3.y
        );
        //han a ^
        particles.add(
           200 + posA1.x,
           130 - posA1.y,
          dirA1.x,
          -dirA1.y
        );
        particles.add(
           200 + posA2.x,
           100 - posA2.y,
          dirA2.x,
          -dirA2.y
        );
        particles.add(
           220 + posA3.x,
           130 - posA3.y,
          dirA3.x,
          -dirA3.y
        );
            particles.add(
              180 + posA4.x,
              50 - posA4.y,
              dirA4.x,
              -dirA4.y
            );
            particles.add(
               180 + posA5.x,
               50 - posA5.y,
              dirA5.x,
              -dirA5.y
            );
        //han n
        particles.add(
           295 + posN1.x,
           130 - posN1.y,
          dirN1.x,
          -dirN1.y
        );
        particles.add(
           245 + posN2.x,
           100 - posN2.y,
          dirN2.x,
          -dirN2.y
        );
        particles.add(
           340 + posN3.x,
           130 - posN3.y,
          dirN3.x,
          -dirN3.y
        );
        
        //phong p
        particles.add(
           650 + posP1.x,
           130 - posP1.y,
          dirP1.x,
          -dirP1.y
        );
        particles.add(
           650 + posP2.x,
           100 - posP2.y,
          dirP2.x,
          -dirP2.y
        );
        particles.add(
           650 + posP3.x,
           100 - posP3.y,
          dirP3.x,
          -dirP3.y
        );
        particles.add(
           670 + posP4.x,
           130 - posP4.y,
          dirP4.x,
          -dirP4.y
        );
        //phong h
        particles.add(
           710 + pospH1.x,
           130 - pospH1.y,
          dirpH1.x,
          -dirpH1.y
        );
        particles.add(
           710 + pospH2.x,
           100 - pospH2.y,
          dirpH2.x,
          -dirpH2.y
        );
        particles.add(
           705 + pospH3.x,
           130 - pospH3.y,
          dirpH3.x,
          -dirpH3.y
        );
        //phong o
        particles.add(
           705 + pospO1.x,
           130 - pospO1.y,
          dirpO1.x+10,
          -dirpO1.y+10
        );
        //phong n
        particles.add(
           835 + pospN1.x,
           130 - pospN1.y,
          dirpN1.x,
          -dirpN1.y
        );
        particles.add(
           785 + pospN2.x,
           100 - pospN2.y,
          dirpN2.x,
          -dirpN2.y
        );
        particles.add(
           880 + pospN3.x,
           130 - pospN3.y,
          dirN3.x,
          -dirN3.y
        );
        //phong g
        particles.add(
           815 + pospG1.x,
           130 - pospG1.y,
          dirpG1.x+10,
          -dirpG1.y+10
        );
        particles.add(
           945 + pospG2.x,
           130 - pospG2.y,
          dirpG2.x,
          -dirpG2.y
        );
        particles.add(
           930 + pospG3.x,
           130 - pospG3.y,
          dirpG3.x,
          -dirpG3.y
        );
      }else{

        particles.add(
         410 + posN1.x,
         130 - posN1.y,
        dirN1.x,
        -dirN1.y
        );

        particles.add(
           360 + posN2.x,
           100 - posN2.y,
          dirN2.x,
          -dirN2.y
        );
        particles.add(
           470 + posN3.x,
           130 - posN3.y,
          dirN3.x,
          -dirN3.y
        );
        //han h
        particles.add(
           170 + posH1.x,
           130 - posH1.y,
          dirH1.x,
          -dirH1.y
        );
        particles.add(
           170 + posH2.x,
           100 - posH2.y,
          dirH2.x,
          -dirH2.y
        );
        particles.add(
           190 + posH3.x,
           130 - posH3.y,
          dirH3.x,
          -dirH3.y
        );
        //han a ^
        particles.add(
           290 + posA1.x,
           130 - posA1.y,
          dirA1.x,
          -dirA1.y
        );
        particles.add(
           290 + posA2.x,
           100 - posA2.y,
          dirA2.x,
          -dirA2.y
        );
        particles.add(
           310 + posA3.x,
           130 - posA3.y,
          dirA3.x,
          -dirA3.y
        );
            particles.add(
              270 + posA4.x,
              50 - posA4.y,
              dirA4.x,
              -dirA4.y
            );
            particles.add(
               270 + posA5.x,
               50 - posA5.y,
              dirA5.x,
              -dirA5.y
            );
        //phong p
        particles.add(
           850 + posP1.x,
           130 - posP1.y,
          dirP1.x,
          -dirP1.y
        );
        particles.add(
           850 + posP2.x,
           100 - posP2.y,
          dirP2.x,
          -dirP2.y
        );
        particles.add(
           850 + posP3.x,
           100 - posP3.y,
          dirP3.x,
          -dirP3.y
        );
        particles.add(
           870 + posP4.x,
           130 - posP4.y,
          dirP4.x,
          -dirP4.y
        );
        //phong h
        particles.add(
           940 + pospH1.x,
           130 - pospH1.y,
          dirpH1.x,
          -dirpH1.y
        );
        particles.add(
           940 + pospH2.x,
           100 - pospH2.y,
          dirpH2.x,
          -dirpH2.y
        );
        particles.add(
           960 + pospH3.x,
           130 - pospH3.y,
          dirpH3.x,
          -dirpH3.y
        );
        //phong o
        particles.add(
           960 + pospO1.x,
           130 - pospO1.y,
          dirpO1.x+10,
          -dirpO1.y+10
        );
        //phong n
        particles.add(
           1125 + pospN1.x,
           130 - pospN1.y,
          dirpN1.x,
          -dirpN1.y
        );
        particles.add(
           1080 + pospN2.x,
           100 - pospN2.y,
          dirpN2.x,
          -dirpN2.y
        );
        particles.add(
           1185 + pospN3.x,
           130 - pospN3.y,
          dirN3.x,
          -dirN3.y
        );
        //phong g
        particles.add(
           1135 + pospG1.x,
           130 - pospG1.y,
          dirpG1.x+10,
          -dirpG1.y+10
        );
        particles.add(
           1262 + pospG2.x,
           130 - pospG2.y,
          dirpG2.x,
          -dirpG2.y
        );
        particles.add(
           1240 + pospG3.x,
           130 - pospG3.y,
          dirpG3.x,
          -dirpG3.y
        );
      }
      
    }

    // update and draw particles
    particles.update(deltaTime);
    particles.draw(context, image);
  }

  // handle (re-)sizing of the canvas
  function onResize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.onresize = onResize;

  // delay rendering bootstrap
  setTimeout(function() {
    onResize();
    render();
  }, 10);
})(document.getElementById("pinkboard"));

