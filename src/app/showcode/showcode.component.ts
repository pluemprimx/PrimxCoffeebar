import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-showcode',
  templateUrl: './showcode.component.html',
  styleUrls: ['./showcode.component.css'],
  styles: [`
  .form-group.hidden {
    width: 0;
    margin: 0;
    border: none;
    padding: 0;
  }
  .custom-day {
    text-align: center;
    padding: 0.185rem 0.25rem;
    display: inline-block;
    height: 2rem;
    width: 2rem;
  }
  .custom-day.focused {
    background-color: #e6e6e6;
  }
  .custom-day.range, .custom-day:hover {
    background-color: rgb(2, 117, 216);
    color: white;
  }
  .custom-day.faded {
    background-color: rgba(2, 117, 216, 0.5);
  }
`]
})
export class ShowcodeComponent implements OnInit {
  @ViewChild('Swal') private Swal: SwalComponent;
  status:any = 0;
  codeArray:any = [];
  codeData:FormGroup;
  types:any =['Normal','Percent'];
  statuses:any =['ใช้งาน','ยกเลิกการใช้งาน','หมดอายุ','ยังไม่ใช้งาน','หมด'];
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  time:any;
  date:any;
  codeName:any;
  filter:any = 0;
  //url = "http://primx.online/primcafe_api/";
  url = "http://localhost/primcafe_api/";
    constructor(public http : HttpClient,private modalService: NgbModal,private from:FormBuilder,private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
      
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 3);

