import { Component, ElementRef, Inject, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { finalize, interval, map, Subject, take, takeUntil } from 'rxjs';
import { User, UserDetails } from '../../../shared/models';
import { PwdValidators } from '../../../shared/validators/pwd.validator';
import { DataService } from './../../../core/services/data.service';
import { EncryptionService } from './../../../core/services/encryption.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [
    CommonModule,
    // materials
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]

})
export class ForgotPasswordComponent implements OnInit {

  user: User;
  user_details: UserDetails;
  error_msg: String;

  is_otp: boolean = false;
  verified: boolean = false;
  isLoading: boolean = false;
  view: boolean = false;
  fg: UntypedFormGroup;
  mobile_no_fc = new UntypedFormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]);
  otp_fc = new UntypedFormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
  pwd_fc = new UntypedFormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]);
  repwd_fc = new UntypedFormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(100), PwdValidators.pwdEqual('pwd_fc')]);

  isStopTimer$ = new Subject<boolean>();

  @ViewChild('otptime')
  public otptime: ElementRef;

  isOtpExpired = false;
  time_in_secs = 900;

  timer$ = interval(1000).pipe(
    take(this.time_in_secs),
    takeUntil(this.isStopTimer$),
    finalize(() => {
      this.updateOTPTimeCountdown(null);
      this.isOtpExpired = true;
      this.close();
    }),
    map(s => {
      const t = this.time_in_secs - s - 1;

      const mins = Math.trunc(t / 60);
      const secs = t % 60;
      const displayText = ("0" + mins.toString()).slice(-2) + ' : ' + ("0" + secs.toString()).slice(-2);
      this.updateOTPTimeCountdown(displayText);
      return t;
    }),
    // tap(t => console.log(t))
  );

  updateOTPTimeCountdown(displayText: string) {
    this.zone.runOutsideAngular(() => {
      if (this.otptime) this.renderer.setProperty(this.otptime.nativeElement, 'textContent', displayText);
    });
  }

  @ViewChild('resent_otp_time')
  public resent_otp_time: ElementRef;

  isResendOTPEnabled = false;
  resend_time_in_secs = 120;
  resend_timer$ = interval(1000).pipe(
    take(this.resend_time_in_secs),
    takeUntil(this.isStopTimer$),
    finalize(() => {
      this.updateResendtimeCountdown(null);
      this.isResendOTPEnabled = true;
    }),
    map(s => {
      const t = this.resend_time_in_secs - s - 1;

      const mins = Math.trunc(t / 60);
      const secs = t % 60;
      const displayText = ("0" + mins.toString()).slice(-2) + ' : ' + ("0" + secs.toString()).slice(-2);
      this.updateResendtimeCountdown(displayText);
      return t;
    })
  )

  updateResendtimeCountdown(displayText: string) {
    this.zone.runOutsideAngular(() => {
      if (this.resent_otp_time) this.renderer.setProperty(this.resent_otp_time.nativeElement, 'textContent', displayText);
    });
  }

  constructor(
    private ds: DataService,
    private encryptionService: EncryptionService,
    private zone: NgZone,
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) { }

  ngOnInit(): void {
    this.user = this.ds.curr_user$.value;
    this.formInitialize();
    if (this.user) {
      this.getUserDetails();
    }
  }

  formInitialize() {
    this.fg = new UntypedFormGroup({
      psw: this.pwd_fc,
      c_psw: this.repwd_fc
    })
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    const sValue = Object.assign({}, this.fg.value);
    if (this.fg.value.psw !== this.fg.value.c_psw) {
      // Show a notification to the user
      alert("Password and Confirm Password do not match.");
      return;
    }
    sValue.mobile_no = this.mobile_no_fc.value;
    this.ds.generateSecretKey().subscribe(key => {
      sValue.mobile_no = this.encryptionService.encrypt(sValue.mobile_no, key)
      sValue.psw = this.encryptionService.encrypt(sValue.psw, key)
      sValue.c_psw = this.encryptionService.encrypt(sValue.c_psw, key)
      this.ds.forgetPassword(sValue).subscribe(r => {
        if (r.message == 'Password Changed Successfully.') {
          this.dialogRef.close();
        }
      })
    })
  }

  generateOTPForgotPassword() {
    this.isLoading = true;
    const sValue = Object.assign({});
    sValue.mobile_no = this.mobile_no_fc.value;
    this.ds.generateSecretKey().subscribe(key => {
      sValue.mobile_no = this.encryptionService.encrypt(sValue.mobile_no, key);
      this.ds.generateOTPForgotPassword({ mobile_no: sValue.mobile_no }).subscribe(r => {
        this.isLoading = false;
        if (r.message == 'OTP Generated.') {
          this.isLoading = false;
          this.is_otp = true;
        }
      })
    })
  }

  validateUserOTP() {
    this.isLoading = true;
    const sValue = Object.assign({});
    sValue.mobile_no = this.mobile_no_fc.value;
    sValue.otp = this.otp_fc.value
    this.ds.generateSecretKey().subscribe(key => {
      sValue.mobile_no = this.encryptionService.encrypt(sValue.mobile_no, key);
      sValue.otp = this.encryptionService.encrypt(sValue.otp, key);
      this.ds.validateUserOTP(sValue).subscribe(r => {
        this.isLoading = false;
        // console.log(r.message);
        const decryptedMessage = this.encryptionService.decrypt(r.message, key);
        // console.log(decryptedMessage);
        if (decryptedMessage == 'OTP Verified.') {
          alert('Otp Verfied');
          this.verified = true;
          this.isOtpExpired = true;
        }
      })
    })


  }


  // OTPValidated() {
  //   this.isLoading = true;
  //   const sValue = Object.assign({});
  //   sValue.mobile_no = this.mobile_no.value;
  //   sValue.otp = this.otp_fc.value
  //   this.ds.generateSecretKey().subscribe(key => {
  //     sValue.mobile_no = this.encryptionService.encrypt(sValue.mobile_no, key);
  //     sValue.otp = this.encryptionService.encrypt(sValue.otp, key);
  //     this.ds.OTPValidated(sValue).subscribe(r => {
  //       this.isLoading = false;
  //       if (r.message == 'OTP Verified.') {
  //         this.verified = true;
  //         this.isOtpExpired = true;
  //         this.mes_otp = false;
  //       }
  //     })
  //   })
  // }


  getUserDetails() {
    this.ds.curr_user$.subscribe(u => {
      if (!!u) {
        this.ds.getUserDetails({}).subscribe(r => {
          // Assuming r is an array and you want the first user details
          this.user_details = r[0];
          this.mobile_no_fc.setValue(this.user_details.mobile_no);
          this.mobile_no_fc.disable();
        });
      }
    });
  }

  number_chars_only(e: KeyboardEvent) {
    return ([1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => d.toString()).findIndex(d => d === e.key) >= 0);
  }

  resendOTP() {
    this.isLoading = true;
    const sValue = Object.assign({});
    sValue.mobile_no = this.mobile_no_fc.value;
    this.ds.generateSecretKey().subscribe(key => {
      sValue.mobile_no = this.encryptionService.encrypt(sValue.mobile_no, key);
      this.ds.resendOTPForgotPassword({ mobile_no: sValue.mobile_no }).subscribe(r => {
        this.isLoading = false;
        if (r.message) {
          if (r.message === 'Lockout') {
            const js = JSON.stringify({ lon: new Date(), lfor: (1 + r.lockout_time) });
            localStorage.setItem('lockout', js);
            this.ds.lockout$.next(js);
            this.dialogRef.close(false);
          } else if (r.message === 'OTP resent.') {
            this.isResendOTPEnabled = false;
          } else {
            this.error_msg = r.message;
          }
        }
      })
    })
  }

}
