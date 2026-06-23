import { login as apiLogin, LoginParams, getCategories, CategoryParams } from "@ministore/api";
import { makeAutoObservable, runInAction } from "mobx";

const TOKEN_STORAGE_KEY = "ministorAdminToken";

type UserInfo = {
    email: string;
}

export class UserStore {
    token = localStorage.getItem(TOKEN_STORAGE_KEY);

    user: UserInfo | null = null;

    categories: CategoryParams[] = [];
    
    loadError: string | null = null;

    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    async loadCat() {
        if (this.isLoading) {
            return;
        }
        
        this.isLoading = true;
        this.loadError = null;
        
        try {
            const loadedCategories = await getCategories();
        
            runInAction(() => {
                this.categories = loadedCategories;
                this.isLoading = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadError = "Не удалось загрузить категории";
                this.isLoading = false;
            })
        }
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