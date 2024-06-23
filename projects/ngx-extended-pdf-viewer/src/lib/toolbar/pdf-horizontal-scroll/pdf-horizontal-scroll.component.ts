import { Component, EventEmitter, Input, NgZone, Output, effect } from '@angular/core';
import { ScrollMode } from '../../options/pdf-scroll-mode';
import { PageViewModeType, ScrollModeType } from '../../options/pdf-viewer';
import { IPDFViewerApplication } from '../../options/pdf-viewer-application';
import { PDFNotificationService } from '../../pdf-notification-service';
import { ResponsiveVisibility } from '../../responsive-visibility';

@Component({
  selector: 'pdf-horizontal-scroll',
  templateUrl: './pdf-horizontal-scroll.component.html',
  styleUrls: ['./pdf-horizontal-scroll.component.css'],
})
export class PdfHorizontalScrollComponent {
  @Input()
  public show: ResponsiveVisibility = true;

  @Input()
  public scrollMode: ScrollModeType;

  @Input()
  public pageViewMode: PageViewModeType;

  @Output()
  public pageViewModeChange = new EventEmitter<PageViewModeType>();

  public onClick: () => void;

  private PDFViewerApplication: IPDFViewerApplication | undefined;

  constructor(private notificationService: PDFNotificationService, private ngZone: NgZone) {
    effect(() => {
      this.PDFViewerApplication = notificationService.onPDFJSInitSignal();
      if (this.PDFViewerApplication) {
        this.onPdfJsInit();
      }
    });
    const emitter = this.pageViewModeChange;
    this.onClick = () => {
      this.ngZone.run(() => {
        if (this.pageViewMode !== 'multiple' && this.pageViewMode !== 'infinite-scroll') {
          emitter.emit('multiple');
        }
        this.PDFViewerApplication?.eventBus.dispatch('switchscrollmode', { mode: ScrollMode.HORIZONTAL });
      });
    };
  }

  public onPdfJsInit(): void {
    this.PDFViewerApplication?.eventBus.on('switchscrollmode', (event) => {
      this.ngZone.run(() => {
        this.scrollMode = event.mode;
      });
    });
  }
}
