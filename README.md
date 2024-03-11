#Instructions 

In the following assignment, data is delivered as if it came from Gung's backend with
help functions that extract typical data from the business system. Your assignment is
to display this data in a good way using Angular (https://angular.io/). The data we
collect in this case are categories including underlying products, as well as product
information using two methods as described.

The categories are downloaded in a tree structure, with nodes and sub nodes, where
nodes can be either a new category or a product. In order to distinguish a category
from a product, we can check if the id starts with a lower case "s".

The task is to create a page where we list all products in a list that can be sorted and
filtered.
1. It should be possible to filter on:
a. Name
b. Id
c. Price (Exists in the field extra.PRI on the product object)
2. It should be possible to sort and filter for:
a. If the product is in stock (Field LGA in the extra-object > 0).
b. Volume (Field = extra.VOL) in an intervall (from - to).
c. Category

# GungKodtest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

