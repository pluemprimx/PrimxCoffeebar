import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SweetAlert2Module, BeforeOpenEvent, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertShowClass } from 'sweetalert2';


@Component({
  selector: 'app-showorder',
  templateUrl: './showorder.component.html',
  styleUrls: ['./showorder.component.css']
})
export class ShoworderComponent implements OnInit {

  orderdata:any=[];
  orderdetaildata:any=[];
  date: string;
  time: string;
  checkData:FormGroup;
  check:any=[];
  codeArray:any=[];
  status:any;
  orderId:any;
  //url = "http://primx.online/primcafe_api/";
  url = "http://localhost/primcafe_api/";
  @ViewChild('Swal') private Swal: SwalComponent;

  constructor(public http : HttpClient,private modalService: NgbModal,private from:FormBuilder) {

    this.checkData = this.from.group({
      cash : ''
    });

   }

  ngOnInit(): void {
    this.showOrder();
    console.log(this.orderdata);
    //console.log(this.checkData.value.cash);
  }

  
 
  
  showOrder(){
    this.orderdata.length = 0;
    let url:string = this.url+"showorder.php";
    let datapost = new FormData();
    //datapost.append('orderdetail_detail',order_data.menu_detail);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
      if(res != null){  
        for (let index = 0; index < res.length; index++) {
         // console.log(res[index].order_status);
            this.orderdata[index] = res[index];
            this.formatDate(this.orderdata[index].order_datetime);
            this.orderdata[index].order_newdate = this.date;
            this.orderdata[index].order_newtime = this.time;
           // this.showOrderDetail(this.orderdata[index].order_id,index)
           

            if( this.orderdata[index].order_status == 'รอการยืนยัน'){
              this.orderdata[index].color = "danger"
              this.orderdata[index].button = "ยืนยัน"
              this.orderdata[index].value = "กำลังดำเนินการ"
             
             }else if(this.orderdata[index].order_status == 'กำลังดำเนินการ'){
              this.orderdata[index].color = "warning"
              this.orderdata[index].button = "เสร็จแล้ว"
              this.orderdata[index].value = "เสร็จแล้ว"
              
             }else if(this.orderdata[index].order_status == 'เสร็จแล้ว'){
                if(this.orderdata[index].order_receipt == 'ยังไม่ชำระเงิน'){
                      this.orderdata[index].color = "success"
                      this.orderdata[index].button = "ชำระเงิน"
                      this.orderdata[index].value = "เรียกรับสินค้า"
                    }else {
                      this.orderdata[index].color = "info"
                      this.orderdata[index].button = "รับสินค้า"
                      this.orderdata[index].value = "รับสินค้าแล้ว"
                    }
             }

           }
          
   
  }
  });
}


showOrderDetail(order_id,status){
  let url:string = this.url+"showorderdetail.php";
  let datapost = new FormData();
  datapost.append('order_id',order_id);
  let data:Observable<any> =  this.http.post(url,datapost);
  data.subscribe(res =>{  
    console.log(res);
    if(res != null){
          this.orderdetaildata = res;
          this.orderdetaildata.status = status;
          this.orderdetaildata.order_id = res[0].order_id;

    let  count_status:boolean = false;
      for (let index = 0; index < this.orderdetaildata.length; index++) {
        if(this.orderdetaildata[index].orderdetail_status == 'เสร็จแล้ว'){
          count_status = true;
        }else{
          count_status = false;
          break;
        }
}

      if(count_status == true){
      this.orderdetaildata.status = 'เสร็จแล้ว';
      for (let index = 0; index < this.orderdata.length; index++) {
        if(this.orderdata[index].order_id == order_id){
          this.orderdata[index].order_status = 'เสร็จแล้ว';
          this.updateOrderStatus(this.orderdata[index]);
          this.modalService.dismissAll();
          count_status = false;
        }
      }

    }

  }

});
}

