import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.css']
})
export class CookieBannerComponent implements OnInit {

  showBanner = true;

  public constructor(@Inject('document') private document,
            @Inject('window') private window) {
  }

  public ngOnInit() {
    const consent = this.getCookie('cookieconsent');
    if (consent === 'allow') {
      this.showBanner = false;
    } else {
      this.showBanner = true;
    }
  }

  private getCookie(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
  private setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    this.document.cookie = cname + '=' + cvalue + ';' + expires;
  }
  public agreeToShare() {
    this.setCookie('cookieconsent', 'allow', 365);
    this.window.location.reload();
  }
}
