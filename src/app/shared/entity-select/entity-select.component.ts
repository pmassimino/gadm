import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EntitySelectView } from '../models/model';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EntitySelectDialogComponent } from '../entity-select-dialog/entity-select-dialog.component';
import { EntityMultiSelectDialogComponent } from '../entity-multi-select-dialog/entity-multi-select-dialog.component';

@Component({
  selector: 'app-entity-select',
  templateUrl: './entity-select.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrl: './entity-select.component.css'
})
export class EntitySelectComponent implements OnChanges {

  constructor(private dialog: MatDialog) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    // Si hay cambios en id o en data, verificamos si podemos ejecutar find()
    if (changes['id'] || changes['data']) {
      this.find();  // Llamamos a find() cada vez que id o data cambian
    }
  }

  @Input()
  id: string;
  @Input()
  data: EntitySelectView[] = [];
  @Output() onChange = new EventEmitter<string>();

  updateValue() {
    this.onChange.emit(this.id);
  }

  entitySelected: EntitySelectView = null;

  find(): void {
    if (this.id && this.data.length > 0) {  // Verifica que id y data existan
      const entity = this.data.find((entity) => entity.Id === this.id);
      this.entitySelected = entity || null;
    }
  }
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "dialog-responsive";
    dialogConfig.data = { entityData: this.data, titulo: "Seleccione un item" };
    dialogConfig.width = "50%";
    dialogConfig.height = "80%";
    this.dialog.open(EntitySelectDialogComponent, dialogConfig).afterClosed()
      .subscribe(response => {
        if (response.result == "ok") {
          if (response && response.selectedEntities) {
            const entitySelected: EntitySelectView[] = response.selectedEntities;
            entitySelected.forEach(element => {
              this.entitySelected = element
              this.id = element.Id;
              element.Selected = false;
              this.updateValue();
            });
          }
        }
      });
  }
}
