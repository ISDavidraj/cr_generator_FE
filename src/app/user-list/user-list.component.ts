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
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; 
import { CvFormComponent } from '../cv-form/cv-form.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';

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
    MatNativeDateModule,
    MatPaginatorModule,
    HttpClientModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  displayedColumns: string[] = ['name', 'email', 'phone', 'education', 'actions'];
  dataSource = new MatTableDataSource([
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
  ]);

  constructor(public dialog: MatDialog,private http: HttpClient) {
    this.getAllUsers();
  }
  getAllUsers() {
    this.http.get<any[]>('http://localhost:5000/api/users').subscribe(
      (response) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  

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
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }
  

  print(element: any) {
    this.http.get(`http://localhost:5000/api/users/${element}/generate-pdf`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `User_${element}_CV.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, (error) => {
        console.error('Error downloading PDF:', error);
      });
  }

  view(element: any) {
    
  }

  edit(element: any) {
    const dialogRef = this.dialog.open(CvFormComponent, {
      width: '90%',     
      maxWidth: '90vw',
      height: '90%',
      maxHeight: '90vh', 
      panelClass: 'full-screen-dialog',
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers();
      }
    });
  }
}
