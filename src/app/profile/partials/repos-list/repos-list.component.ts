import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-repos-list',
  templateUrl: './repos-list.component.html'
})
export class ReposListComponent implements OnInit {

  @Input() data: any;
  @Input() viewMore: any;

  constructor() { }

  ngOnInit() {
  }

}
