import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'; 
import { CvFormComponent } from '../cv-form/cv-form.component';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  displayedColumns: string[] = ['name', 'email', 'phone', 'education', 'actions'];
  dataSource = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      education: [
        {
          institution: 'University of Example',
          degree: 'BSc Computer Science',
          field_of_study: 'Computer Science',
          start_date: '2015-09-01',
          end_date: '2019-06-30',
        },
      ],
    },
  ];

  constructor(public dialog: MatDialog) {}

  openAddDialog() {
    const dialogRef = this.dialog.open(CvFormComponent, {
      width: '90%',     
      maxWidth: '90vw',
      height: '90%',
      maxHeight: '90vh', 
      panelClass: 'full-screen-dialog'
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource = [...this.dataSource, result];
      }
    });
  }
  

  print(element: any) {
    console.log('Print:', element);
  }

  view(element: any) {
    console.log('View:', element);
  }

  edit(element: any) {
    // const dialogRef = this.dialog.open(CvFormComponent, {
    //   width: '600px',
    //   data: element,
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     const index = this.dataSource.findIndex((item) => item.id === result.id);
    //     this.dataSource[index] = result;
    //     this.dataSource = [...this.dataSource];
    //   }
    // });
  }
}
