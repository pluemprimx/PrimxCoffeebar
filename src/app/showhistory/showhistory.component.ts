import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-showhistory',
  templateUrl: './showhistory.component.html',
  styleUrls: ['./showhistory.component.css']
})
export class ShowhistoryComponent implements OnInit {

  historydata:any=[];
  date: string;
  time: string;
  check: any =[];
  orderdetaildata: any = [];
  //url = "http://primx.online/primcafe_api/";
  url = "http://localhost/primcafe_api/";
  constructor(public http : HttpClient,private modalService: NgbModal,private from:FormBuilder) { }

  ngOnInit(): void {
    this.showHistory();
  }


  showHistory(){
    this.historydata.length = 0;
    let url:string = this.url+"showhistory.php";
    let datapost = new FormData();
    //datapost.append('orderdetail_detail',order_data.menu_detail);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
      if(res != null){  
        for (let index = 0; index < res.length; index++) {
         // console.log(res[index].order_status);
            this.historydata[index] = res[index];
            this.formatDate(this.historydata[index].order_datetime);
            this.historydata[index].order_newdate = this.date;
            this.historydata[index].order_newtime = this.time;
            this.historydata[index].id = index;
           // this.showOrderDetail(this.historydata[index].order_id,index)
          
    }
  }
  });
}

formatDate(oldDate){
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
  console.log(this.date+"  "+this.time)
}   

showOrderDetailforcomplete(order_id){
  this.orderdetaildata.length = 0;
  let url:string = this.url+"showorderdetail.php";
  let datapost = new FormData();
  datapost.append('order_id',order_id);
  let data:Observable<any> =  this.http.post(url,datapost);
  data.subscribe(res =>{  
    console.log(res);
    if(res != null){
      
          this.orderdetaildata = res;
        //  this.orderdetaildata.status = status;
          this.orderdetaildata.order_id = res[0].order_id;
  }

});
}

viewDetail(viewdetail,history){
  this.check = history;
  this.showOrderDetailforcomplete(history.order_id);

  this.modalService.open(viewdetail, {size: 'lg',centered: true}).result.then((result) => {
    console.log(result);
   // this.updateOrderStatus(this.check,'ชำระเงินแล้ว');
  }, (reason) => {
  });
}


page = 1;
pageSize = 10;
collectionSize ;

get gethistorydata() {
  this.collectionSize = this.historydata.length;
  return this.historydata
    .map((history, i) => ({id: i + 1, ...history}))
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
}


}
