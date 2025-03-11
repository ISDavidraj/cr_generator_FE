import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.cvForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      professionalSummary: [''],
      workExperience: this.fb.array([]),
      education: this.fb.array([]),
      skills: this.fb.array([])
    });
    this.addWorkExperience();
    this.addEducation();
    this.addSkill();
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

  addSkill(): void {
    this.skills.push(this.fb.control('', Validators.required));
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
