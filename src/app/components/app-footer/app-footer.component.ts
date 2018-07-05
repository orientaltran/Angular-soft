import { Component } from '@angular/core';
import { StatusService } from '../../shared/status.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent implements OnInit {
  public statusText;
  public date;

  constructor(private status: StatusService) {
    this.date = new Date();
  }

  ngOnInit() {
    this.status.getStatusIndicator()
      .subscribe((res) => {
        this.statusText = res;
      });
  }
 }
