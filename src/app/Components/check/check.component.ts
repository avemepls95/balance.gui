import { Component, OnInit, ViewChild } from '@angular/core';
import { Payment } from 'src/app/Model/Check';
import { ToastrService } from 'ngx-toastr';
import { Position } from 'src/app/Model/Position';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/Utils/MyErrorStateMatcher';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PositionCardComponent } from 'src/app/Components/position-card/position-card.component';

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

  displayedColumns: string[] = ['title', 'amount'];
  dataSource: MatTableDataSource<Position>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private toastr: ToastrService, public dialog: MatDialog) {
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => this.createNewUser(k + 1));
    this.newPosition = new Position ({ title: "123", amount: "1" });
    this.positions.push(this.newPosition);

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.positions);

    this.newPayment = new Payment();
    this.payments.push(this.newPayment);
   }

  positions: Array<Position> = [];
  newPosition: Position;

  payments: Array<Payment> = [];
  newPayment: Payment;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(PositionCardComponent, {
      width: '250px',
      data:obj
    });
 
    dialogRef.afterClosed().subscribe(result => {
      // if(result.event == 'Add'){
      //   this.addRowData(result.data);
      // }else if(result.event == 'Update'){
      //   this.updateRowData(result.data);
      // }else if(result.event == 'Delete'){
      //   this.deleteRowData(result.data);
      // }
    });
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
