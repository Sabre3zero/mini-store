import { login as apiLogin, LoginParams } from "@ministore/api";
import { makeAutoObservable, runInAction } from "mobx";

const TOKEN_STORAGE_KEY = "ministorAdminToken";

type UserInfo = {
    email: string;
}

export class UserStore {
    token = localStorage.getItem(TOKEN_STORAGE_KEY);

    user: UserInfo | null = null

    constructor() {
        makeAutoObservable(this)
    }

    async login (params: LoginParams) {
        const user = await apiLogin(params)

        localStorage.setItem(TOKEN_STORAGE_KEY, user.token);

        runInAction(() => {
            this.token = user.token;
            this.user = {
                email: user.email
            }
        })
    }

    logout () {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        this.token = null;
            this.user = null;
    }
}