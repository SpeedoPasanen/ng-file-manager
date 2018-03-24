export class NgfmRestConfig {
    baseUrl: string = '';
    constructor(init: NgfmRestConfig) {
        Object.assign(this, init);
        // Make sure baseUrl starts with / unless it starts with http(s):
        this.baseUrl = this.baseUrl.replace(/^\//, '').replace(/\/$/, '');
        console.log(this);
    }
}