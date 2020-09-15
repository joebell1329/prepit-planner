import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { ConfigService } from './config/config.service';
import { AddIngredientDialogComponent } from './add-ingredient-dialog/add-ingredient-dialog.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PrepPageComponent } from './prep-page/prep-page.component';
import { AddIngredientFormComponent } from './add-ingredient-form/add-ingredient-form.component';
import { FoodListComponent } from './food-list/food-list.component';
import { PortionsFormComponent } from './portions-form/portions-form.component';
import { HomePageComponent } from './home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AddIngredientDialogComponent,
    PrepPageComponent,
    NavbarComponent,
    AddIngredientFormComponent,
    FoodListComponent,
    PortionsFormComponent,
    HomePageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.loadConfig().toPromise(),
      deps: [ ConfigService ],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
