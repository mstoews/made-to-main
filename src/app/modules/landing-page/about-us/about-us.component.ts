import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {

  constructor(
      private route: Router,
  ) {

  }

  backToHome() {
      this.route.navigate(['home']);
  }

          commentOne = "Established by Cassandra Harada, <strong>Made To</strong> is a tiny cooperative of artisans, technicians, and crafts people who are\
          petitioning the world to slow down and think about why we wear what we wear. We make hand-knitted, and\
          hand-sewn clothing that are built to last, be worn heavily, and be the first garment you reach for, no matter\
          the season. We’re here to bask in the glory of the processes that build our wardrobes. If you are a handmaker,\
          or interested in craftsmanship, please visit us now and again to peek in at our “thoughts” on why we’re making\
          what we’re making.";

          commentTwo = "We are also here to \
            have a conversation about what is just, equitable, sustainable and right in a world where everything we \
            consume feels disposable, and is of mysterious origin. While we'd like to talk deeply about these things, we\
            also believe shame doesn't belong in this exchange. (Lets face it, we all own at least one '$3 T-shirt') \
            Here, we just want to encourage our customers and friends to do the best they can to understand ethical \
            fashion choices, and strike a balance in their consumption between 'new and exciting' and 'comfort and \
            familiarity";

          commentThree = "Cassandra Harada is a lifetime maker of things. Cassandra spent a good portion of her youth studying fine arts and printmaking,\
            but in 2006 she moved to Tokyo and realized quickly that there wasn’t much space for 2D art in the\
            traditional sense, so she felt compelled to move toward a more utilitarian outlet to satisfy her drive to\
            make. She spent 10 years of her career teaching handknitting in her small yarn shop in West Tokyo but\
            ultimately desired a close working relationship with other master crafts people. In 2019 she began studying\
            with Master Teruo Hirokawa, and doing what she could to become a competent trouser maker. She still writes\
            the occasional knitting pattern for yarn companies and magazines, and is also involved in yarn design,\
            however she spends most of her waking hours in her tiny studio in Fuchu crafting wool garments.";


}