      this.codeData = this.from.group({
      code_name   : new FormControl(''),
      code_cost   : new FormControl(''),
      code_type   : new FormControl('Normal'),
      code_start  : new FormControl( this.fromDate.year+'-'+this.fromDate.month+'-'+this.fromDate.day),
      code_enddate: new FormControl( this.toDate.year+'-'+this.toDate.month+'-'+this.toDate.day),
      code_number : new FormControl(''),
      code_detail : new FormControl(''),
      code_status : new FormControl('ใช้งาน'),
    });

   }

  ngOnInit(): void {
    this.codeArray = [];
    this.codeArray.length = 0;
    this.showCode(this.filter);
   
  }


  showCode(filter){
    let url:string = this.url+"selectcode.php";
    let datapost = new FormData();
    //datapost.append('username',sessionStorage.getItem("username"));
    datapost.append('status',filter);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
      if(res != null){
        if (res != 'error') {
          this.status = 1;
        } else {
          this.status = 0;
        }

        for (let index = 0; index < res.length; index++) {
          this.codeArray[index] = res[index];

          this.formatDate(res[index].code_start);
          this.codeArray[index].code_newstartdate = this.date;

          this.formatDate(res[index].code_enddate);
          this.codeArray[index].code_newenddate = this.date;

          this.checkTimeOut(this.codeArray[index]);

          if ( this.codeArray[index].code_status == 'ใช้งาน') {
            if (this.codeArray[index].code_number == '0') {
              this.codeArray[index].code_status = 'หมด';
              this.updateCodeStatus(this.codeArray[index]);
            }
          }
          
          if ( this.codeArray[index].code_status == 'หมด') {
            if (this.codeArray[index].code_number != '0') {
              this.codeArray[index].code_status = 'ใช้งาน';
              this.updateCodeStatus(this.codeArray[index]);
            }
          }
          

        }
        }else{
        this.status = 0;
        console.log(false);
        }        
    }
    );
    console.log(this.codeArray)
  }


  FilterCode(ev: any) {
    // Reset items back to all of the items
    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log(val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.status = 1;
      this.codeArray.length ='';
      this.showCode(val);
    }else{
      
      //this.showproduct(val);
    }
  }

  addCode(){ 
    console.log(this.codeData);
    let url:string = this.url+"addcode.php";
    let datapost = new FormData();
    datapost.append('code_name',this.codeData.value.code_name);
    datapost.append('code_cost',this.codeData.value.code_cost);
    datapost.append('code_type',this.codeData.value.code_type);
    datapost.append('code_start', this.fromDate.year+'-'+this.fromDate.month+'-'+this.fromDate.day );
    datapost.append('code_enddate',this.toDate.year+'-'+this.toDate.month+'-'+this.toDate.day);
    datapost.append('code_number',this.codeData.value.code_number);
    datapost.append('code_detail',this.codeData.value.code_detail);
    datapost.append('code_status',this.codeData.value.code_status);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
      this.codeData.reset();
      this.alertAddSuccsss();
      this.ngOnInit();
    }
    );
  }

  updateCode(code){ 
    console.log(this.codeData);
    let url:string = this.url+"updatecode.php";
    let datapost = new FormData();
    datapost.append('code_id',code.code_id);
    datapost.append('code_name',this.codeData.value.code_name);
    datapost.append('code_cost',this.codeData.value.code_cost);
    datapost.append('code_type',this.codeData.value.code_type);
    datapost.append('code_start', this.fromDate.year+'-'+this.fromDate.month+'-'+this.fromDate.day );
    datapost.append('code_enddate',this.toDate.year+'-'+this.toDate.month+'-'+this.toDate.day);
    datapost.append('code_number',this.codeData.value.code_number);
    datapost.append('code_detail',this.codeData.value.code_detail);
    datapost.append('code_status',this.codeData.value.code_status);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
      this.codeData.reset();
      this.alertUpdateCodeSuccsss();
      this.ngOnInit();
    }
    );
    
  }

  updateCodeStatus(code){ 
    console.log(this.codeData);
    let url:string = this.url+"updatecode.php";
    let datapost = new FormData();
    datapost.append('code_id',code.code_id);
    datapost.append('code_name',code.code_name);
    datapost.append('code_cost',code.code_cost);
    datapost.append('code_type',code.code_type);
    datapost.append('code_start', this.fromDate.year+'-'+this.fromDate.month+'-'+this.fromDate.day );
    datapost.append('code_enddate',this.toDate.year+'-'+this.toDate.month+'-'+this.toDate.day);
    datapost.append('code_number',code.code_number);
    datapost.append('code_detail',code.code_detail);
    datapost.append('code_status',code.code_status);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
      this.codeData.reset();
     //this.alertUpdateCodeSuccsss();
      this.ngOnInit();
    }
    );
    
  }

  getValueSaerch(ev: any) {
    // Reset items back to all of the items
    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log(val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.status = 1;
      this.codeArray = [];
      this.codeArray.length ='';
      this.searchCode(val);
    }else{
      
      //this.showproduct(val);
    }
  }

  searchCode(val){
    let url:string = this.url+"searchcode.php";
    let datapost = new FormData();
    datapost.append('code',val);
    //datapost.append('status',Filter);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
      if(res != null){
        if (res != 'error') {
          this.status = 1;
        } else {
          this.status = 0;
        }

        for (let index = 0; index < res.length; index++) {
          this.codeArray[index] = res[index];

          this.formatDate(res[index].code_start);
          this.codeArray[index].code_newstartdate = this.date;

          this.formatDate(res[index].code_enddate);
          this.codeArray[index].code_newenddate = this.date;
          
        }
        }else{
        this.status = 0;
        console.log(false);
        }        
    }
    );
   }

  deleteCode(code){
    let url:string = this.url+"deletecode.php";
    let datapost = new FormData();
    datapost.append('code_id',code.code_id);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
      this.codeData.reset();
      this.alertDeleteCodeSuccsss(code.code_name);
      this.ngOnInit();
    }
    );
  }

  checkTimeOut(code){
    var date = new Date(code.code_enddate); // had to remove the colon (:) after the T in order to make it work
    var day = date.getDate()+1;
    var monthIndex = date.getMonth();   
    var year = date.getFullYear();
   // var end_date = year+'-'+monthIndex+'-'+day;
    var startdate = new Date(code.code_start); // had to remove the colon (:) after the T in order to make it work
    var s_day = startdate.getDate();
    var s_monthIndex = startdate.getMonth();   
    var s_year = startdate.getFullYear();

    var a_day = new Date();
    var today_day = a_day.getDate();
    var today_monthIndex = a_day.getMonth();   
    var today_year = a_day.getFullYear();
   // var today = today_year+'-'+today_monthIndex+'-'+today_day;
    var m_start_date = s_year+'/'+s_monthIndex+'/'+s_day;
    var m_end_date = year+'/'+monthIndex+'/'+day;
    var m_today = today_year+'/'+today_monthIndex+'/'+today_day;

    var minli_enddate = new Date(m_end_date).getTime();
    var minli_start = new Date(m_start_date).getTime();
    var minli_today = new Date(m_today).getTime();
    console.log(minli_enddate);
    console.log(minli_today);
    console.log(minli_start);
    console.log(code);
    if (code.code_status !== 'หมดอายุ') {
      if (minli_enddate <= minli_today) {
        code.code_status = 'หมดอายุ';
        this.updateCodeStatus(code);
      }
    }

    if(code.code_status == 'ยังไม่ใช้งาน'){
      if(minli_start <= minli_today && minli_enddate > minli_today){
        code.code_status = 'ใช้งาน';
        this.updateCodeStatus(code);
      } 
      
    }

     if(code.code_status == 'ใช้งาน') {
      
      if(minli_start > minli_today){
        code.code_status = 'ยังไม่ใช้งาน';
        this.updateCodeStatus(code);
      }  
    }

    if(code.code_status == 'หมดอายุ') {
      if(minli_enddate > minli_today){
        code.code_status = 'ใช้งาน';
        this.updateCodeStatus(code);
      }  
    }

    
  }

  // checkTimeStart(code){
   
  //   var end_date = year+'-'+monthIndex+'-'+day;
  //   var a_day = new Date();
  //   var today_day = a_day.getDate();
  //   var today_monthIndex = a_day.getMonth();   
  //   var today_year = a_day.getFullYear();
  //   var today = today_year+'-'+today_monthIndex+'-'+today_day;

  //   var m_start_date = year+'/'+monthIndex+'/'+day;
  //   var m_today = today_year+'/'+today_monthIndex+'/'+today_day;
  //   var minli_start = new Date(m_start_date).getTime();
  //   var minli_today = new Date(m_today).getTime();
  //   console.log(minli_start+'='+minli_today);
  //   if (code.code_status == 'ใช้งาน') {
  //     if (minli_start >= minli_today) {
  //       code.code_status = 'ใช้งาน';
  //       this.updateCodeStatus(code);
  //     }
  //   }
    
  // }
  

  modelAddCode(addcode) {
    this.codeData = this.from.group({
      code_name   : new FormControl(''),
      code_cost   : new FormControl(''),
      code_type   : new FormControl('Normal'),
      code_start  : new FormControl( this.fromDate.year+'-'+this.fromDate.month+'-'+this.fromDate.day),
      code_enddate: new FormControl( this.toDate.year+'-'+this.toDate.month+'-'+this.toDate.day),
      code_number : new FormControl(''),
      code_detail : new FormControl(''),
      code_status : new FormControl('ใช้งาน'),
    });
    console.log(this.codeData)
      this.modalService.open(addcode, {size: 'lg',centered: true}).result.then((result) => { 
        console.log(result)
        this.addCode();
        this.ngOnInit();
      }, (reason) => {
       this.codeData.reset();
      });
    }

    modelUpdateCode(updatecode,code) {

      this.codeData.setValue({
        code_name   : code.code_name,
        code_cost   : code.code_cost,
        code_type   : code.code_type,
        code_start  : code.code_start,
        code_enddate: code.code_enddate,
        code_number : code.code_number,
        code_detail : code.code_detail,
        code_status :code.code_status ,
      });
      var startdate = new Date(code.code_start);
      var enddate = new Date(code.code_enddate);
      let a:any = { "day" : startdate.getDate() , "month" : startdate.getMonth()+1, "year" : startdate.getFullYear() };
      let b:any ={ "day" : enddate.getDate() , "month" : enddate.getMonth()+1, "year" : enddate.getFullYear() };
      this.fromDate = a;
      this.toDate = b;

      this.modalService.open(updatecode, {size: 'lg',centered: true}).result.then((result) => { 
        console.log(result)

       this.updateCode(code)
       
      }, (reason) => {
       this.codeData.reset();
      });
    }

    modelDeleteCode(deletecode,code) {
      this.codeName = code.code_name;
      this.modalService.open(deletecode, {size: 'lg',centered: true}).result.then((result) => { 
        console.log(result)

        this.deleteCode(code);
        this.ngOnInit();
      }, (reason) => {
       this.codeData.reset();
      });
    }



  async alertAddSuccsss(){
    this.Swal.swalOptions = {};
    this.Swal.swalOptions = {
      position: 'center',
      icon: 'success',
      title: 'Code added',
      text: '',
      showConfirmButton: false,
      timer: 1500
    };
    await this.Swal.fire();
    }

    async alertUpdateCodeSuccsss(){
      this.Swal.swalOptions = {};
      this.Swal.swalOptions = {
        position: 'center',
        icon: 'success',
        title: 'Code updated',
        text: '',
        showConfirmButton: false,
        timer: 1500
      };
      await this.Swal.fire();
      }

      async alertDeleteCodeSuccsss(Code){
        this.Swal.swalOptions = {
          position: 'center',
          icon: 'success',
          title: '<p class="text-danger">'+ Code +'</p>',
          text: 'Code deleted!',
          showConfirmButton: false,
          timer: 1500
        };
        await this.Swal.fire();
        }

        onDateSelection(date: NgbDate) {
          if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
          } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
          } else {
            this.toDate = null;
            this.fromDate = date;
          }
        }
      
        isHovered(date: NgbDate) {
          return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
        }
      
        isInside(date: NgbDate) {
          return date.after(this.fromDate) && date.before(this.toDate);
        }
      
        isRange(date: NgbDate) {
          return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
        }
      
        validateInput(currentValue: NgbDate, input: string): NgbDate {
          const parsed = this.formatter.parse(input);
          return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
        }


      async formatDate(oldDate){
          var date = new Date(oldDate); // had to remove the colon (:) after the T in order to make it work
          var day = date.getDate();
          var monthIndex = date.getMonth();    
          let b:any;
          switch(monthIndex+1){
              case 1: b = "January";
                  break;
              case 2: b = "February";
                  break;
              case 3: b = "March";
                  break;
              case 4: b = "April";
                  break;
              case 5: b = "May";
                  break;
              case 6: b = "June"; 
                  break;
              case 7: b = "July";
                  break;
              case 8: b = "August";
                  break;
              case 9: b = "September";
                  break;
              case 10: b = "October";
                  break;
              case 11: b = "November";
                  break;
              case 12: b = "December";
                  break;
              }
          let month:any = b;
          var year = date.getFullYear();
          var minutes = date.getMinutes();
          var hours = date.getHours();
          var seconds = date.getSeconds();
          var myFormattedDate = day+" "+month+" "+year;
          var myFormattedtime = hours+":"+minutes+":"+seconds;
          this.date = myFormattedDate;
          this.time = myFormattedtime;
          console.log(this.date+"  "+this.time);
          
        }   
}

