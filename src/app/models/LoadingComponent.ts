export class LoadingComponent {
    private loading: number;

    constructor() {
        this.loading = 0;
    }

    public startLoading() {
        this.loading += 1;
    }

    public finishLoading() {
        this.loading -= 1;
    }

    public isLoading(): boolean {
        return this.loading > 0;
    }
}