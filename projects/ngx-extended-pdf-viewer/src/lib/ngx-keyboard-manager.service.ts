import { Injectable } from '@angular/core';
import { IPDFViewerApplication } from '../public_api';
import { IPDFViewerApplicationOptions } from './options/pdf-viewer-application-options';

@Injectable({
  providedIn: 'root',
})
export class NgxKeyboardManagerService {
  private PDFViewerApplication?: IPDFViewerApplication;

  private PDFViewerApplicationOptions?: IPDFViewerApplicationOptions;
  constructor() {}

  public isKeyIgnored(cmd: number, keycode: number | 'WHEEL'): boolean {
    const ignoreKeys: Array<string> = this.PDFViewerApplicationOptions?.get('ignoreKeys');
    const acceptKeys: Array<string> = this.PDFViewerApplicationOptions?.get('acceptKeys');
    if (keycode === 'WHEEL') {
      if (!!ignoreKeys && this.isKeyInList(ignoreKeys, cmd, 'WHEEL')) {
        return true;
      }
      if (!!acceptKeys && acceptKeys.length > 0) {
        return !this.isKeyInList(acceptKeys, cmd, 'WHEEL');
      }

      return false;
    }

    if (keycode === 16 || keycode === 17 || keycode === 18 || keycode === 224) {
      // ignore solitary SHIFT, ALT, CMD, and CTRL because they only make sense as two-key-combinations
      return true;
    }
    // cmd is a bit-array:
    // 1 == CTRL
    // 2 == ALT
    // 4 == SHIFT
    // 8 == META
    const ignoreKeyboard = this.PDFViewerApplicationOptions?.get('ignoreKeyboard');
    if (!!ignoreKeyboard) {
      return true;
    }

    if (!!ignoreKeys && ignoreKeys.length > 0) {
      if (this.isKeyInList(ignoreKeys, cmd, keycode)) {
        return true;
      }
    }

    if (!!acceptKeys && acceptKeys.length > 0) {
      return !this.isKeyInList(acceptKeys, cmd, keycode);
    }
    return false;
  }

  private isKeyInList(settings: Array<string>, cmd: number, keycode: number | 'WHEEL'): boolean {
    if (!settings) {
      return true;
    }
    return settings.some((keyDef) => this.isKey(keyDef, cmd, keycode));
  }

  private isKey(keyDef: string, cmd: number, keycode: number | 'WHEEL'): boolean {
    let cmdDef = 0;
    let key = 0;
    keyDef = keyDef.toLowerCase();
    // tslint:disable: no-bitwise
    if (keyDef.includes('ctrl+')) {
      cmdDef |= 1;
      keyDef = keyDef.replace('ctrl+', '');
    }
    if (keyDef.includes('cmd+')) {
      cmdDef |= 8;
      keyDef = keyDef.replace('cmd+', '');
    }
    if (keyDef.includes('alt+')) {
      cmdDef |= 2;
      keyDef = keyDef.replace('alt+', '');
    }
    if (keyDef.includes('shift+')) {
      cmdDef |= 4;
      keyDef = keyDef.replace('shift+', '');
    }
    if (keyDef.includes('meta+')) {
      cmdDef |= 8;
      keyDef = keyDef.replace('meta+', '');
    }

    if (keyDef === 'up') {
      key = 38;
    } else if (keyDef === 'down') {
      key = 40;
    } else if (keyDef === '+' || keyDef === '"+"') {
      key = 171;
    } else if (keyDef === '-' || keyDef === '"-"') {
      key = 173;
    } else if (keyDef === 'esc') {
      key = 27;
    } else if (keyDef === 'enter') {
      key = 13;
    } else if (keyDef === 'space') {
      key = 32;
    } else if (keyDef === 'f4') {
      key = 115;
    } else if (keyDef === 'backspace') {
      key = 8;
    } else if (keyDef === 'home') {
      key = 36;
    } else if (keyDef === 'end') {
      key = 35;
    } else if (keyDef === 'left') {
      key = 37;
    } else if (keyDef === 'right') {
      key = 39;
    } else if (keyDef === 'pagedown') {
      key = 34;
    } else if (keyDef === 'pageup') {
      key = 33;
    } else {
      key = keyDef.toUpperCase().charCodeAt(0);
    }
    if (keycode === 'WHEEL') {
      return keyDef === 'wheel' && cmd === cmdDef;
    }
    return key === keycode && cmd === cmdDef;
  }

  public registerKeyboardListener(PDFViewerApplication: IPDFViewerApplication, PDFViewerApplicationOptions: IPDFViewerApplicationOptions) {
    this.PDFViewerApplication = PDFViewerApplication;
    this.PDFViewerApplicationOptions = PDFViewerApplicationOptions;
    PDFViewerApplication.ngxKeyboardManager = this;
  }

  public unregisterKeyboardListener() {
    if (this.PDFViewerApplication) {
      delete this.PDFViewerApplication.ngxKeyboardManager;
    }
    this.PDFViewerApplication = undefined;
    this.PDFViewerApplicationOptions = undefined;
  }
}
