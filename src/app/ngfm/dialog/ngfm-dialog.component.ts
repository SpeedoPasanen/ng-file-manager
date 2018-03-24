import { Component, Inject, OnInit, HostBinding } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgfmApi } from '../connectors/ngfm-api';

@Component({
    selector: 'ngfm-dialog',
    templateUrl: './ngfm-dialog.component.html',
    styleUrls: ['./ngfm-dialog.component.css']
})
export class NgfmDialogComponent implements OnInit {
    @HostBinding('class.ngfm-dialog') private _hostClass = true;
    promptValue = '';
    public buttons = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ref: MatDialogRef<NgfmDialogComponent>,
        public ngfm: NgfmApi
    ) {
    }

    ngOnInit() {
        this.promptValue = this.data.defaultValue || '';
        this.buttons = this.data.buttons ? this.data.buttons.map(b => { b.color = b.color || ''; return b; }) : [
            { text: 'OK', color: 'primary', value: true }
        ];
        if (this.data.cancelable) {
            this.buttons.push({ text: 'CANCEL', color: 'warn', value: false });
        }
    }
    clicked(btn: any) {
        return this.ref.close(this.data.isPrompt && btn.value ? this.trim(this.promptValue) : btn.value);
    }
    private trim(s: string) {
        return ('' + s).replace(/^\s+/, '').replace(/\s+$/, '');
    }
    close(value: any = null) {
        this.ref.close(value);
    }
}
