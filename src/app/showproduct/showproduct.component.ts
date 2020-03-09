import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-showproduct',
  templateUrl: './showproduct.component.html',
  styleUrls: ['./showproduct.component.css'],
 
})
export class ShowproductComponent implements OnInit {
    @ViewChild('Swal') private Swal: SwalComponent;
   products:any = [];
   results:any=[];
   name:string='primx';
   productData:FormGroup;
   closeResult: string;
   data:any = [];
   types:any = ['เครื่องดื่ม','ขนม'];
   statuses:any = ['ขาย','ไม่ขาย'];
   product_cost:any;
   search:FormGroup;
   status:any;
   productName:any;
   Filter:any = 0;

  staticAlertClosed = false;
  successMessage: string;
  updatedata:any =[];
  updated:FormGroup;
  extra: any = [];
  extraform: FormGroup;
  extraName:any;
  //url = "http://primx.online/primcafe_api/";
  url = "http://localhost/primcafe_api/";
  // product_id :any ;
  // product_name :any;
  // product_cost :any ;
  // product_type :any ;
  // product_status : any;

  constructor(public http : HttpClient,private modalService: NgbModal,private from:FormBuilder) {
    this.productData = this.from.group({
      product_name : new FormControl(''),
      product_cost : new FormControl(''),
      product_type : new FormControl(''),
      product_status : new FormControl(''),
      product_detail : new FormControl(''),
    });

    this.search = this.from.group({
      product : null,
    });

    this.updated = this.from.group({
      product_id : new FormControl(''),
      product_name : new FormControl(''),
      product_cost : new FormControl(''),
      product_type : new FormControl(''),
      product_status : new FormControl(''),
      product_detail : new FormControl(''),
    });

    this.extraform = this.from.group({
      extra_name : new FormControl(''),
      extra_type :'เครื่องดื่ม',
      extra_cost : '0',
      extra_ps : new FormControl(''),
    });
   }

  ngOnInit(): void {
    // let url:string = 'assets/showproduct.json';
    // this.http.get(url).subscribe(data => {
    // this.results = data['results'];
    //console.log(this.search.value.filter);
    // });   
   
    this.showproduct(this.Filter);
  
  
  }

