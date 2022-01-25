//import { Observable } from '@nativescript/core'
import { BehaviorSubject, Observable } from 'rxjs'

export class SelectedPageService {
//  if (SelectedPageService._instance) {
//    throw new Error('Use SelectedPageService.getInstance() instead of new.')
//  }


  static _instance = new SelectedPageService()

  // Observable selectedPage source
  _selectedPageSource: BehaviorSubject<string> = new BehaviorSubject('')

  // Observable selectedPage stream
  selectedPage$: Observable<string>;

  constructor() {
    this.selectedPage$ = this._selectedPageSource.asObservable()
  }

  public static getInstance(): SelectedPageService {
    return SelectedPageService._instance
  }

  public updateSelectedPage(selectedPage) {
    this._selectedPageSource.next(selectedPage)
  }
}


