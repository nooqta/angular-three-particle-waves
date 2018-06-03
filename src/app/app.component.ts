import { Component, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
declare var THREE;
@Component({
  selector: 'app-particle-waves',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit  {
  @ViewChild('threeRendererContainer') container: ElementRef;
  renderer = new THREE.CanvasRenderer({
    alpha: true
});
  scene = null;
  camera = null;
  mesh = null;
  SEPARATION = 100;
  AMOUNTX = 50;
  AMOUNTY = 50;
  stats;
  particles;
  particle;
  count = 0;
  mouseX = 0;
  mouseY = 0;
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;
    this.camera.position.y = 300;

    this.particles = new Array();
    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial({
      color: 0xf0f0f0,
      program: function (context) {
        context.beginPath();
        context.arc(0, 0, 0.5, 0, PI2, true);
        context.fill();
      }
    });
    var i = 0;
    for (var ix = 0; ix < this.AMOUNTX; ix++) {
      for (var iy = 0; iy < this.AMOUNTY; iy++) {
        this.particle = this.particles[i++] = new THREE.Sprite(material);
        this.particle.position.x = ix * this.SEPARATION - ((this.AMOUNTX * this.SEPARATION) / 2);
        this.particle.position.z = iy * this.SEPARATION - ((this.AMOUNTY * this.SEPARATION) / 2);
        this.scene.add(this.particle);
      }
    }
    
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.nativeElement.appendChild(this.renderer.domElement);
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;
    // this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * .05;
      this.camera.lookAt( this.scene.position );
      var i = 0;
        for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
            this.particle = this.particles[ i++ ];
            this.particle.position.y = ( Math.sin( ( ix + this.count ) * 0.3 ) * 50 ) +
            ( Math.sin( ( iy + this.count ) * 0.5 ) * 50 );
              this.particle.scale.x = this.particle.scale.y = ( Math.sin( ( ix + this.count ) * 0.3 ) + 1 ) * 4 +
              ( Math.sin( ( iy + this.count ) * 0.5 ) + 1 ) * 4;
            }
        }
        this.renderer.render( this.scene, this.camera );
        this.count += 0.1;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  @HostListener('mousemove', ['$event'])
  onDocumentMouseMove(event) {
    this.mouseX = event.clientX - this.windowHalfX;
    this.mouseY = event.clientY - this.windowHalfY;
  }
  @HostListener('touchstart', ['$event'])
  onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.mouseX = event.touches[0].pageX - this.windowHalfX;
      this.mouseY = event.touches[0].pageY - this.windowHalfY;
    }
  }
  @HostListener('touchmove', ['$event'])
  onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.mouseX = event.touches[0].pageX - this.windowHalfX;
      this.mouseY = event.touches[0].pageY - this.windowHalfY;
    }
  }
}
