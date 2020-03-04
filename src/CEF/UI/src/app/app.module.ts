import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InventoryComponent } from './inventory/inventory.component';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { LeftBlockComponent } from './inventory/left-block/left-block.component';
import { RightBlockComponent } from './inventory/right-block/right-block.component';
import { BlockItemComponent } from './inventory/right-block/block-item/block-item.component';

@NgModule({
   declarations: [
      AppComponent,
      InventoryComponent,
      LeftBlockComponent,
      RightBlockComponent,
      BlockItemComponent,
      
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      DragDropModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
