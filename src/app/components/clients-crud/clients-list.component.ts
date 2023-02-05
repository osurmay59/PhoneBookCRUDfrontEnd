import { validateVerticalPosition } from '@angular/cdk/overlay';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Client } from 'src/app/interface/client';
import { ClientService } from 'src/app/services/client.service';

enum ActionType {
  CREATE = "Create",
  EDIT= "Edit"
}

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit, AfterViewInit{

  form: FormGroup;
  selectedId: number | undefined;
  actionType: ActionType = ActionType.CREATE;

  displayedColumns: string[] = ['PhoneNum', 'FirstName', 'LastName', 'Comments', 'Actions'];
  dataSource = new MatTableDataSource<Client>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //applyFilter: any;



  constructor(private _snackBar: MatSnackBar, private modalService: NgbModal, private _clientService: ClientService, private fb: FormBuilder){
    this.form = this.fb.group({
      PhoneNumber: ['',[ Validators.required, Validators.minLength(12)]],
      FirstName: ['', [Validators.required, Validators.maxLength(15)]],
      LastName: ['', [Validators.required,Validators.maxLength(15)]],
      Comments: ['', [Validators.required, Validators.maxLength(1500)]],
    })
  }
  
  ngOnInit():void{
    this.getClients()
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getClients(){
    this._clientService.getClients().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
    error: (error) => {
      console.log(error);
    }
    });
  }

  genClientFromForm () : Client {
    return  {
      PhoneNumber: this.form.value.PhoneNumber,
      FirstName: this.form.value.FirstName,
      LastName: this.form.value.LastName,
      Comments: this.form.value.Comments,
    };
  }

  onCreateClient(content: any) {
   this.actionType = ActionType.CREATE;
   this.form.reset();
    this.open(content);
  }

  createClient(){
   const client = this.genClientFromForm();

    this._clientService.saveClient(client).subscribe({
      next: () => {
        this.getClients()
        this._snackBar.open('The client was created succesfuly','',{
          duration: 2000,
          verticalPosition: 'top'
        });
        this.modalService.dismissAll();
      }
     })
  }

  updateClient(){
    if(this.selectedId){
      const client = this.genClientFromForm();
      this._clientService.updateClient(this.selectedId, client).subscribe({
        next: (data) => {
          this.getClients()
          this._snackBar.open('The client was updated succesfuly','',{
            duration: 2000,
            verticalPosition: 'top'
          });
          this.modalService.dismissAll();
          this.selectedId = undefined;
        }
      })
    }
  }

  onDeleteClient(id: number, content: any){
    this.selectedId = id;
    this.open(content);
  }

  deleteClient(){
    this._clientService.deleteClient(this.selectedId!).subscribe(()=>{
      this._snackBar.open('The client was succesfuly deleted','',{
        duration: 2000,
        verticalPosition: 'top'
      });
      this.modalService.dismissAll()
      this.getClients();
      this.selectedId = undefined;
    })

    

  }

  onEditClient(id: number, content: any){
    this.selectedId = id;
    this.actionType = ActionType.EDIT;
    this._clientService.getClient(id).subscribe({
      next: (data) => {
        this.form.setValue({
          PhoneNumber: data.PhoneNumber,
          FirstName: data.FirstName,
          LastName: data.LastName,
          Comments: data.Comments
        })
        this.open(content);
      }
    })
  }

  saveClient(){
    if(this.selectedId){
      this.updateClient()
    }else{
      this.saveClient()
    }
  }
  
  open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			
		);
	}


}
