import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-cv-form',
  imports: [ReactiveFormsModule,MatFormFieldModule,    MatButtonModule,
     MatInputModule, MatIconModule, MatSelectModule,HttpClientModule,MatDatepickerModule,MatMomentDateModule],
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.scss',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, 
  ],
})
export class CvFormComponent {
  cvForm!: FormGroup;
startPickers: any;
endPickers: any;

  constructor(private fb: FormBuilder, private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,  private dialogRef: MatDialogRef<CvFormComponent>) {
    this.cvForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      professionalSummary: [''],
      workExperience: this.fb.array([]),
      education: this.fb.array([]),
      skills: this.fb.array([])
    });
    if (this.data) {
      this.setFormValues(this.data);
    } else {
      this.addWorkExperience();
      this.addEducation();
      this.addSkill();
    }
  }
  setFormValues(data: any): void {
    this.cvForm.patchValue({
      name: data.name,
      email: data.email,
      phone: data.phone,
      professionalSummary: data.professionalSummary
    });

    this.workExperience.clear();
    data.workExperience.forEach((exp: any) => {
      this.workExperience.push(this.fb.group({
        company: [exp.company, Validators.required],
        position: [exp.position, Validators.required],
        startDate: [exp.startDate, Validators.required],
        endDate: [exp.endDate, Validators.required],
        description: [exp.description]
      }));
    });

    this.education.clear();
    data.education.forEach((edu: any) => {
      this.education.push(this.fb.group({
        institution: [edu.institution, Validators.required],
        degree: [edu.degree, Validators.required],
        fieldOfStudy: [edu.fieldOfStudy, Validators.required],
        startDate: [edu.startDate, Validators.required],
        endDate: [edu.endDate, Validators.required]
      }));
    });

    this.skills.clear();
    data.skills.forEach((skill: any) => {
      this.addSkill(skill);
    });
  }

  get workExperience(): FormArray {
    return this.cvForm.get('workExperience') as FormArray;
  }

  get education(): FormArray {
    return this.cvForm.get('education') as FormArray;
  }

  get skills(): FormArray {
    return this.cvForm.get('skills') as FormArray;
  }

  addWorkExperience(): void {
    this.workExperience.push(this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    }));
  }

  addEducation(): void {
    this.education.push(this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    }));
  }

  addSkill(skill: string = ''): void {
    this.skills.push(this.fb.control(skill, Validators.required));
  }

  removeWorkExperience(index: number): void {
    this.workExperience.removeAt(index);
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  onMonthSelected(event: Moment, index: number): void {
    const formattedDate = event.format('MM/YYYY');
    this.education.at(index).get('startDate')?.setValue(formattedDate);
  }
  
  onMonthEndSelected(event: Moment, index: number): void {
    const formattedDate = event.format('MM/YYYY');
    this.education.at(index).get('endDate')?.setValue(formattedDate);
  }
  onSubmit(): void {
    let payload = {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "professionalSummary": "Experienced software developer.",
      "workExperience": [
        {
          "company": "ABC Corp",
          "position": "Software Engineer",
          "startDate": "2020-01-01",
          "endDate": "2023-01-01",
          "description": "Developed web applications."
        }
      ],
      "education": [
        {
          "institution": "XYZ University",
          "degree": "Bachelor of Science",
          "fieldOfStudy": "Computer Science",
          "startDate": "2016-01-01",
          "endDate": "2020-01-01"
        }
      ],
      "skills": [
        "JavaScript",
        "TypeScript",
        "Angular",
        "Node.js"
      ]
    }
    if (this.cvForm.valid) {
      this.http.post('http://localhost:5000/api/users', this.cvForm.value)
        .subscribe(
          (response) => {
            console.log('CV saved successfully:', response);
            alert('CV saved successfully!');
            this.dialogRef.close();
          },
          (error) => {
            console.error('Error saving CV:', error);
            alert('Error saving CV. Please try again.');
          }
        );
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
