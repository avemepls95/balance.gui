import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/Model/Check';
import { ToastrService } from 'ngx-toastr';
import { Position } from 'src/app/Model/Position';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/Utils/MyErrorStateMatcher';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {

  titleFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private toastr: ToastrService) { }

  positions: Array<Position> = [];
  newPosition: Position;

  payments: Array<Payment> = [];
  newPayment: Payment;

  ngOnInit() {
    this.newPosition = new Position ({ title: "123", amount: "1" });
    this.positions.push(this.newPosition);
    this.newPayment = new Payment();
    this.payments.push(this.newPayment);
  }

  addPosition(index) {
    this.newPosition = new Position ({ title: "", amount: "" });
    this.positions.push(this.newPosition);
    return true;
  }

  deletePosition(index) {
    if (this.positions.length == 1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.positions.splice(index, 1);
      return true;
    }
  }

  addPayment(index) {
    // this.newPosition = new Payment ({ title: "", amount: "" });
    // this.positions.push(this.newPosition);
    // this.toastr.success('New row added successfully', 'New Row');
    return true;
  }

  deletePayment(index) {
    // if (this.positions.length == 1) {
    //   this.toastr.error("Can't delete the row when there is only one row", 'Warning');
    //   return false;
    // } else {
    //   this.positions.splice(index, 1);
    //   this.toastr.warning('Row deleted successfully', 'Delete row');
    //   return true;
    // }
  }
}
