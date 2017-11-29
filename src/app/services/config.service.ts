/**
 * Created by baimi on 2017/11/24.
 * copied from https://stackoverflow.com/questions/42110817/load-config-json-file-in-angular-2/42111501#42111501
 */


import { Injectable, APP_INITIALIZER } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment'; //path to your environment files

@Injectable()
export class ConfigService {

    private _config: Object
    private _env: string;

    constructor(private _http: Http) { }
    load() {
        return new Promise((resolve, reject) => {
            this._env = 'development';
            if (environment.production)
                this._env = 'production';
            console.log(this._env)
            this._http.get('./assets/config/' + this._env + '.json')
                .map(res => res.json())
                .subscribe((data) => {
                        this._config = data;
                        resolve(true);
                    },
                    (error: any) => {
                        console.error(error);
                        return Observable.throw(error.json().error || 'Server error');
                    });
        });
    }
    // Is app in the development mode?
    isDevmode() {
        return this._env === 'development';
    }
    // Gets API route based on the provided key
    getApi(key: string): string {
        return this._config["API_ENDPOINTS"][key];
    }
    // Gets a value of specified property in the configuration file
    get(key: any) {
        return this._config[key];
    }
}

export function ConfigFactory(config: ConfigService) {
    return () => config.load();
}

export function init() {
    return {
        provide: APP_INITIALIZER,
        useFactory: ConfigFactory,
        deps: [ConfigService],
        multi: true
    }
}

const ConfigModule = {
    init: init
}

export { ConfigModule };
