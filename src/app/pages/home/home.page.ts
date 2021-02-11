import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

interface Product {
  name: string,  
  description: string,
  quantity: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  constructor(

  ) { 

  }

  ngOnInit() {
   
  }



}
