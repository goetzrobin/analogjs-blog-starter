import {
  AfterViewChecked,
  Directive,
  inject,
  OnChanges,
  OnInit, TemplateRef, ViewContainerRef,
} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {ContentRenderer, injectContent} from "@analogjs/content";
import {ContentMetadata, ContentWithMetadata} from "../content-metadata/content-metadata";
import {take} from "rxjs";
import {isEmpty} from "../util/is-empty";

@Directive({
  selector: '[analogContent]',
  standalone: true,
})
export default class AnalogContentDirective
  implements OnInit, OnChanges, AfterViewChecked {
  private _templateRef = inject(TemplateRef<any>)
  private _viewContainer = inject(ViewContainerRef)
  private _sanitizer = inject(DomSanitizer);
  private _contentRenderer = inject(ContentRenderer);
  private _content = injectContent<ContentMetadata>();

  static ngTemplateContextGuard(
    directive: AnalogContentDirective,
    context: unknown
  ): context is ContentWithMetadata {
    return true;
  }

  ngOnInit() {
    this.updateContent()
  }

  ngOnChanges(): void {
    this.updateContent();
  }

  updateContent() {
    this._content.pipe(take(1)).subscribe(({content, attributes}) => {
      if (!attributes || !content) {
        return;
      }
      this._contentRenderer.render(content).then(body => {
        if (!content || isEmpty(attributes)) {
          return
        }
        this._viewContainer.clear();
        const context: ContentWithMetadata = {
          metadata: {
            ...attributes,
            date: new Date(attributes['date']),
          },
          content: this._sanitizer.bypassSecurityTrustHtml(body)
        };
        this._viewContainer.createEmbeddedView(this._templateRef, context);
      })
    })
  }

  ngAfterViewChecked() {
    this._contentRenderer.enhance();
  }
}
