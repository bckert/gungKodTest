import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { Category, CategoryService } from './services/category.service';
import { Product } from './services/product.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, FormsModule, NgbDropdownModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  public search = new FormControl('')
  sortItems = ['Desc Volume', 'Asc Volume', 'Desc Price', 'Asc Price']
  selectedSortItem = 'Sort By'
  selectedSubCategory = 'Filter By Category'
  categories$ = this.categoryService.getCategories();
  productObservables: Observable<Product>[] = [];
  public includeOutOfStock = true; 
  subcategories: Set<string> = new Set();
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

ngOnInit() {
  this.categories$.subscribe(
    (categories) => {
      this.createSubCategoryList(categories, this.subcategories); }
  )
  this.productService.getAllProducts().subscribe(
    (products) => {
      this.productsSubject.next(products);}) 
  }
  constructor(private productService: ProductService, private categoryService: CategoryService) { } 

  checkIfInStock(product: Product){
    if (product.extra['AGA'].LGA > 0)
      return 'Yes'
    else
    return 'No'
  }

filterProducts() {
  const searchValue = (this.search.value || '').toLowerCase();


  combineLatest([this.productsSubject, this.categories$]).pipe(
    switchMap(([results, categories]) => {
      let filteredResults = results;

        if (this.selectedSubCategory !== 'Filter By Category') {
        filteredResults = filteredResults.filter(product => {
          const productSubcategory = this.getSubCategoryName(product, categories);
          return productSubcategory === this.selectedSubCategory;
          
        });
      }   
      
      filteredResults = filteredResults.filter(product =>
        product.name.toLowerCase().includes(searchValue) ||
        product.id.toLowerCase().includes(searchValue) ||
        product.extra['AGA'].PRI.toString().toLowerCase().includes(searchValue)
      );
      
      if (!this.includeOutOfStock) {
        filteredResults = filteredResults.filter(product => product.extra['AGA'].LGA > 0);
              }
      return of(filteredResults);
    })
  ).subscribe(filteredResults => {
    this.products$ = of(filteredResults);
  });
}

getCategory(category: Category, product: Product): void {
  if (category.id && category.id.startsWith('s')) {
    console.log('First category name: ' + category.name);
  }
  if (category.children && category.children.length > 0) {
    category.children.forEach(child => {
      this.getCategory(child, product);
    });
  }
  
}

private createSubCategoryList(category: Category, subcategoryNames: Set<string> = new Set()): void {
  if (category.children) {
    for (let child of category.children) {
      if (!child.id.startsWith('s')) {
        subcategoryNames.add(category.name);
      }
      // recursive
      this.createSubCategoryList(child, subcategoryNames);
    }
  }
}

getCategoryName(product: Product, rootNode: Category): string | null {
  return this.findCategoryName(product, rootNode);
}

getSubCategoryName(product: Product, rootNode: Category): string | null {
  return this.findSubCategoryName(product, rootNode);
}

private findSubCategoryName(product: Product, category: Category): string | null {
  if (category.children) {
    for (let child of category.children) {
      if (child.children && child.children.some(c => c.id === product.id)) {
        return child.name;
      } else {
        const categoryName = this.findSubCategoryName(product, child);
        if (categoryName) {
          return categoryName;
        }
      }
    }
  }
  return null;
}

private findCategoryName(product: Product, category: Category): string | null {
  if (category.children) {
    for (let child of category.children) {
      if (child.children && child.children.some(c => c.id === product.id)) {
        return category.name;
      } else {
        const categoryName = this.findCategoryName(product, child);
        if (categoryName) {
          return categoryName;
        }
      }
    }
  }
  return null;
}

checkBoxChange() {
  if(!this.includeOutOfStock){
  this.products$ = this.productsSubject?.pipe(
    map(results => results.filter(product => (product.extra['AGA'].LGA) > 0))); }
  else{
      this.products$ = this.productsSubject;
    }
}

filterOnCategory(subcategory: string) {
  if(subcategory !== 'Filter By Category'){
    this.selectedSubCategory = subcategory
    this.categories$.subscribe(categories => {
    this.products$ = this.productsSubject.pipe(
      map(products => products.filter(product => {
        const productSubcategory = this.getSubCategoryName(product, categories);
        return productSubcategory === subcategory;
      }))
    );
  }); }
  else {
  this.products$ = this.productsSubject; 
  }

  
}

//sorting functions

public sortProductsVolDesc(): void {
  this.products$ = this.products$?.pipe(
    map(results => results.sort((p1, p2) => p1.extra['AGA'].VOL - p2.extra['AGA'].VOL)));
  this.selectedSortItem = this.sortItems[0];
}

public sortProductsVolAsc() {
  this.products$ = this.products$?.pipe(
    map(results => results.sort((p1, p2) => p2.extra['AGA'].VOL - p1.extra['AGA'].VOL)));
    this.selectedSortItem = this.sortItems[1];
}
public sortProductsPriDesc(): void {
  this.products$ = this.products$?.pipe(
    map(results => results.sort((p1, p2) => p1.extra['AGA'].PRI - p2.extra['AGA'].PRI)));
    this.selectedSortItem = this.sortItems[2];
}

public sortProductsPriAsc() {
  this.products$ = this.products$?.pipe(
    map(results => results.sort((p1, p2) => p2.extra['AGA'].PRI - p1.extra['AGA'].PRI)));
    this.selectedSortItem = this.sortItems[3];
}
  
}
