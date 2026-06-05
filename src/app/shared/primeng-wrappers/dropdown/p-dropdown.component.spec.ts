import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PDropdownComponent } from './p-dropdown.component';

describe('PDropdownComponent', () => {
  let fixture: ComponentFixture<PDropdownComponent>;
  let component: PDropdownComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PDropdownComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default input values', () => {
    it('should default id to empty string', () => expect(component.id()).toBe(''));
    it('should default options to empty array', () => expect(component.options()).toEqual([]));
    it('should default placeholder to empty string', () => expect(component.placeholder()).toBe(''));
    it('should default showClear to false', () => expect(component.showClear()).toBe(false));
    it('should default value to null', () => expect(component.value()).toBeNull());
    it('should default disabled to false', () => expect(component.disabled()).toBe(false));
  });

  describe('FormValueControl — value model', () => {
    it('should update via value.set()', () => {
      component.value.set('Europe');
      expect(component.value()).toBe('Europe');
    });

    it('should accept null', () => {
      component.value.set('Europe');
      component.value.set(null);
      expect(component.value()).toBeNull();
    });
  });

  describe('FormValueControl — touch output', () => {
    it('should be emittable', () => {
      const onTouched = jest.fn();
      component.touch.subscribe(onTouched);
      component.touch.emit();
      expect(onTouched).toHaveBeenCalled();
    });
  });
});
