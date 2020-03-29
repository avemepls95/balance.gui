import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TranslateHelper {

    public static ruKey: string = 'ru';
    public static enKey: string = 'en';

    constructor(
        private translateService: TranslateService,
        private cookieService: CookieService
    ) {
    }

    getCurrentLanguage(): string {
        return this.translateService.currentLang;
    }

    switchToLanguage(languageKey: string) {
        this.translateService.use(languageKey);
        this.cookieService.set('language', languageKey);
    }

    setDefaultLanguage(languageKey: string) {
        this.translateService.setDefaultLang(languageKey);
    }

    restoreCurrentLanguage() {
        let language = this.cookieService.get('language');
        if (language == '')
            language = TranslateHelper.ruKey;

        this.translateService.use(language);
    }

    getValue(path: string): string {
        return this.translateService.instant(path);
    }
}