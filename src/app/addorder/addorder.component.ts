import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, empty } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-addorder',
  templateUrl: './addorder.component.html',
  styleUrls: ['./addorder.component.css']
})
export class AddorderComponent implements OnInit {
  @ViewChild('Swal') private Swal: SwalComponent;
  products:any = [];
  search:FormGroup;
  status:any;
  amountOrder:any = 0 ;
  extra:any = [];
  orderdata:FormGroup;
  extraform:FormGroup;
  extraDetails:any=[{}];
  index:any=0;
  isExit:boolean;
  commentDetail:any ;
  tempRadio:FormGroup;
  cartArray:any=[{}];
  cartIndex:any=0;
  totalCost:any=0;
  costomer:any = '';
  productType:any;
 // url = "http://primx.online/primcafe_api/";
  url = "http://localhost/primcafe_api/";
  constructor(public http : HttpClient,private modalService: NgbModal,private from:FormBuilder) {

    this.search = this.from.group({
      product : null
    });

    this.orderdata = this.from.group({
      order_menu : new FormControl(''),
      order_comment : new FormControl(''),
      order_cost : new FormControl(''),
      order_detail : new FormControl(''),
      order_type : new FormControl('')
    })

    this.extraform = this.from.group({
      add_extra : ''
    });

  

    this.tempRadio = this.from.group({
      Temperature : 'เย็น'
    });

   }

  ngOnInit(): void {
    this.showproduct(0);
    this.selectExtra();
  }

