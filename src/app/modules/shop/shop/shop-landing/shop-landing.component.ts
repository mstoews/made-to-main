import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Route, Router } from '@angular/router';
import { CategoryService } from 'app/services/category.service';
import { Category } from 'app/models/category';
import { Observable } from 'rxjs';

@Component({
  selector: 'shop',
  templateUrl: './shop-landing.component.html',
  styleUrls: ['./shop-landing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopLandingComponent implements OnInit {
  Category$: Observable<Category[]>;
  constructor(private route: Router, private categoryService: CategoryService) {
    // this.categoryService.updateIsUsedCategoryList()
  }

  ngOnInit(): void {
    this.Category$ = this.categoryService.getCategoryList();
  }

  sTitle = 'Made To Shopping By Categories';
  sMobileTitle = 'Shopping';

  backToHome() {
    this.route.navigate(['home']);
  }
}
