import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-left-block',
  templateUrl: './left-block.component.html',
  styleUrls: ['./left-block.component.css']
})
export class LeftBlockComponent implements OnInit {
  list: any[] = [
    'list_1',
    'list_2',
    'list_3',
    'list_4',
    'list_5',
    'list_6',
    'list_7',
    'list_8',
  ];

  constructor() { }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('event', event);
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

}
