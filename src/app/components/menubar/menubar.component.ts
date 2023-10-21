import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'

@Component({
  selector: 'menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
})
export class MenubarComponent implements OnInit {
  @Output() notifyParentRefresh: EventEmitter<any> = new EventEmitter()
  @Output() notifyParentClone: EventEmitter<any> = new EventEmitter()
  @Output() notifyParentAdd: EventEmitter<any> = new EventEmitter()
  @Output() notifyParentDelete: EventEmitter<any> = new EventEmitter()
  @Output() notifyParentBackUp: EventEmitter<any> = new EventEmitter()
  @Output() notifyParentRestore: EventEmitter<any> = new EventEmitter()
  @Output() notifyParentSend: EventEmitter<any> = new EventEmitter()
  @Output() notifyParentJsonDownload: EventEmitter<any> = new EventEmitter()
  @Output() notifyParentJsonUpload: EventEmitter<any> = new EventEmitter()
  unreadCount = 1

  @Input() public inTitle: string | undefined
  @Input() public inPartyRef: string | undefined

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    )

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  formPartyRefChanged(partyRef: string) {
    // console.debug ('From MenuBarcomponent: ', partyRef);
  }

  onDelete() {
    //  // console.debug ('Delete emitter is sent:', this.inPartyRef);
    this.notifyParentDelete.emit()
  }

  onRefresh() {
    //  // console.debug ('Refresh emitter is sent');
    this.notifyParentRefresh.emit()
  }

  onClickClone() {
    //  // console.debug ('Clone emitter is sent');
    this.notifyParentClone.emit()
  }

  onSend() {
    //  // console.debug ('Send emitter is sent');
    this.notifyParentSend.emit()
  }

  onBackUp() {
    //  // console.debug ('Back Up emitter is sent');
    this.notifyParentBackUp.emit()
  }

  onRestore() {
    //  // console.debug ('Restore emitter is sent');
    this.notifyParentRestore.emit()
  }

  onClickAdd() {
    //  // console.debug ('Add emitter is sent');
    this.notifyParentAdd.emit()
  }

  onClickRefresh() {
    this.onRefresh()
  }

  onClickDelete() {
    this.onDelete()
  }

  onClickSend() {
    this.onSend()
  }

  onClickBackUp() {
    this.onBackUp()
  }

  onClickRestore() {
    this.onRestore()
  }

  ngOnDestroy() {}
}
