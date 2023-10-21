import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class TextEditorService {
  introduction: string;
  body: string;
  conclusion: string;

  public introductionUpdated = new EventEmitter<string>();
  public bodyUpdated = new EventEmitter<string>();
  public conclusionUpdated = new EventEmitter<string>();

  setIntroduction(ref: string) {
    this.introduction = ref;
    this.introductionUpdated.emit(ref);
  }
  setBody(ref: string) {
    this.body = ref;
    this.bodyUpdated.emit(ref);
  }
  setConclusion(ref: string) {
    this.conclusion = ref;
    this.conclusionUpdated.emit(ref);
  }

  getIntroduction() {
    return this.introduction;
  }
  getBody(ref: string) {
    return this.body;
  }
  getConclusion(ref: string) {
    return this.conclusion;
  }
}