  showproduct(Filter){
    
    let url:string = this.url+"showproduct.php";
    let datapost = new FormData();
    //datapost.append('username',sessionStorage.getItem("username"));
    datapost.append('status',Filter);
    let data:Observable<any> =  this.http.post(url,datapost);
    data.subscribe(res =>{  
      console.log(res);
      //this.dok = res[0]; 
      if(res != null){
        if (res != 'error') {
          this.status = 1;
        } else {
          this.status = 0;
        }

        for (let index = 0; index < res.length; index++) {
          this.products[index] = res[index];
          //this.dok = res[index] ;
         //console.log(this.dok);
        }
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

  open(content) {
    this.productData.setValue({ 
      product_name : '',
      product_status : 'ขาย',
      product_type : 'เครื่องดื่ม',
      product_cost : '',
      product_detail : ''
    })
      this.modalService.open(content, {size: 'lg',centered: true}).result.then((result) => {
        this.closeResult = result;
        console.log(result)

        this.addproduct();

      }, (reason) => {
        this.closeResult = this.getDismissReason(reason);
        this.productData.reset();
      });
    }

    addproduct(){ 
      console.log(this.productData.value.product_name);
      console.log(this.productData.value.product_cost);
      console.log(this.productData.value.product_type);
      console.log(this.productData.value.product_status);

      let url:string = this.url+"addproduct.php";
      let datapost = new FormData();
      datapost.append('product_name',this.productData.value.product_name);
      datapost.append('product_cost',this.productData.value.product_cost);
      datapost.append('product_type',this.productData.value.product_type);
      datapost.append('product_status',this.productData.value.product_status);
      datapost.append('product_detail',this.productData.value.product_detail);
      let data:Observable<any> =  this.http.post(url,datapost);
      data.subscribe(res =>{  
        console.log(res);
        this.productData.reset();
        this.alertAddproductSuccsss();
        this.ngOnInit();
      }
      );
      
    }

    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return reason;
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
          console.log(product);
          if(product != null){
            console.log("ok"); 
           // this.status = 1;  
            for (let index = 0; index < product.length; index++) {
              this.products[index] = product[index];
            }
          
            }else{
           // this.status = 0;
            console.log(false);
            //this.products.length =0;
            }        

         
          } );      
      }
  
      deleteProduct(deletecontent,product) {
        this.productName = product.product_name;
        this.modalService.open(deletecontent, {size: 'lg',centered: true}).result.then((result) => {
          console.log(result)

         this.goDelete(product);

        }, (reason) => {
        //  this.closeResult = this.getDismissReason(reason);

        });
      }

      goDelete(product){
        let url:string = this.url+"deleteproduct.php";
        let datapost = new FormData();
        datapost.append('product_id',product.product_id);
        let data:Observable<any> =  this.http.post(url,datapost);
        data.subscribe(res =>{  
          console.log(res);
          this.alertDeleteproductSuccsss(this.productName);
          //this.deleteSuccessMessage();
         //window.location.reload();
        }
        );
      }
  
      openUpdateProduct(updateproduct,product){

        this.updated.setValue({
          product_id : product.product_id,
          product_name : product.product_name,
          product_status : product.product_status,
          product_type : product.product_type,
          product_cost : product.product_cost,
          product_detail : product.product_detail,
        })
        
        this.modalService.open(updateproduct, {size: 'lg',centered: true}).result.then((result) => {
          console.log(result)

          this.updateproduct()

        }, (reason) => {
      

        });
      }

      updateproduct(){
        let url:string = this.url+"updateproduct.php";
        let datapost = new FormData();
        datapost.append('product_id',this.updated.value.product_id);
        datapost.append('product_name',this.updated.value.product_name);
        datapost.append('product_cost',this.updated.value.product_cost);
        datapost.append('product_type',this.updated.value.product_type);
        datapost.append('product_status',this.updated.value.product_status);
        datapost.append('product_detail',this.updated.value.product_detail);
        let data:Observable<any> =  this.http.post(url,datapost);
        data.subscribe(res =>{  
          console.log(res);
          this.updated.reset();
          this.alertUpdateproductSuccsss();
          this.ngOnInit();
        }
        );


      }
      
      async alertAddproductSuccsss(){
        this.Swal.swalOptions = {
          position: 'center',
          icon: 'success',
          title: 'Product added',
          text: '',
          showConfirmButton: false,
          timer: 1500
        };
        await this.Swal.fire();
        }

        async alertUpdateproductSuccsss(){
          this.Swal.swalOptions = {
            position: 'center',
            icon: 'success',
            title: 'Product updated',
            text: '',
            showConfirmButton: false,
            timer: 1500
          };
          await this.Swal.fire();
          }

          async alertDeleteproductSuccsss(product_name){
            this.Swal.swalOptions = {
              position: 'center',
              icon: 'success',
              title: '<p class="text-danger">'+product_name +'</p>',
              text: 'Product deleted!',
              showConfirmButton: false,
              timer: 1500
            };
            await this.Swal.fire();
            this.products.length =0;
            this.ngOnInit();
            }


            modaladdExtra(modaladdextra){
              this.modalService.open(modaladdextra, {size: 'lg',centered: true}).result.then((result) => {
                console.log(result)
      
                this.addExtra();
      
              }, (reason) => {
                this.extraform.setValue({
                  extra_name : '',
                  extra_type : 'เครื่องดื่ม',
                  extra_cost : '0',
                  extra_ps :  '',
                });
              });
            }


            addExtra(){
              let url:string = this.url+"addextra.php";
              let datapost = new FormData();
              datapost.append('extra_name',this.extraform.value.extra_name);
              datapost.append('extra_type',this.extraform.value.extra_type);
              datapost.append('extra_cost',this.extraform.value.extra_cost);
              datapost.append('extra_ps',this.extraform.value.extra_ps);
              let data:Observable<any> =  this.http.post(url,datapost);
              data.subscribe(res =>{  
                console.log(res);
               
                this.alertAddExtraSuccsss();
                this.selectExtra();
              }
              );
             
            }

            selectExtra(){
              this.extra.length = 0;
              this.extraform.setValue({
                extra_name : '',
                extra_type : 'เครื่องดื่ม',
                extra_cost : '0',
                extra_ps :  '',});
              let url:string = this.url+"selectextra.php";
              let data:Observable<any> =  this.http.get(url);
              data.subscribe(res =>{  
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
              });
            }

            editExtra(updateextra,extra){
              this.extraform.setValue({
                extra_name : extra.extra_name,
                extra_type : extra.extra_type,
                extra_cost : extra.extra_cost,
                extra_ps :  extra.extra_ps,
              });


              this.modalService.open(updateextra, {size: 'lg',centered: true}).result.then((result) => {
                console.log(result)
      
                this.updateExtra(extra)
      
              }, (reason) => {
                this.extraform.setValue({
                  extra_name : '',
                  extra_type : 'เครื่องดื่ม',
                  extra_cost : '0',
                  extra_ps :  '',
                });
              });


            }
            

            updateExtra(extra){
              let url:string = this.url+"updateextra.php";
              let datapost = new FormData();
              datapost.append('extra_id',extra.extra_id);
              datapost.append('extra_name',this.extraform.value.extra_name);
              datapost.append('extra_type',this.extraform.value.extra_type);
              datapost.append('extra_cost',this.extraform.value.extra_cost);
              datapost.append('extra_ps',this.extraform.value.extra_ps);
              let data:Observable<any> =  this.http.post(url,datapost);
              data.subscribe(res =>{  
                console.log(res);
                this.extraform.reset();
                this.alertUpdateExtraSuccsss();
                this.selectExtra();
              }
              );

            }
            
            modalExtraDetail(modalextradetail){
              this.selectExtra();
              this.modalService.open(modalextradetail, {size: 'lg',centered: true}).result.then((result) => {
                console.log(result);
               // this.saveExtra(this.extraform.value.add_extra.extra_name,this.extraform.value.add_extra.extra_cost);
               
              }, (reason) => {
                this.extraform.setValue({
                  extra_name : '',
                  extra_type : 'เครื่องดื่ม',
                  extra_cost : '0',
                  extra_ps :  '',});
              });
            }
          
            deleteExtra(deleteextra,extra) {
              this.extraName = extra.extra_name;
              this.modalService.open(deleteextra, {size: 'lg',centered: true}).result.then((result) => {
                console.log(result)
      
               this.godeleteExtra(extra);
      
              }, (reason) => {
              //  this.closeResult = this.getDismissReason(reason);
      
              });
            }
      
            godeleteExtra(extra){
              let url:string = this.url+"deleteextra.php";
              let datapost = new FormData();
              datapost.append('extra_id',extra.extra_id);
              let data:Observable<any> =  this.http.post(url,datapost);
              data.subscribe(res =>{  
                console.log(res);
                this.alertDeleteExtraSuccsss(this.extraName);
                //this.deleteSuccessMessage();
               //window.location.reload();
              }
              );
            }


            async alertAddExtraSuccsss(){
              this.Swal.swalOptions = {};
              this.Swal.swalOptions = {
                position: 'center',
                icon: 'success',
                title: 'Extra added',
                text: '',
                showConfirmButton: false,
                timer: 1500
              };
              await this.Swal.fire();
              }
      
              async alertUpdateExtraSuccsss(){
                this.Swal.swalOptions = {};
                this.Swal.swalOptions = {
                  position: 'center',
                  icon: 'success',
                  title: 'Extra updated',
                  text: '',
                  showConfirmButton: false,
                  timer: 1500
                };
                await this.Swal.fire();
                }
      
                async alertDeleteExtraSuccsss(extraName){
                  this.Swal.swalOptions = {
                    position: 'center',
                    icon: 'success',
                    title: '<p class="text-danger">'+extraName +'</p>',
                    text: 'Extra deleted!',
                    showConfirmButton: false,
                    timer: 1500
                  };
                  await this.Swal.fire();
                  this.selectExtra();
                  }
      
      
                
  
}

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Deleted</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p class="text-danger"><strong>{{name}}</strong> deleted</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) {}

  
}


