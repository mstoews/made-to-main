import { Component, OnInit } from '@angular/core';
import SwiperCore from 'swiper';
import { Swiper, SwiperOptions } from 'swiper';

@Component({
  selector: 'prd-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  slider: any;
  defaultTransform: any;

  image0 = "https://firebasestorage.googleapis.com/v0/b/made-to-cassie.appspot.com/o/cassie_vertical_scissors.jpg?alt=media&token=735e0b81-05e6-45e2-b347-5136a9285f84";
  image1 = "https://firebasestorage.googleapis.com/v0/b/made-to-cassie.appspot.com/o/cassie_vertical_scissors.jpg?alt=media&token=735e0b81-05e6-45e2-b347-5136a9285f84";
  image2 = "https://firebasestorage.googleapis.com/v0/b/made-to-cassie.appspot.com/o/cassie_vertical_scissors.jpg?alt=media&token=735e0b81-05e6-45e2-b347-5136a9285f84";
  image3 = "https://firebasestorage.googleapis.com/v0/b/made-to-cassie.appspot.com/o/cassie_vertical_scissors.jpg?alt=media&token=735e0b81-05e6-45e2-b347-5136a9285f84";
  image4 = "https://firebasestorage.googleapis.com/v0/b/made-to-cassie.appspot.com/o/cassie_vertical_scissors.jpg?alt=media&token=735e0b81-05e6-45e2-b347-5136a9285f84";

  images: string[] = [this.image0, this.image1, this.image2, this.image3, this.image4];

  goNext() {
    this.defaultTransform = this.defaultTransform - 398;
    if (Math.abs(this.defaultTransform) >= this.slider.scrollWidth / 1.7) this.defaultTransform = 0;
    this.slider.style.transform = "translateX(" + this.defaultTransform + "px)";
}
 goPrev() {

    if (Math.abs(this.defaultTransform) === 0) this.defaultTransform = 0;
    else this.defaultTransform = this.defaultTransform + 398;
    this.slider.style.transform = "translateX(" + this.defaultTransform + "px)";
}
  constructor() { }

  ngOnInit(): void {
    this.slider = document.getElementById("slider");
    this.defaultTransform=0
  }


}