showOrderDetailforcomplete(order_id,status){
  this.orderdetaildata.length = 0;
  let url:string = this.url+"showorderdetail.php";
  let datapost = new FormData();
  datapost.append('order_id',order_id);
  let data:Observable<any> =  this.http.post(url,datapost);
  data.subscribe(res =>{  
    console.log(res);
    if(res != null){
      
          this.orderdetaildata = res;
          this.orderdetaildata.status = status;
          this.orderdetaildata.order_id = res[0].order_id;
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


modalViewDetail(modaldetail,order_id,status){
  this.showOrderDetail(order_id,status);
  this.modalService.open(modaldetail, {size: 'lg',centered: true}).result.then((result) => {
    console.log(result);
  }, (reason) => {
  });
}

updateOrderStatus(order){
 
  let url:string = this.url+"updateorder.php";
  let datapost = new FormData();
  datapost.append('order_id',order.order_id);
  datapost.append('order_table',order.order_table);
  datapost.append('order_costumer',order.order_costumer);
  datapost.append('order_datetime',order.order_datetime);
  datapost.append('order_num',order.order_num);
  datapost.append('order_cost',order.order_cost);
  datapost.append('order_status',order.order_status);
  datapost.append('order_receipt',order.order_receipt);
  datapost.append('order_staff',order.order_staff);
  let data:Observable<any> =  this.http.post(url,datapost);
  data.subscribe(res =>{  
    console.log(res);
    if(res == 'success'){
      if(order.receipt == 'ชำระเงินแล้ว'){
        this.successfulPayment();
      }else if(status == 'ยกเลิกรายการ'){
        this.successCancleOrder();
      }
      this.ngOnInit();
    }
});

}

updateOrderStatus1(order,status){
 
  let url:string = this.url+"updateorder.php";
  let datapost = new FormData();
  datapost.append('order_id',order.order_id);
  datapost.append('order_table',order.order_table);
  datapost.append('order_costumer',order.order_costumer);
  datapost.append('order_datetime',order.order_datetime);
  datapost.append('order_num',order.order_num);
  datapost.append('order_cost',order.order_cost);
  datapost.append('order_status',status);
  datapost.append('order_receipt',order.order_receipt);
  datapost.append('order_staff',order.order_staff);
  let data:Observable<any> =  this.http.post(url,datapost);
  data.subscribe(res =>{  
    console.log(res);
    if(res == 'success'){
      if(order.receipt == 'ชำระเงินแล้ว'){
        this.successfulPayment();
      }else if(status == 'ยกเลิกรายการ'){
        this.successCancleOrder();
      }
      this.ngOnInit();
    }
});

}

checkOut(checkout,order){
  this.check = order;
  this.showOrderDetailforcomplete(order.order_id,order.order_status);
  this.check.cash = 0;
  this.check.change = 0;
  this.check.status = 'กรุณากรอกจำนวนเงิน';

  this.modalService.open(checkout, {size: 'lg',centered: true}).result.then((result) => {
    console.log(result);
    this.check.order_receipt = 'ชำระเงินแล้ว';
    this.updateOrderStatus(this.check);
  }, (reason) => {
  });
}

getCash(ev: any) {
  const val = ev.target.value;
  this.check.cash = val;
  console.log(val);
  if (val && val.trim() != '') {
   if (val < 0) {
    this.check.status = 'กรุณากรอกจำนวนเต็มบวก';
   }else{
    this.calculateChange(val);
   }
  }else{
    this.check.cash = 0;
    this.check.status = 'กรุณากรอกจำนวนเงิน';
  }
}

calculateChange(cash){
  if(parseFloat(this.check.order_cost)<0){
    this.check.change = parseFloat(this.check.order_cost)+parseFloat(cash);
  }else{
    this.check.change = parseFloat(cash)-parseFloat(this.check.order_cost);
  }
  
  console.log(this.check.change);
  console.log(parseFloat(this.check.order_cost));
 if(this.check.change < 0){
    this.check.status = 'จำนวนเงินไม่เพียงพอ';
  }else{
    this.check.status = 1;
  }
    
  }

  checkOrder(orderdetail){
    console.log(orderdetail)
      let url:string = this.url+"updateorderdetail.php";
      let datapost = new FormData();
      datapost.append('orderdetail_id',orderdetail.orderdetail_id);
      datapost.append('order_id',orderdetail.order_id);
      datapost.append('orderdetail_menu',orderdetail.orderdetail_menu);
      datapost.append('orderdetail_cost',orderdetail.orderdetail_cost);
      datapost.append('orderdetail_detail',orderdetail.orderdetail_detail);
      datapost.append('orderdetail_status','เสร็จแล้ว');
      let data:Observable<any> =  this.http.post(url,datapost);
      data.subscribe(res =>{  
        console.log(res);
        this.showOrderDetail(orderdetail.order_id,'กำลังดำเนินการ');
      }
      ); 
  }

  cancelOrder(order){
    order.order_status = 'ยกเลิกรายการ'  ; 
    this.updateOrderStatus(order);
  }

  addCode(addcode){
    this.showcode();
    this.modalService.open(addcode, {size: 'lg',centered: true}).result.then((result) => {
      console.log(result);
    }, (reason) => {
    });
  }

  customerGetproduct(order){
    order.order_status =  'รับสินค้าแล้ว';
    this.updateOrderStatus(order);
  }

  showcode(){
    let url:string = this.url+"selectcode.php";
    let datapost = new FormData();
    //datapost.append('username',sessionStorage.getItem("username"));
    datapost.append('status','0');
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      if (res != 'error') {
        this.status = 1;
      } else {
        this.status = 0;
      }

      if(res != null){
        this.status = 1;
        for (let index = 0; index < res.length; index++) {
            this.codeArray[index] = res[index];
        }
        console.log(this.codeArray);
        }else{
        this.status = 0;
        console.log(false);
        }        
    }
    );

  }

  updateCodeStatus(code){ 
   // console.log(this.codeData);
    let url:string = this.url+"updatecode.php";
    let datapost = new FormData();
    datapost.append('code_id',code.code_id);
    datapost.append('code_name',code.code_name);
    datapost.append('code_cost',code.code_cost);
    datapost.append('code_type',code.code_type);
    datapost.append('code_start', code.code_start );
    datapost.append('code_enddate',code.code_enddate );
    datapost.append('code_number',code.code_number);
    datapost.append('code_detail',code.code_detail);
    datapost.append('code_status',code.code_status);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
     // this.codeData.reset();
     //this.alertUpdateCodeSuccsss();
      this.ngOnInit();
    }
    );
    
  }

  insertCode(code){
    
    if (code.code_type == 'Normal') {
      code.code_costUpdate = code.code_cost;
      this.check.order_cost = parseFloat(this.check.order_cost) - parseFloat(code.code_costUpdate);
      code.code_number = parseFloat(code.code_number)-1;
      if (code.code_number == '0') {
        code.code_status = 'ยกเลิกการใช้งาน';
       }
      code.code_ps = 'ลด '+code.code_cost+' บาท';
    } else {
      code.code_costUpdate =  (parseFloat(this.check.order_cost)*parseFloat(code.code_cost))/100;
      this.check.order_cost = parseFloat(this.check.order_cost) - parseFloat(code.code_costUpdate);
      this.check.order_cost = parseFloat(this.check.order_cost).toFixed(0);
      code.code_number = parseFloat(code.code_number)-1;
      if (code.code_number == '0') {
       code.code_status = 'หมด';
      }
      code.code_ps = 'ลด '+code.code_cost+' %';
    }
    this.updateCodeStatus(code);
    this.updateOrderStatus(this.check);
    this.addOrderdetail(code,this.check.order_id);
  }

  addOrderdetail(code,order_id){
    let url:string = this.url+"addorderdetail.php";
    let datapost = new FormData();
    datapost.append('order_id',order_id);
    datapost.append('orderdetail_menu',code.code_name);
    datapost.append('orderdetail_cost','-'+code.code_costUpdate);
    datapost.append('orderdetail_detail', code.code_ps);
    datapost.append('orderdetail_status', 'เสร็จแล้ว');
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
     this.showOrderDetailforcomplete(order_id,'เสร็จแล้ว')
      console.log(res);
    }
    );
    }

    confirmCancelOrder(comfirmcancelordercontent,order) {
      this.orderId = order.order_id;
      this.modalService.open(comfirmcancelordercontent, {size: 'lg',centered: true}).result.then((result) => {
        console.log(result)
        order.order_status = 'ยกเลิกรายการ';
        this.updateOrderStatus(order);
        //this.successCancleOrder();
      }, (reason) => {
      //  this.closeResult = this.getDismissReason(reason);

      });
    }


    async successfulPayment(){
      this.Swal.swalOptions = {
        position: 'center',
        icon: 'success',
        title: 'Successful payment',
        text: '',
        showConfirmButton: false,
        timer: 1500
      };
      await this.Swal.fire();
      }

      async successCancleOrder(){
        this.Swal.swalOptions = {
          position: 'center',
          icon: 'success',
          title: 'Success',
          text : 'Order has been canceled',
          showConfirmButton: false,
          timer: 1500
        };
        await this.Swal.fire();
        }
}
