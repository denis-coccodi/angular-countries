import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { PHeaderComponent } from './p-header.component';

describe('PHeaderComponent', () => {
  let fixture: ComponentFixture<PHeaderComponent>;
  let component: PHeaderComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PHeaderComponent],
      providers: [provideRouter([]), provideLocationMocks()],
    }).compileComponents();

    fixture = TestBed.createComponent(PHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('title', () => {
    it('should default title to empty string', () => {
      expect(component.title()).toBe('');
    });

    it('should render the title in the header', () => {
      fixture.componentRef.setInput('title', 'Country Explorer');
      fixture.detectChanges();
      expect(el.querySelector('.header-title span')?.textContent?.trim()).toBe('Country Explorer');
    });
  });

  describe('navigation', () => {
    it('should render a nav element with aria-label', () => {
      const nav = el.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute('aria-label')).toBe('Main navigation');
    });

    it('should have a link to /countries', () => {
      const links = el.querySelectorAll<HTMLAnchorElement>('a');
      const countriesLink = Array.from(links).find((a) => a.textContent?.includes('Countries'));
      expect(countriesLink).toBeTruthy();
      expect(countriesLink?.getAttribute('href')).toContain('countries');
    });

    it('should have a link to /compare', () => {
      const links = el.querySelectorAll<HTMLAnchorElement>('a');
      const compareLink = Array.from(links).find((a) => a.textContent?.includes('Compare'));
      expect(compareLink).toBeTruthy();
      expect(compareLink?.getAttribute('href')).toContain('compare');
    });

    it('should render the globe icon', () => {
      expect(el.querySelector('.pi.pi-globe')).toBeTruthy();
    });
  });
});
