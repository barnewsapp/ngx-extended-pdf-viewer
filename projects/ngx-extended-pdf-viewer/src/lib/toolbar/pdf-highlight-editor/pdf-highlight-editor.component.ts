import { ChangeDetectorRef, Component, Input, effect } from '@angular/core';
import { AnnotationEditorEditorModeChangedEvent } from '../../events/annotation-editor-mode-changed-event';
import { IPDFViewerApplication } from '../../options/pdf-viewer-application';
import { PDFNotificationService } from '../../pdf-notification-service';
import { ResponsiveVisibility } from '../../responsive-visibility';

@Component({
  selector: 'pdf-highlight-editor',
  templateUrl: './pdf-highlight-editor.component.html',
  styleUrls: ['./pdf-highlight-editor.component.css'],
})
export class PdfHighlightEditorComponent {
  @Input()
  public show: ResponsiveVisibility = true;

  public isSelected = false;

  private PDFViewerApplication: IPDFViewerApplication | undefined;

  constructor(private notificationService: PDFNotificationService, private cdr: ChangeDetectorRef) {
    effect(() => {
      this.PDFViewerApplication = notificationService.onPDFJSInitSignal();
      if (this.PDFViewerApplication) {
        this.onPdfJsInit();
      }
    });
  }

  private onPdfJsInit() {
    this.PDFViewerApplication?.eventBus.on('annotationeditormodechanged', ({ mode }: AnnotationEditorEditorModeChangedEvent) => {
      setTimeout(() => {
        this.isSelected = mode === 9;
        this.cdr.detectChanges();
      });
    });
  }

  public onClick(event: PointerEvent): void {
    let button = event.target;
    while (button && button instanceof Element && !(button instanceof HTMLButtonElement)) {
      button = button.parentElement;
    }
    if (button instanceof HTMLButtonElement) {
      if (button.id !== 'primaryEditorHighlight') {
        document.getElementById('primaryEditorHighlight')?.click();
      }
    }
  }
}
