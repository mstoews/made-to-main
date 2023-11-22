# MadeTo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.5.

## Development server

Run `make start` for a dev server. Navigate to `http://localhost:4208/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `make build` to build the project. The build artifacts will be stored in the `dist/` directory.
Run `make deploy` to deploy the application to the server. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


# Create backup database 

The backup server is : made-to-dev rather than made-to-cassie.

 ```bash
 gcloud config set project made-to-cassie 

 gcloud firestore export gs://made-to-cassie.appspot.com -async 

 gcloud config set project made-to-dev 
 ```

 The project id is used to set the permissions from the copied `to` project from the copied `from` project. 
 In this case 943801679790.

 the next comand grants rights to copy the files from the made-to-cassie bucket. Then we can import the data and watch to see the process complete.

```bash
 gsutil iam ch serviceAccount:service-943801679790@gcp-sa-firestore.iam.gserviceaccount.com:roles/storage.admin gs://made-to-cassie.appspot.com 

 gcloud firestore import gs://made-to-cassie.appspot.com/2023-09-25T14:23:14_74376 --async 

 gcloud firestore operations list
 ``` 
