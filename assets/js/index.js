import Data from './data';
import ProgressBar from './progress-bar';
import Canvas from './canvas';
//import Stories from './stories';
import '!style!css!sass!../css/vendor/foundation.min.css';
import '!style!css!sass!../css/style.scss';
import '../img/pin.svg';
import '../img/ajc-logo.png';
import '../img/bak.jpg';
import '../img/title-card.jpg';
import '../index.html';

class App {
  constructor() {
    var Input = new Data;
    this.data = Input.data;

    var canvas = new Canvas();
    canvas.build();
    this.svg = canvas.svg;

    this.progressBar = new ProgressBar();

    this.started = false;
    this.finished = false;
    this.step = -1;

    // Add event handlers
    var beginButton = document.getElementById('begin-button');
    
    beginButton.addEventListener('click', () => {
      var splash = document.getElementById('splash');
      splash.style.display = 'none';
    })

    for (var i = this.data.length - 1; i >= 0; i--) {
      // Append divs with the event descriptions after the #main div
      $(`<div class="desc">
          <div class="box">
            ${this.data[i].desc}
          </div>
        </div>`).insertAfter('#main');
    }

    // Add click event handler to canvas
    $('#wrapper').on('mouseup', () => {
      this.handleClick(1) // Handle click takes an argument that determines whether to step forward or backward
    })

    // Handle arrow keys as well as clicks.
    $(document).keydown((e) => {
      switch(e.which) {
        case 37: 
          this.handleClick(-1);
          break;

        case 39:
          this.handleClick(1);
          break;

        default: return;
      }
      e.preventDefault()
    })

    // Change the opacity of the cover div if you need to display text on top 
    // of the picture
    this.cover = document.getElementById('cover');

    // The descriptions are displayed below or to the left of the picture
    this.descs = document.getElementsByClassName('desc');

    // See thie progressbar.js module. Displays a bar across the top of the screen that 
    // fills in as the user navigates through the app
    this.progressBar.build(this.data.length + 1)
    this.progressBar.fill(this.step)

    // Initialize an empty array that will hold references to each of the points plotted
    // over the picture
    this.plotted = [];

    // Display the instructions
    this.getMessage();
  }

  handleClick(i) {
    this.setStep(this.step + i)
  }

  setStep(step) {
    this.cover.style.opacity = 0;

    for (var i=0; i<this.data.length; i++) {
      this.descs[i].style.display = 'none';
    };


    if (step === this.data.length) {
      this.step = step;
      this.finished = true;
      this.cover.style.opacity = .7;
    }
    else if (step < this.data.length){
      var entry = this.data[step];
      var points = document.getElementsByClassName('point');

      this.step = step;
      this.started = true;

      this.descs[this.step].style.display = 'initial';

      if (this.plotted.indexOf(entry.id) === -1) {
        this.plotted.push(entry.id);
        this.svg.append('svg:image')
          .attr('xlink:href', '../img/pin.svg')
          .attr('class', 'point')
          .attr('id', 'point' + entry.id)
          .attr('x', entry.x + '%')
          .attr('y', entry.y + '%')
          .attr('width', '2em')
          .attr('height', '3em')
      }
      else {
        var c = document.getElementById('point' + entry.id);
        c.style.x = entry.x + '%';
        c.style.y = entry.y + '%';
      }

      var newPoints = document.getElementsByClassName('point');

      for (i in newPoints) {
        try { 
          var num = newPoints[i].id.match(/\d/)[0];
          num = parseInt(num);
          if (entry.present.indexOf(num) === -1) {
            newPoints[i].style.display = 'none';
          }
          else {
            newPoints[i].style.display = 'initial'; 
          }
        }
        catch (TypeError) {}
      }

    }
    else {
      return
    }

    this.getMessage();
    this.progressBar.fill(this.step);
  }

  getMessage() {
    if (!this.started) {
      var msg = `<div 
        id="instructions">
            Tap or click this photo to advance
        </div>`
    }
    else if (this.finished) {
      var msg = `<div 
        id="finished">
            Finished. <a href="http://ajc.com" id="finished-link">Read more.</a>
        </div>`
    }
    $('#message').empty();
    $('#message').append(msg);
  }
}

var ShootingApp = new App();