  showproduct(filter){
    
    let url:string = this.url+"showproduct.php";
    let datapost = new FormData();
    //datapost.append('username',sessionStorage.getItem("username"));
    datapost.append('status',filter);
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
            this.products[index] = res[index];
        }
        console.log(this.products);
        }else{
        this.status = 0;
        console.log(false);
        }        
    }
    );

  }

  FilterProduct(ev: any) {
    // Reset items back to all of the items
    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log(val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.status = 1;
      this.products.length ='';
      this.showproduct(val);
    }else{
      
      //this.showproduct(val);
    }
  }

  searchProduct(){
    this.products.length =0;
      //this.products = null;
      let  url = this.url+"searchproduct.php"
      let datapost = new FormData();
      //datapost.append('product',product);
      datapost.append('product',this.search.value.product);
      let data:Observable<any> =  this.http.post(url,datapost);
      data.subscribe(product =>{
        if (product != 'error') {
          this.status = 1;
        } else {
          this.status = 0;
        }
        //console.log(product);
        if(product != null){
          //this.status = 1;
          console.log("ok");  
          for (let index = 0; index < product.length; index++) {
            this.products[index] = product[index];
          } 
          }else{
          //  this.status = 0;
          console.log(false);
          //this.products.length =0;
          }        
        } );      
    }

    selectExtra(){
      let url:string = this.url+"selectextra.php";
      //let datapost = new FormData();
      //datapost.append('username',sessionStorage.getItem("username"));
      //datapost.append('password',this.userData.password);
      let data:Observable<any> =  this.http.get(url);
      data.subscribe(res =>{  
        //console.log(res);
        //this.dok = res[0]; 
       
        if(res != null){
        
          for (let index = 0; index < res.length; index++) {
            this.extra[index] = res[index];
            if(res[index].extra_cost < 0){
              this.extra[index].color = "success"
            }else if(res[index].extra_cost > 0){
              this.extra[index].color = "warning"
            }else if(res[index].extra_cost == 0){
              this.extra[index].color = "primary"
            }
             
          }
         
        

          console.log(this.extra);
          }else{
          console.log(false);
          }        
      }
      );
  
    }


    modalOrderProduct(contentorderProduct,product) {
      this.orderdata.setValue({ 
        order_menu : product.product_name,
        order_cost : product.product_cost,
        order_detail : '',
        order_comment : '',
        order_type : product.product_type,
      })
      this.productType = product.product_type;
        this.modalService.open(contentorderProduct, {size: 'lg',centered: true}).result.then((result) => {
          //this.closeResult = result;
          console.log(result)
  
          this.addtoCart();
  
        }, (reason) => {
          for (let index = 0; index < this.extraDetails.length; index++) {
            this.extraDetails[index] = ''
           }
           this.commentDetail = ''
           this.extraDetails.length = 0;
           this.index = 0;
        });
      }
  
      modalExtraDetail(modalextradetail){
        this.modalService.open(modalextradetail, {size: 'lg',centered: true}).result.then((result) => {
          console.log(result);
          console.log(this.extraform.value.add_extra);
         // this.saveExtra(this.extraform.value.add_extra.extra_name,this.extraform.value.add_extra.extra_cost);

        }, (reason) => {
        });
      }

      addComment(){
        if(this.orderdata.value.order_comment !=null && this.orderdata.value.order_comment != ''){
          this.saveExtra(this.orderdata.value.order_comment,0);
          this.orderdata.value.order_comment = '';
        }
      }

      saveExtra(extra_name,extra_cost){
       
        let detail:any ={};
        detail.extra_name = extra_name;
        detail.extra_cost = extra_cost;
        detail.extra_index = this.index;
          if(extra_cost < 0){ 
            detail.color = "success"
          }else if(extra_cost > 0){
            detail.color = "warning"
          }else if(extra_cost == 0){
            detail.color = "primary"
          }
           
       
                    
          if(this.extraDetails[this.index-1] == null){
          this.extraDetails[this.index] = detail;
          this.orderdata.value.order_cost =  parseFloat(this.orderdata.value.order_cost) + parseFloat(this.extraDetails[this.index].extra_cost);
         // this.comnentDetail = 'Extar : '+this.extraDetails[this.index].extra_name;
          this.index++ ;
              
          }else{

            for (let index = 0; index < this.extraDetails.length; index++) {
              if (detail.extra_name == this.extraDetails[index].extra_name) {
                this.isExit=true;
                break;
              } else {
                this.isExit=false;
              } 
            }

            if(this.isExit==false){
              this.extraDetails[this.index] = detail;
               this.orderdata.value.order_cost =  parseFloat(this.orderdata.value.order_cost) + parseFloat(this.extraDetails[this.index].extra_cost);
              // this.comnentDetail = this.comnentDetail+','+this.extraDetails[this.index].extra_name;
              this.index++ ;
              this.isExit=true;
            }
          }

          this.commentDetail = '';
          for (let index = 0; index < this.extraDetails.length; index++) {
            if(this.extraDetails[index].extra_name != undefined){
              this.commentDetail = this.commentDetail+this.extraDetails[index].extra_name+' ';   
            }
          }
        
        
        console.log( this.extraDetails);
        console.log(  this.index);
        this.extraform.reset();
      }
      

      close(index) {
       console.log(index);
       this.orderdata.value.order_cost =  parseFloat(this.orderdata.value.order_cost) - parseFloat(this.extraDetails[index].extra_cost);
       this.extraDetails[index] = '';    
       this.commentDetail = '';
       for (let index = 0; index < this.extraDetails.length; index++) {
        if(this.extraDetails[index].extra_name != undefined){
        this.commentDetail = this.commentDetail+this.extraDetails[index].extra_name+' ';
        }
      }
      }

      addtoCart(){
        this.amountOrder++;
        this.totalCost +=  parseFloat(this.orderdata.value.order_cost);
        let cart:any ={};
        cart.menu_name = this.orderdata.value.order_menu;
        cart.menu_cost = this.orderdata.value.order_cost;
        cart.index = this.cartIndex;
        if (this.commentDetail == undefined || this.commentDetail == null || this.commentDetail == '') {
          cart.menu_detail = 'ปกติ';
        }else{
          cart.menu_detail = this.commentDetail
        }
       
        this.cartArray[this.cartIndex] = cart;
        this.cartIndex++;
        console.log(this.cartArray);

        for (let index = 0; index < this.extraDetails.length; index++) {
         this.extraDetails[index] = ''
        }
        this.commentDetail = ''
        this.extraDetails.length = 0;
        this.index = 0;

      }

      modalCart(modalcart){
        this.modalService.open(modalcart, {size: 'lg',centered: true}).result.then((result) => {
          console.log(result);
          this.confrimOrder();
        }, (reason) => {
        });
      }

      cancleOrder(index){
        this.amountOrder--;
        this.totalCost = parseFloat(this.totalCost) - parseFloat(this.cartArray[index].menu_cost);
        this.cartArray[index] = '0';
        //this.cartIndex--;
        if (this.amountOrder == 0) {
          this.modalService.dismissAll();
        }
          
      }

      cancelCart(){
        for (let index = 0; index <  this.cartArray.length; index++) {
          if (this.cartIndex > 0) {
            this.cancleOrder(index);
            this.cartIndex--;
          }
        }
       this.amountOrder = 0;
       this.totalCost = 0;
       this.cartArray.length = '';
      // this.modalCart(modalcart);
      //this.deleteSuccessMessage();
      }

      getCostomer(ev: any) {
        const val = ev.target.value;
        console.log(val);
        if (val && val.trim() != '') {
         this.costomer = 'counter_'+val;
        }else{
          this.costomer = 'counter';
        }
      }

      confrimOrder(){
      let url:string = this.url+"addorder.php";
      let datapost = new FormData();
      datapost.append('order_table','counter');
      datapost.append('order_costumer',this.costomer);
      datapost.append('order_num',this.amountOrder);
      datapost.append('order_cost',this.totalCost);
      datapost.append('order_status','รอการยืนยัน');
      datapost.append('order_receipt','ยังไม่ชำระเงิน');
      datapost.append('order_staff','primx');
      let data:Observable<any> =  this.http.post(url,datapost);
      data.subscribe(res =>{  
        console.log(res[0].order_id);
        let orderId = res[0].order_id;
        
      for (let index = 0; index < this.cartArray.length; index++) {
        if (this.cartArray[index] != '0' ) {
          this.confrimOrderdetail(this.cartArray[index],orderId);
        } else {
          
        }
       
      }
      //this.addorderSuccessMessage(orderId);
      this. alertAddOrderSuccsss(orderId)
      this.cancelCart();   
      });
    }

      confrimOrderdetail(order_data,order_id){
      let url:string = this.url+"addorderdetail.php";
      let datapost = new FormData();
      datapost.append('order_id',order_id);
      datapost.append('orderdetail_menu',order_data.menu_name);
      datapost.append('orderdetail_cost',order_data.menu_cost);
      datapost.append('orderdetail_detail',order_data.menu_detail);
      datapost.append('orderdetail_status', 'รอการยืนยัน');
      let data:Observable<any> =  this.http.post(url,datapost);
      data.subscribe(res =>{  
        console.log(res);
      }
      );
      }

/*
      
*/

async alertAddOrderSuccsss(order_id){
    this.Swal.swalOptions = {
    position: 'center',
    //icon: 'success',
    title: '<span class="h1 text-primary"> Order Id : '+order_id+'</div>',
    text : 'Order Added',
    showConfirmButton: true,
    timer: 1500,
    buttonsStyling: false,
    customClass : {
      confirmButton : 'btn btn-outline-primary',
    },
  };
  await this.Swal.fire();
  }

}
