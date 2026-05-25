import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { AppComponent } from './app.component';

@Component({ selector: 'app-p-header', template: '', standalone: false })
class PHeaderStub {
  @Input() title = '';
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, PHeaderStub],
      imports: [RouterModule],
      providers: [provideRouter([]), provideLocationMocks()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "Country Explorer"', () => {
    expect(component.title).toBe('Country Explorer');
  });

  it('should pass title to app-p-header', () => {
    const header = fixture.debugElement.children.find(
      (c) => c.name === 'app-p-header',
    );
    expect(header?.componentInstance.title).toBe('Country Explorer');
  });

  it('should render a skip-to-content link targeting #main-content', () => {
    const link = el.querySelector<HTMLAnchorElement>('.skip-to-content');
    expect(link).toBeTruthy();
    expect(link!.getAttribute('href')).toContain('main-content');
  });

  it('should render a <main> element with id "main-content"', () => {
    expect(el.querySelector('main#main-content')).toBeTruthy();
  });

  it('should render a router-outlet inside main', () => {
    expect(el.querySelector('main router-outlet')).toBeTruthy();
  });
});
